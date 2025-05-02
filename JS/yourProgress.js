let weightRecords = [];
let weightGoal = null;
let currentToken = null;

document.addEventListener("DOMContentLoaded", () => {
    // Obtener token de localStorage
    currentToken = localStorage.getItem("token");

    if (!currentToken) {
        window.location.href = "login.html";
        return;
    }

    // Verificar sesión
    checkSession(currentToken)
        .then(() => {
            document.body.style.visibility = 'visible';
            loadInitialData(currentToken);
        })
        .catch(error => {
            console.error("Error:", error);
            localStorage.removeItem("token");
            window.location.href = "login.html";
        });

    // Verificar que los elementos del DOM existan antes de configurar
    if (document.getElementById('registro-modal') && 
        document.getElementById('objetivo-modal') && 
        document.getElementById('confirmModal')) {
        // Configurar modales y eventos
        setupModals();
    } else {
        console.error("Error: Faltan elementos del DOM necesarios para los modales");
    }
    
    // Configurar event listeners sólo si existen los elementos
    setupEventListeners();
});

// Función para verificar sesión
async function checkSession(token) {
    try {
        const response = await fetch("http://localhost:5000/api/protected/session", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error("Token inválido o expirado");
        }
        
        return response.json();
    } catch (error) {
        console.error("Error en checkSession:", error);
        throw error;
    }
}

// Función para cargar datos iniciales
async function loadInitialData(token) {
    try {
        // Intentar cargar los registros de peso primero
        const records = await getAllWeightRecords(token);
        weightRecords = records;
        
        // Intentar cargar el objetivo de peso, pero manejar el caso de que la API no exista
        try {
            const goal = await getWeightGoal(token);
            const wg = document.getElementById('peso-objetivo')
            wg.textContent = goal;
        } catch (error) {
            console.warn("No se pudo cargar el objetivo de peso:", error);
            // Si la API no existe, podemos inicializar con un valor predeterminado o null
            weightGoal = null;
        }
        
        updateUI();
    } catch (error) {
        console.error("Error cargando datos iniciales:", error);
        showToast("Error al cargar datos", "error");
    }
}

// Función para obtener todos los registros de peso
async function getAllWeightRecords(token) {
    try {
        const response = await fetch("http://localhost:5000/api/protected/getAllWeightR", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error("Error al obtener registros de peso");
        }
        
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        console.error("Error en getAllWeightRecords:", error);
        return [];
    }
}

// Función para obtener el peso objetivo
async function getWeightGoal(token) {
    try {
        const response = await fetch("http://localhost:5000/api/protected/getWeightGoal", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error("Error al obtener el objetivo de peso");
        }
        
        const data = await response.json();
        console.log(data.data)
        return data.data;

    } catch (error) {
        console.error("Error en getWeightGoal:", error);
        throw error;
    }
}

// Función para configurar modales
function setupModals() {
    try {
        const registroModal = document.getElementById('registro-modal');
        const objetivoModal = document.getElementById('objetivo-modal');
        const confirmModal = document.getElementById('confirmModal');
        
        // Verificar que los elementos existan antes de usar forEach
        const modals = [registroModal, objetivoModal, confirmModal].filter(modal => modal !== null);
        
        // Cerrar modales al hacer clic fuera
        modals.forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        });
        
        // Configurar modal de confirmación si existe
        if (confirmModal) {
            const confirmBtn = document.getElementById('confirmDeleteBtn');
            const cancelBtn = document.getElementById('cancelDeleteBtn');
            
            if (confirmBtn) {
                confirmBtn.addEventListener('click', executeDelete);
            }
            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => {
                    confirmModal.classList.remove('active');
                });
            }
        }
    } catch (error) {
        console.error("Error en setupModals:", error);
    }
}

