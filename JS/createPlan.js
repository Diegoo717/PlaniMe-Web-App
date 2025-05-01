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

const ageError = document.getElementById("age-error");
const genderError = document.getElementById("gender-error");
const weightError = document.getElementById("weight-error");
const heightError = document.getElementById("height-error");
const activityError = document.getElementById("activity-error");
const goalError = document.getElementById("goal-error");

const inputAge = document.getElementById("age-input");
const inputGenderM = document.getElementById("hombre");
const inputGenderF = document.getElementById("mujer");
const inputWeight = document.getElementById("weight-input");
const inputHeight = document.getElementById("height-input");
const inputActivity = document.getElementById("activity-select");
const inputGoal = document.getElementById("goal-select");

const body = document.querySelector(".create-plan-body");

const button = document.querySelector(".calculate-btn");
let flag = false;

button.addEventListener("click", async function(event) {
    event.preventDefault();
    flag = true;
    resetErrors();

    ageValidate();
    genderValidate();
    weightValidate();
    heightValidate();
    activityValidate();
    goalValidate();
    
    if(flag === false) return;

    const token = localStorage.getItem("token");
    if(!token) {
        window.location.href = "login.html";
        return;
    }

    const formData = {
        age: inputAge.value.trim(),
        gender: inputGenderM.checked ? "m" : "f",
        weight: parseFloat(inputWeight.value.trim()),
        height: parseFloat(inputHeight.value.trim()),
        activityLevel: inputActivity.value,
        goal: convertGoalValue(inputGoal.value)
    };

    try {
        button.disabled = true;
        button.textContent = "Generando...";

        const response = await fetch("http://localhost:5000/api/protected/generatePlan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al generar el plan");
        }

        const data = await response.json();

        showSuccessModal();

    } catch (error) {
        console.error("Error:", error);
        showError(goalError, error.message || "Ocurrió un error al crear el plan");
    } finally {
        button.disabled = false;
        button.textContent = "Calcular";
    }
});

function convertGoalValue(goal) {
    const goalsMap = {
        "bajar": "perder",
        "mantener": "mantener",
        "subir": "aumentar"
    };
    return goalsMap[goal] || goal;
}

function showSuccessModal() {
    const modal = document.getElementById("successModal");
    const acceptBtn = document.getElementById("modalAcceptBtn");
    
    modal.style.display = "block";
    
    acceptBtn.addEventListener("click", function() {
        modal.style.display = "none";
        window.location.href = "dashboard.html";
    }, { once: true }); // 
}

function resetErrors() {
    const errors = [ageError, genderError, weightError, heightError, activityError, goalError];
    errors.forEach(error => {
        if(error) error.style.display = "none";
    });
}

function ageValidate() {
    const ageValue = inputAge.value.trim();
    
    if(ageValue === "") {
        showError(ageError, "La edad es obligatoria");
        flag = false;
    } else if(ageValue < 12 || ageValue > 99) {
        showError(ageError, "La edad debe estar entre 12 y 99 años");
        flag = false;
    }
}

function genderValidate() {
    if(!inputGenderM.checked && !inputGenderF.checked) {
        showError(genderError, "Debes seleccionar tu sexo");
        flag = false;
    }
}

function weightValidate() {
    const weightValue = inputWeight.value.trim();
    
    if(weightValue === "") {
        showError(weightError, "El peso es obligatorio");
        flag = false;
    } else if(weightValue < 30 || weightValue > 200) {
        showError(weightError, "El peso debe estar entre 30 y 200 kg");
        flag = false;
    }
}

function heightValidate() {
    const heightValue = inputHeight.value.trim();
    
    if(heightValue === "") {
        showError(heightError, "La altura es obligatoria");
        flag = false;
    } else if(heightValue < 120 || heightValue > 250) {
        showError(heightError, "La altura debe estar entre 120 y 250 cm");
        flag = false;
    }
}

