document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    fetch("http://localhost:5000/api/protected/session", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Token inválido o expirado");
        }
        return response.json();
    })
    .then(data => {
        console.log("Sesión válida:", data);

        return fetch("http://localhost:5000/api/protected/profile", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("No se pudo obtener el perfil");
        }
        return response.json();
    })
    .then(profileData => {
        console.log("Datos del perfil:", profileData);
        
        document.body.style.visibility = 'visible';

        const dashboardTitle = document.getElementById("dashboard-title");
        dashboardTitle.textContent = "Bienvenido/a " + " " +profileData.firstName +"!"
    })
    .catch(error => {
        console.error("Error de sesión:", error.message);
        localStorage.removeItem("token");
        window.location.href = "login.html"; 
    });
});

const createPlan = document.querySelector("#create-plan");
const yourPlans = document.querySelector("#your-plans");
const profile = document.querySelector("#profile");

createPlan.addEventListener("click", function() {
    window.location.href = 'createPlan.html';
});

yourPlans.addEventListener("click", function() {
    window.location.href = 'yourPlans.html';
});

profile.addEventListener("click", function() {
    window.location.href = 'profile.html';
});