// Función para configurar event listeners
function setupEventListeners() {
    try {
        // Botón para agregar registro
        const addRecordBtn = document.getElementById('agregar-registro-btn');
        if (addRecordBtn) {
            addRecordBtn.addEventListener('click', () => {
                const modal = document.getElementById('registro-modal');
                if (modal) {
                    modal.classList.add('active');
                    const dateInput = document.getElementById('fecha-input');
                    if (dateInput) {
                        dateInput.value = new Date().toISOString().split('T')[0];
                    }
                }
            });
        }
        
        // Guardar registro
        const saveRecordBtn = document.getElementById('guardar-registro-btn');
        if (saveRecordBtn) {
            saveRecordBtn.addEventListener('click', saveWeightRecord);
        }
        
        // Cancelar registro
        const cancelRecordBtn = document.getElementById('cancelar-registro-btn');
        if (cancelRecordBtn) {
            cancelRecordBtn.addEventListener('click', () => {
                const modal = document.getElementById('registro-modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        }
        
        // Editar objetivo
        const editGoalBtn = document.getElementById('editar-objetivo');
        if (editGoalBtn) {
            editGoalBtn.addEventListener('click', () => {
                const goalInput = document.getElementById('objetivo-input');
                const goalModal = document.getElementById('objetivo-modal');
                if (goalInput && goalModal) {
                    goalInput.value = weightGoal || '';
                    goalModal.classList.add('active');
                }
            });
        }
        
        // Guardar objetivo
        const saveGoalBtn = document.getElementById('guardar-objetivo-btn');
        if (saveGoalBtn) {
            saveGoalBtn.addEventListener('click', saveWeightGoal);
        }
        
        // Cancelar objetivo
        const cancelGoalBtn = document.getElementById('cancelar-objetivo-btn');
        if (cancelGoalBtn) {
            cancelGoalBtn.addEventListener('click', () => {
                const modal = document.getElementById('objetivo-modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        }
    } catch (error) {
        console.error("Error en setupEventListeners:", error);
    }
}

// Función para guardar un nuevo registro de peso
async function saveWeightRecord() {
    try {
        const pesoInput = document.getElementById('peso-input');
        const fechaInput = document.getElementById('fecha-input');
        
        if (!pesoInput || !fechaInput) {
            showToast("Error: Faltan campos en el formulario", "error");
            return;
        }
        
        const pesoError = document.getElementById('peso-error');
        const fechaError = document.getElementById('fecha-error');
        
        // Validaciones
        let isValid = true;
        
        if (!pesoInput.value || isNaN(pesoInput.value)) {
            if (pesoError) pesoError.textContent = 'Ingresa un peso válido';
            isValid = false;
        } else {
            if (pesoError) pesoError.textContent = '';
        }
        
        if (!fechaInput.value) {
            if (fechaError) fechaError.textContent = 'Selecciona una fecha';
            isValid = false;
        } else {
            if (fechaError) fechaError.textContent = '';
        }
        
        if (!isValid) return;
        
        const response = await fetch("http://localhost:5000/api/protected/setWeightRecord", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentToken}`
            },
            body: JSON.stringify({
                weight: parseFloat(pesoInput.value),
                date: fechaInput.value
            })
        });
        
        if (!response.ok) {
            throw new Error("Error al guardar el registro");
        }
        
        const newRecord = await response.json();
        weightRecords.push(newRecord.data);
        updateUI();
        
        const modal = document.getElementById('registro-modal');
        if (modal) modal.classList.remove('active');
        
        pesoInput.value = '';
        
    } catch (error) {
        console.error("Error en saveWeightRecord:", error);
        showToast("Error al guardar el registro", "error");
    }
}

// Función para guardar el peso objetivo
async function saveWeightGoal() {
    try {
        const objetivoInput = document.getElementById('objetivo-input');
        const objetivoError = document.getElementById('objetivo-error');
        
        if (!objetivoInput) {
            showToast("Error: Falta el campo de objetivo", "error");
            return;
        }
        
        if (!objetivoInput.value || isNaN(objetivoInput.value)) {
            if (objetivoError) objetivoError.textContent = 'Ingresa un peso válido';
            return;
        }
        
        if (objetivoError) objetivoError.textContent = '';
        
        const response = await fetch("http://localhost:5000/api/protected/setWeightGoal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentToken}`
            },
            body: JSON.stringify({
                weightGoal: parseFloat(objetivoInput.value)
            })
        });
        
        if (!response.ok) {
            throw new Error("Error al guardar el objetivo");
        }
        
        const goal = await response.json();
        console.log(goal.data.weightGoal)
        weightGoal = goal.data.weightGoal;
        
        const pesoObjetivoElement = document.getElementById('peso-objetivo');
        if (pesoObjetivoElement) {
            pesoObjetivoElement.textContent = `${weightGoal} kg`;
        }
        
        const modal = document.getElementById('objetivo-modal');
        if (modal) modal.classList.remove('active');
        updateChart();
        
    } catch (error) {
        console.error("Error en saveWeightGoal:", error);
        showToast("Error al guardar el objetivo", "error");
    }
}

// Función para eliminar un registro
function deleteRecord(recordId) {
    try {
        const modal = document.getElementById('confirmModal');
        if (modal) {
            modal.dataset.recordId = recordId;
            modal.classList.add('active');
        } else {
            console.error("Modal de confirmación no encontrado");
        }
    } catch (error) {
        console.error("Error en deleteRecord:", error);
    }
}

// Función para ejecutar la eliminación
async function executeDelete() {
    try {
        const modal = document.getElementById('confirmModal');
        if (!modal) return;
        
        const recordId = modal.dataset.recordId;
        
        if (!recordId) return;
        
        const response = await fetch("http://localhost:5000/api/protected/deleteWeightR", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentToken}`
            },
            body: JSON.stringify({
                id: recordId
            })
        });
        
        if (!response.ok) {
            throw new Error("Error al eliminar el registro");
        }
        
        weightRecords = weightRecords.filter(record => record.id !== recordId);
        updateUI();
        
        modal.classList.remove('active');
        showToast("Registro eliminado correctamente");
        
    } catch (error) {
        console.error("Error en executeDelete:", error);
        showToast("Error al eliminar el registro", "error");
    }
}

// Función para actualizar toda la UI
function updateUI() {
    try {
        updateChart();
        updateRecordsList();
    } catch (error) {
        console.error("Error en updateUI:", error);
    }
}

// Función para actualizar la gráfica
function updateChart() {
    try {
        const chartCanvas = document.getElementById('weightChart');
        if (!chartCanvas) {
            console.error("Elemento canvas 'weightChart' no encontrado");
            return;
        }
        
        const ctx = chartCanvas.getContext('2d');
        
        // Ordenar registros por fecha
        const sortedRecords = [...weightRecords].sort((a, b) => new Date(a.date) - new Date(b.date));
        
        const labels = sortedRecords.map(record => formatDate(record.date));
        const weights = sortedRecords.map(record => record.weight);
        
        // Verificar si Chart está disponible
        if (typeof Chart === 'undefined') {
            console.error("Chart.js no está cargado. Asegúrate de incluir la biblioteca.");
            return;
        }
        
        // Destruir gráfica anterior si existe
        if (window.weightChart instanceof Chart) {
            window.weightChart.destroy();
        }
        
        // Crear la gráfica
        window.weightChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Tu peso',
                        data: weights,
                        borderColor: '#A0D94A',
                        backgroundColor: 'rgba(160, 217, 74, 0.2)',
                        borderWidth: 3,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y} kg`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return value + ' kg';
                            }
                        }
                    }
                }
            }
        });
        
        // Añadir línea de objetivo sólo si el objetivo existe
        if (weightGoal !== null) {
            window.weightChart.data.datasets.push({
                label: 'Objetivo',
                data: Array(labels.length).fill(weightGoal),
                borderColor: '#FF6B6B',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderWidth: 2,
                borderDash: [5, 5],
                tension: 0
            });
            window.weightChart.update();
        }
    } catch (error) {
        console.error("Error en updateChart:", error);
    }
}

