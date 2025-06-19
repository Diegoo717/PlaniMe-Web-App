let weightRecords = [];
        let weightGoal = null;
        let currentToken = null;

        document.addEventListener("DOMContentLoaded", () => {
            currentToken = localStorage.getItem("token");

            if (!currentToken) {
                window.location.href = "login.html";
                return;
            }

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

            setupModals();
            setupEventListeners();
        });

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

        async function loadInitialData(token) {
            try {
                const records = await getAllWeightRecords(token);
                weightRecords = records;

                try {
                    const goal = await getWeightGoal(token);
                    weightGoal = goal;
                    document.getElementById('peso-objetivo').textContent = `${weightGoal} kg`;
                } catch (error) {
                    console.warn("No se pudo cargar el objetivo de peso:", error);
                    weightGoal = null;
                }
                
                updateUI();
            } catch (error) {
                console.error("Error cargando datos iniciales:", error);
                showToast("Error al cargar datos", "error");
            }
        }

        async function getAllWeightRecords(token) {
            try {
                const response = await fetch("http://localhost:5000/api/protected/getAllWeightR", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
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
                return data.data;
            } catch (error) {
                console.error("Error en getWeightGoal:", error);
                throw error;
            }
        }

        function setupModals() {
            try {
                const registroModal = document.getElementById('registro-modal');
                const objetivoModal = document.getElementById('objetivo-modal');
                const confirmModal = document.getElementById('confirmModal');

                [registroModal, objetivoModal, confirmModal].forEach(modal => {
                    modal.addEventListener('click', function(e) {
                        if (e.target === this) {
                            this.classList.remove('active');
                        }
                    });
                });
            } catch (error) {
                console.error("Error en setupModals:", error);
            }
        }

        function setupEventListeners() {
            try {
                document.getElementById('agregar-registro-btn').addEventListener('click', () => {
                    const modal = document.getElementById('registro-modal');
                    modal.classList.add('active');
                    document.getElementById('fecha-input').value = new Date().toISOString().split('T')[0];
                });

                document.getElementById('guardar-registro-btn').addEventListener('click', saveWeightRecord);

                document.getElementById('cancelar-registro-btn').addEventListener('click', () => {
                    document.getElementById('registro-modal').classList.remove('active');
                });

                document.getElementById('editar-objetivo').addEventListener('click', () => {
                    const goalInput = document.getElementById('objetivo-input');
                    const goalModal = document.getElementById('objetivo-modal');
                    goalInput.value = weightGoal || '';
                    goalModal.classList.add('active');
                });

                document.getElementById('guardar-objetivo-btn').addEventListener('click', saveWeightGoal);

                document.getElementById('cancelar-objetivo-btn').addEventListener('click', () => {
                    document.getElementById('objetivo-modal').classList.remove('active');
                });

                document.getElementById('confirm-delete-btn').addEventListener('click', executeDelete);

                document.getElementById('cancel-delete-btn').addEventListener('click', () => {
                    document.getElementById('confirmModal').classList.remove('active');
                });
            } catch (error) {
                console.error("Error en setupEventListeners:", error);
            }
        }

        async function saveWeightRecord() {
            try {
                const pesoInput = document.getElementById('peso-input');
                const fechaInput = document.getElementById('fecha-input');
                const pesoError = document.getElementById('peso-error');
                const fechaError = document.getElementById('fecha-error');
        
                let isValid = true;
                
                if (!pesoInput.value || isNaN(pesoInput.value)) {
                    pesoError.textContent = 'Ingresa un peso válido';
                    isValid = false;
                } else {
                    pesoError.textContent = '';
                }
                
                if (!fechaInput.value) {
                    fechaError.textContent = 'Selecciona una fecha';
                    isValid = false;
                } else {
                    fechaError.textContent = '';
                }
                
                if (!isValid) return;

                const fecha = new Date(fechaInput.value);
                const fechaCorregida = new Date(fecha.getTime() + Math.abs(fecha.getTimezoneOffset() * 60000));
                
                const response = await fetch("http://localhost:5000/api/protected/setWeightRecord", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${currentToken}`
                    },
                    body: JSON.stringify({
                        weight: parseFloat(pesoInput.value),
                        date: fechaCorregida.toISOString().split('T')[0] 
                    })
                });
                
                if (!response.ok) {
                    throw new Error("Error al guardar el registro");
                }
                
                const newRecord = await response.json();
                weightRecords.push(newRecord.data);

                weightRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                updateUI();
                
                document.getElementById('registro-modal').classList.remove('active');
                pesoInput.value = '';
                
            } catch (error) {
                console.error("Error en saveWeightRecord:", error);
                showToast("Error al guardar el registro", "error");
            }
        }

        async function saveWeightGoal() {
            try {
                const objetivoInput = document.getElementById('objetivo-input');
                const objetivoError = document.getElementById('objetivo-error');
                
                if (!objetivoInput.value || isNaN(objetivoInput.value)) {
                    objetivoError.textContent = 'Ingresa un peso válido';
                    return;
                }
                
                objetivoError.textContent = '';
                
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
                weightGoal = goal.data.weightGoal;
                document.getElementById('peso-objetivo').textContent = `${weightGoal} kg`;
                
                document.getElementById('objetivo-modal').classList.remove('active');
                updateChart();
                
            } catch (error) {
                console.error("Error en saveWeightGoal:", error);
                showToast("Error al guardar el objetivo", "error");
            }
        }

        function deleteRecord(recordId) {
            try {
                const modal = document.getElementById('confirmModal');
                modal.dataset.recordId = recordId;
                modal.classList.add('active');
            } catch (error) {
                console.error("Error en deleteRecord:", error);
            }
        }

async function executeDelete() {
    try {
        const modal = document.getElementById('confirmModal');
        const recordId = modal.dataset.recordId;
        
        if (!recordId) return;
        
        const response = await fetch(`http://localhost:5000/api/protected/deleteWeightR/${recordId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${currentToken}`
            },
        });
        
        if (!response.ok) {
            throw new Error("Error al eliminar el registro");
        }

        weightRecords = weightRecords.filter(record => record.id.toString() !== recordId.toString());

        updateUI();
        
        modal.classList.remove('active');
        
    } catch (error) {
        console.error("Error en executeDelete:", error);
        showToast("Error al eliminar el registro", "error");
    }
}

        function updateUI() {
            try {
                updateChart();
                updateRecordsList();
            } catch (error) {
                console.error("Error en updateUI:", error);
            }
        }

        function updateChart() {
            try {
                const chartCanvas = document.getElementById('weightChart');
                if (!chartCanvas) return;
                
                const ctx = chartCanvas.getContext('2d');
                const sortedRecords = [...weightRecords].sort((a, b) => new Date(a.date) - new Date(b.date));
                const labels = sortedRecords.map(record => formatDate(record.date));
                const weights = sortedRecords.map(record => record.weight);

                const baseDataset = {
                    label: 'Tu peso',
                    data: weights,
                    borderColor: '#A0D94A',
                    backgroundColor: 'rgba(160, 217, 74, 0.2)',
                    borderWidth: 3,
                    tension: 0.3
                };

                if (window.weightChart instanceof Chart) {
                    window.weightChart.data.labels = labels;
                    window.weightChart.data.datasets[0] = baseDataset;

                    if (weightGoal !== null) {
                        const goalDataset = {
                            label: 'Objetivo',
                            data: Array(labels.length).fill(weightGoal),
                            borderColor: '#FF6B6B',
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            tension: 0
                        };
                        
                        if (window.weightChart.data.datasets.length > 1) {
                            window.weightChart.data.datasets[1] = goalDataset;
                        } else {
                            window.weightChart.data.datasets.push(goalDataset);
                        }
                    } else if (window.weightChart.data.datasets.length > 1) {
                        window.weightChart.data.datasets.pop(); 
                    }
                    
                    
                    window.weightChart.update({
                        duration: 300,
                        easing: 'easeOutQuad',
                        lazy: true
                    });
                } 
                
                else {
                    const datasets = [baseDataset];
                    
                    if (weightGoal !== null) {
                        datasets.push({
                            label: 'Objetivo',
                            data: Array(labels.length).fill(weightGoal),
                            borderColor: '#FF6B6B',
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            tension: 0
                        });
                    }
        
                    window.weightChart = new Chart(ctx, {
                        type: 'line',
                        data: { labels, datasets },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false, 
                            animation: {
                                duration: 400,
                                easing: 'easeOutQuad'
                            },
                            plugins: {
                                legend: { position: 'top' },
                                tooltip: {
                                    callbacks: {
                                        label: (context) => 
                                            `${context.dataset.label}: ${context.parsed.y} kg`
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: false,
                                    ticks: { 
                                        callback: (value) => value + ' kg',
                                        stepSize: 5 
                                    }
                                }
                            }
                        }
                    });
                }
            } catch (error) {
                console.error("Error en updateChart:", error);
            }
        }

        function updateRecordsList() {
            try {
                const registrosList = document.getElementById('registros-list');
                if (!registrosList) return;
                
                registrosList.innerHTML = '';

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
                        <button class="delete-btn">Eliminar</button>
                    `;
                    
                    recordElement.querySelector('.delete-btn').addEventListener('click', (e) => {
                        e.stopPropagation();
                        deleteRecord(record.id);
                    });
                    
                    registrosList.appendChild(recordElement);
                });
            } catch (error) {
                console.error("Error en updateRecordsList:", error);
            }
        }

        function formatDate(dateString) {
            try {
                const date = new Date(dateString);
                const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
                
                return adjustedDate.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
            } catch (error) {
                console.error("Error en formatDate:", error);
                return dateString;
            }
        }

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