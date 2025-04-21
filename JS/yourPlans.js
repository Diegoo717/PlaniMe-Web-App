document.addEventListener('DOMContentLoaded', function() {
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
});