// Función para actualizar la lista de registros
function updateRecordsList() {
    try {
        const registrosList = document.getElementById('registros-list');
        if (!registrosList) {
            console.error("Elemento 'registros-list' no encontrado");
            return;
        }
        
        registrosList.innerHTML = '';
        
        // Ordenar registros por fecha (más reciente primero)
        const sortedRecords = [...weightRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (sortedRecords.length === 0) {
            registrosList.innerHTML = '<p class="no-records">No hay registros de peso</p>';
            return;
        }
        
        sortedRecords.forEach(record => {
            const recordElement = document.createElement('div');
            recordElement.className = 'registro-item';
            
            recordElement.innerHTML = `
                <div class="registro-fecha">${formatDate(record.date)}</div>
                <div class="registro-peso">${record.weight} kg</div>
                <button class="eliminar-registro-btn">Eliminar</button>
            `;
            
            recordElement.querySelector('.eliminar-registro-btn').addEventListener('click', () => {
                deleteRecord(record.id);
            });
            
            registrosList.appendChild(recordElement);
        });
    } catch (error) {
        console.error("Error en updateRecordsList:", error);
    }
}

// Función para formatear fecha
function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    } catch (error) {
        console.error("Error en formatDate:", error);
        return dateString;
    }
}

// Función para mostrar notificaciones
function showToast(message, type = 'success') {
    try {
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
    } catch (error) {
        console.error("Error en showToast:", error);
    }
}