function activityValidate() {
    if(!inputActivity.value) {
        showError(activityError, "Debes seleccionar tu nivel de actividad");
        flag = false;
    }
}

function goalValidate() {
    if(!inputGoal.value) {
        showError(goalError, "Debes seleccionar tu objetivo físico");
        flag = false;
    }
}

function showError(element, message) {
    body.style.overflow = "auto";
    if(element) {
        element.textContent = message;
        element.style.display = "block";
        element.style.marginTop = "0";
        element.style.marginBottom = "10px";
        element.style.color = "red";
        element.style.textAlign = "center";
    }
}

const styleElement = document.createElement('style');
styleElement.textContent = `
  .falling-phrase {
    position: fixed;
    color: black;
    font-family: "Bubblegum Sans", sans-serif;
    font-weight: bold;
    z-index: 1000;
    white-space: nowrap;
    animation: fallDown linear forwards;
    opacity: 0.9;
    text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.7);
    top: -50px; /* Start above the viewport */
  }

  @keyframes fallDown {
    0% {
      transform: translateY(0) rotate(var(--rotation));
      opacity: 0;
    }
    10% {
      opacity: 0.9;
    }
    90% {
      opacity: 0.9;
    }
    100% {
      transform: translateY(calc(100vh + 100px)) rotate(var(--rotation));
      opacity: 0;
    }
  }
`;
document.head.appendChild(styleElement);

const motivationalPhrases = [
    "¡Tú puedes!",
    "El cambio comienza hoy",
    "Alimenta tu cuerpo, nutre tu alma",
    "Pequeños cambios, grandes resultados",
    "Cada comida es una oportunidad",
    "Un día a la vez",
    "Eres más fuerte de lo que crees",
    "Tu salud es tu riqueza",
    "Buena nutrición = Buena vida",
    "Hoy es tu día",
    "Persistencia sobre perfección",
    "Prioriza tu bienestar",
    "La constancia da resultados",
    "El éxito es la suma de pequeños esfuerzos",
    "Alimenta tu determinación",
    "Respeta tu cuerpo",
    "Cada bocado cuenta",
    "Mejora tu vida, un plato a la vez",
    "Tu mejor versión te espera",
    "El hábito crea el cambio",
    "La disciplina es libertad",
    "Celebra cada progreso",
    "Tu cuerpo es tu hogar",
    "El autocuidado no es egoísmo",
    "Progreso, no perfección",
    "Escucha a tu cuerpo",
    "Hoy elijo salud",
    "La paciencia es clave",
    "Confía en el proceso",
    "Mente sana en cuerpo sano",
    "El respeto propio comienza aquí",
    "Toma decisiones que te enorgullezcan",
    "El amor propio se demuestra con acciones",
    "Tú eres tu mejor inversión",
    "La energía sigue al enfoque",
    "Hoy es un nuevo comienzo",
    "La consistencia transforma",
    "Eres capaz de más de lo que imaginas",
    "La salud es el mejor regalo",
    "Cada elección construye tu futuro"
  ];

function createFallingPhrase() {
  const phrase = document.createElement('div');
  phrase.className = 'falling-phrase';

  const randomPhrase = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
  phrase.textContent = randomPhrase;

  const fontSize = (Math.random() * 1.5 + 1).toFixed(1);
  phrase.style.fontSize = `${fontSize}rem`;

  const horizontalPosition = Math.random() * 85; 
  phrase.style.left = `${horizontalPosition}%`;

  const rotation = Math.random() * 30 - 15;
  phrase.style.setProperty('--rotation', `${rotation}deg`);

  const duration = Math.random() * 4 + 8;
  phrase.style.animationDuration = `${duration}s`;

  document.body.appendChild(phrase);

  setTimeout(() => {
    phrase.remove();
  }, duration * 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    createFallingPhrase();

    setInterval(createFallingPhrase, 12000);
  }, 6000);
});