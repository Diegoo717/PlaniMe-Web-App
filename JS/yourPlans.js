let allPlans = [];
let currentPlanToDelete = null;
let currentTokenForDelete = null;

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    fetch("http://85.239.244.71:5000/api/protected/session", {
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
        document.body.style.visibility = 'visible';
        setTimeout(() => {
            document.body.style.overflow = "auto";
        }, 4200); 
        loadUserPlans(token);
    })
    .catch(error => {
        localStorage.removeItem("token");
        window.location.href = "login.html"; 
    });

    const detailView = document.getElementById('planDetailView');
    const closeDetail = document.getElementById('closePlanDetail');
    
    closeDetail.addEventListener('click', function() {
        detailView.classList.remove('active');
    });
    
    detailView.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    const modal = document.getElementById('confirmModal');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');
    
    confirmBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        executeDeletePlan();
    });
    
    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        currentPlanToDelete = null;
        currentTokenForDelete = null;
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            currentPlanToDelete = null;
            currentTokenForDelete = null;
        }
    });

    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');

    searchInput.addEventListener('input', () => {
        filterAndRenderPlans();
    });

    filterSelect.addEventListener('change', () => {
        filterAndRenderPlans();
    });
});

function loadUserPlans(token) {
    document.body.style.overflow = "hidden"; 
    fetch("http://85.239.244.71:5000/api/protected/getPlansByID", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al obtener los planes");
        }
        return response.json();
    })
    .then(data => {
        if (data.success && data.plans.length > 0) {
            allPlans = data.plans;
            filterAndRenderPlans();
        } else {
            showNoPlansMessage();
        }
    })
    .catch(error => {
        showNoPlansMessage();
    });
}

function filterAndRenderPlans() {
    document.body.style.overflow = "hidden";
    const searchInput = document.getElementById('searchInput');
    const filterSelect = document.getElementById('filterSelect');
    const currentDate = new Date();

    let filteredPlans = allPlans.filter(plan => {
        const matchesSearch = plan.name.toLowerCase().includes(searchInput.value.toLowerCase());
        const expiresDate = new Date(plan.details.createdAt);
        expiresDate.setDate(expiresDate.getDate() + 30);
        
        let matchesFilter = true;
        if (filterSelect.value === 'active') {
            matchesFilter = expiresDate > currentDate;
        } else if (filterSelect.value === 'expired') {
            matchesFilter = expiresDate <= currentDate;
        }

        return matchesSearch && matchesFilter;
    });

    renderPlans(filteredPlans, currentTokenForDelete || localStorage.getItem("token"));
}

function renderPlans(plans, token) {
    const plansContainer = document.getElementById('plansContainer');
    plansContainer.innerHTML = ''; 
    
    if (plans.length === 0) {
        showNoPlansMessage();
        return;
    }
    
    plans.forEach(plan => {
        const planCard = createPlanCard(plan, token);
        plansContainer.appendChild(planCard);
    });
    setTimeout(() => {
        document.body.style.overflow = "auto";
    }, 4200);
}

function createPlanCard(plan, token) {
    const planCard = document.createElement('div');
    planCard.className = 'plan-card';
    planCard.dataset.planId = plan.details.id;

    const createdAt = new Date(plan.details.createdAt);
    const createdDateStr = createdAt.toLocaleDateString('es-ES');
    const expiresDate = new Date(createdAt);
    expiresDate.setDate(expiresDate.getDate() + 30);
    const expiresDateStr = expiresDate.toLocaleDateString('es-ES');

    const currentDate = new Date();
    const isExpired = expiresDate <= currentDate;

    const planName = plan.name.split(' ')[0]; 
    const displayName = planName.charAt(0).toUpperCase() + planName.slice(1).toLowerCase();

    const genderMap = { 'm': 'Masculino', 'f': 'Femenino' };
    const activityMap = {
        'ligero': 'Ligero (1-2 días/semana)',
        'moderado': 'Moderado (3-4 días/semana)',
        'intenso': 'Intenso (5-7 días/semana)'
    };
    const goalMap = {
        'perder': 'Bajar de peso',
        'mantener': 'Mantener peso',
        'ganar': 'Ganar masa muscular'
    };
    
    planCard.innerHTML = `
        <div class="plan-preview">
            <img src="${plan.imageUrl}" alt="Vista previa del plan">
            <span class="plan-status ${isExpired ? 'expired' : 'active'}">${isExpired ? 'Expirado' : 'Activo'}</span>
        </div>
        <div class="plan-info">
            <h3>${displayName}</h3>
            <div class="plan-dates">
                <span>Creado: ${createdDateStr}</span>
                <span>Expira: ${expiresDateStr}</span>
            </div>
            <div class="user-data-summary">
                <span>${plan.details.age} años, ${genderMap[plan.details.gender]}</span> • 
                <span>${plan.details.weight}kg, ${plan.details.height}cm</span> • 
                <span>${activityMap[plan.details.activityLevel]}</span> • 
                <span>${goalMap[plan.details.goal]}</span>
            </div>
            <div class="plan-actions">
                <button class="action-btn view-btn">Ver</button>
                <button class="action-btn download-btn">Descargar</button>
                <button class="action-btn delete-btn">Eliminar</button>
            </div>
        </div>
    `;

    const viewBtn = planCard.querySelector('.view-btn');
    viewBtn.addEventListener('click', () => showPlanDetails(plan, expiresDateStr, token));

    const deleteBtn = planCard.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deletePlan(plan.details.id, token);
    });

    const downloadBtn = planCard.querySelector('.download-btn');
    downloadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        downloadImage(plan.imageUrl, plan.name);
    });
    
    return planCard;
}

