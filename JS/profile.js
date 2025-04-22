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
        // Luego, obtenemos los datos del perfil
        fetch("http://localhost:5000/api/protected/profile", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
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
            const fullName = `${profileData.firstName} ${profileData.lastName}`;
            document.querySelector(".dynamic-content").innerText = fullName; 
            document.querySelector(".dynamic-content2").innerText = " " + profileData.email; 
            
        })
    })
    .catch(error => {
        console.error("Error de sesión:", error.message);
        localStorage.removeItem("token");
        window.location.href = "login.html"; 
    });

});

const logOut = document.querySelector(".logout-btn")

        logOut.addEventListener("click", function logOut(){
        localStorage.removeItem("token");
        window.location.href = 'index.html';
    })
