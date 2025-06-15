document.addEventListener("DOMContentLoaded", async () => {
  console.log("Dashboard cargado, iniciando verificación de autenticación...");

  const redirectToLogin = (reason) => {
    console.log("Redirigiendo al login:", reason);
    localStorage.removeItem("token");
    window.location.href = "login.html";
  };

  const showDashboard = (profileData) => {
    document.body.style.visibility = "visible";
    const dashboardTitle = document.getElementById("dashboard-title");
    if (dashboardTitle) {
      dashboardTitle.textContent = `Bienvenido/a ${profileData.firstName}!`;
    }
    console.log("Dashboard mostrado exitosamente");
  };

  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.has("from_google")) {
    console.log("Detectada redirección desde Google OAuth");

    if (!urlParams.has("auth_success")) {
      console.error("Autenticación con Google falló");
      redirectToLogin("Google authentication failed");
      return;
    }

    try {
      console.log("Solicitando token JWT al backend...");

      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await fetch(
        "http://localhost:5000/api/auth/google-token",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log(
        "Respuesta del servidor:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Error del servidor al obtener token:", errorData);
        throw new Error(
          `Error HTTP: ${response.status} - ${
            errorData.error || "Unknown error"
          }`
        );
      }

      const data = await response.json();
      console.log("Datos recibidos del servidor:", data);

      if (!data.token) {
        throw new Error("No se recibió token en la respuesta");
      }

      localStorage.setItem("token", data.token);
      window.history.replaceState({}, "", "/HTML/dashboard.html");

      console.log("Token guardado exitosamente, mostrando dashboard...");

      if (data.user) {
        showDashboard(data.user);
      } else {
        await verifyTokenAndShowDashboard();
      }
    } catch (error) {
      console.error("Error en autenticación Google:", error);
      redirectToLogin(`Google auth error: ${error.message}`);
      return;
    }
  } else {
    await verifyTokenAndShowDashboard();
  }

  async function verifyTokenAndShowDashboard() {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No hay token en localStorage");
      redirectToLogin("No token found");
      return;
    }

    console.log("Verificando token existente...");

    try {
      const sessionResponse = await fetch(
        "http://localhost:5000/api/protected/session",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!sessionResponse.ok) {
        throw new Error(`Token inválido o expirado: ${sessionResponse.status}`);
      }

      const sessionData = await sessionResponse.json();
      console.log("Sesión válida:", sessionData);

      const profileResponse = await fetch(
        "http://localhost:5000/api/protected/profile",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!profileResponse.ok) {
        throw new Error(
          `No se pudo obtener el perfil: ${profileResponse.status}`
        );
      }

      const profileData = await profileResponse.json();
      console.log("Datos del perfil:", profileData);

      showDashboard(profileData);
    } catch (error) {
      console.error("Error de verificación:", error.message);
      redirectToLogin(`Verification error: ${error.message}`);
      return;
    }
  }

  const setupEventListeners = () => {
    const createPlan = document.querySelector("#create-plan");
    const yourPlans = document.querySelector("#your-plans");
    const profile = document.querySelector("#profile");
    const yourProgress = document.querySelector("#progress");

    if (createPlan) {
      createPlan.addEventListener("click", function () {
        window.location.href = "createPlan.html";
      });
    }

    if (yourPlans) {
      yourPlans.addEventListener("click", function () {
        window.location.href = "yourPlans.html";
      });
    }

    if (profile) {
      profile.addEventListener("click", function () {
        window.location.href = "profile.html";
      });
    }

    if (yourProgress) {
      yourProgress.addEventListener("click", function () {
        window.location.href = "yourProgress.html";
      });
    }
  };
  setTimeout(setupEventListeners, 1000);
});
