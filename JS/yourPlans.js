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
        document.body.style.visibility = 'visible';
    })
    .catch(error => {
        console.error("Error de sesión:", error.message);
        localStorage.removeItem("token");
        window.location.href = "login.html"; 
    });

});

    const detailView = document.getElementById('planDetailView');
    const closeDetail = document.getElementById('closePlanDetail');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    closeDetail.addEventListener('click', function() {
        detailView.classList.remove('active');
    });
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planCard = this.closest('.plan-card');
            const planId = planCard.dataset.planId;
            
            detailView.classList.add('active');
        });
    });

    detailView.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    document.getElementById('downloadPlanPdf').addEventListener('click', function() {
        alert('Descargando PDF...');
    });
    
    document.getElementById('deleteCurrentPlan').addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres eliminar este plan?')) {
            alert('Plan eliminado');
            detailView.classList.remove('active');
        }
    });