function downloadImage(imageUrl, fileName) {
    if (!fileName) {
        fileName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
    }

    if (!fileName.toLowerCase().endsWith('.jpg') && 
        !fileName.toLowerCase().endsWith('.jpeg') && 
        !fileName.toLowerCase().endsWith('.png')) {
        fileName += '.jpg';
    }

    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();

            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            showToast('No se pudo descargar la imagen', 'error');
        });
}

function deletePlan(planId, token) {
    currentPlanToDelete = planId;
    currentTokenForDelete = token;

    const modal = document.getElementById('confirmModal');
    modal.style.display = 'flex';
}

function executeDeletePlan() {
    if (!currentPlanToDelete || !currentTokenForDelete) return;
    
    fetch(`http://85.239.244.71:5000/api/protected/deletePlanByID/${currentPlanToDelete}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${currentTokenForDelete}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el plan');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            showToast('Plan eliminado correctamente');
            loadUserPlans(currentTokenForDelete); 
        } else {
            throw new Error(data.error || 'Error al eliminar el plan');
        }
    })
    .catch(error => {
        showToast(error.message, 'error');
    })
    .finally(() => {
        currentPlanToDelete = null;
        currentTokenForDelete = null;
    });
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

function showPlanDetails(plan, expiresDateStr, token) {
    const detailView = document.getElementById('planDetailView');

    const genderMap = { 'm': 'Masculino', 'f': 'Femenino' };
    const activityMap = {
        'ligero': 'Ligero (1-2 días/semana)',
        'moderado': 'Moderado (3-4 días/semana)',
        'intenso': 'Intenso (5-7 días/semana)'
    };
    const goalMap = {
        'perder': 'Bajar de peso',
        'mantener': 'Mantener peso',
        'ganar': 'Ganar masa muscular'
    };

    const createdAt = new Date(plan.details.createdAt);
    const createdDateStr = createdAt.toLocaleDateString('es-ES');

    const planName = plan.name.split(' ')[0];
    const displayName = planName.charAt(0).toUpperCase() + planName.slice(1).toLowerCase();

    document.getElementById('detailPlanTitle').textContent = displayName;
    document.getElementById('detailPlanCreated').textContent = `Plan personalizado creado el ${createdDateStr}`;
    document.getElementById('detailPlanExpires').textContent = `Expira el: ${expiresDateStr}`;

    document.getElementById('userDataAge').textContent = `${plan.details.age} años`;
    document.getElementById('userDataGender').textContent = genderMap[plan.details.gender];
    document.getElementById('userDataWeight').textContent = `${plan.details.weight} kg`;
    document.getElementById('userDataHeight').textContent = `${plan.details.height} cm`;
    document.getElementById('userDataActivity').textContent = activityMap[plan.details.activityLevel];
    document.getElementById('userDataGoal').textContent = goalMap[plan.details.goal];

    document.querySelector('.pdf-view img').src = plan.imageUrl;

    detailView.classList.add('active');

    const deleteBtn = document.getElementById('deleteCurrentPlan');
    deleteBtn.onclick = () => {
        deletePlan(plan.details.id, token);
    };

    const downloadBtn = document.getElementById('downloadPlanPdf');
    downloadBtn.onclick = () => {
        downloadImage(plan.imageUrl, plan.name);
    };
}

function showNoPlansMessage() {
    const plansContainer = document.getElementById('plansContainer');
    plansContainer.innerHTML = `
        <div class="no-plans-message">
            <p>No se encontraron planes con los criterios seleccionados.</p>
        </div>
    `;
}