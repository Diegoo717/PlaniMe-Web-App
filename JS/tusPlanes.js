document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const detailView = document.getElementById('detailView');
    const closeDetail = document.getElementById('closeDetail');
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // Cerrar modal
    closeDetail.addEventListener('click', function() {
        detailView.classList.remove('active');
    });
    
    // Abrir modal al hacer clic en "Ver"
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const planCard = this.closest('.plan-card');
            const planId = planCard.dataset.planId;
            
            // Aquí podrías cargar datos dinámicos basados en planId
            // Por ahora usamos los datos estáticos del HTML
            
            detailView.classList.add('active');
        });
    });
    
    // Cerrar modal al hacer clic fuera del contenido
    detailView.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
    
    // Ejemplo de funcionalidad para los botones de descarga
    document.getElementById('downloadPdf').addEventListener('click', function() {
        alert('Descargando PDF...');
        // Aquí iría la lógica real de descarga
    });
    
    document.getElementById('downloadImage').addEventListener('click', function() {
        alert('Descargando como imagen...');
        // Aquí iría la lógica real de descarga
    });
    
    document.getElementById('deletePlan').addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres eliminar este plan?')) {
            alert('Plan eliminado');
            detailView.classList.remove('active');
            // Aquí iría la lógica real de eliminación
        }
    });
});