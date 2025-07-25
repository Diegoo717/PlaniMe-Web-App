const nameError = document.getElementById("username-error");
const surNamesError = document.getElementById("lastname-error");
const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

const inputName = document.getElementById("username");
const inputSurnames = document.getElementById("lastname");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

const button = document.getElementById("register-button");
const form = document.getElementById("register-form");

let flag = false;

button.addEventListener("click", function validate(event){
    event.preventDefault();

    flag = true;
    resetErrors();

    nameValidate();
    surNamesValidate();
    emailValidate();
    passwordValidate();
    
    if(flag === true){
        const data = {
            firstName: inputName.value.trim(),
            lastName: inputSurnames.value.trim(),
            email: inputEmail.value.trim(),
            password: inputPassword.value
        };
    
        fetch('https://planime-rest-api.diecode.lat/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || "Registration failed");
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Successful registration:", data);
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error("Registration error:", error.message);
            emailError.textContent = error.message;
            emailError.style.display = "inline-block";
        });
    }
    
});

function resetErrors() {
    nameError.style.display = "none";
    surNamesError.style.display = "none";
    emailError.style.display = "none";
    passwordError.style.display = "none";
}

function nameValidate(){
    const nameValue = inputName.value.trim();
    
    if(nameValue === ""){
        showError(nameError, "El nombre es obligatorio");
        flag = false;
    } else if(nameValue.length < 3){
        showError(nameError, "El nombre debe tener al menos 3 caracteres");
        flag = false;
    } else if(!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nameValue)){
        showError(nameError, "Solo se permiten letras y espacios");
        flag = false;
    }
}

function surNamesValidate(){
    const surnamesValue = inputSurnames.value.trim();
    
    if(surnamesValue === ""){
        showError(surNamesError, "Los apellidos son obligatorios");
        flag = false;
    } else if(surnamesValue.length < 3){
        showError(surNamesError, "Los apellidos deben tener al menos 3 caracteres");
        flag = false;
    } else if(!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(surnamesValue)){
        showError(surNamesError, "Solo se permiten letras y espacios");
        flag = false;
    }
}

function emailValidate(){
    const emailValue = inputEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if(emailValue === ""){
        showError(emailError, "El correo electrónico es obligatorio");
        flag = false;
    } else if(!emailRegex.test(emailValue)){
        showError(emailError, "Ingresa un correo electrónico válido");
        flag = false;
    }
}

function passwordValidate(){
    const passwordValue = inputPassword.value;
    
    if(passwordValue === ""){
        showError(passwordError, "La contraseña es obligatoria");
        flag = false;
    } else if(passwordValue.length < 8){
        showError(passwordError, "La contraseña debe tener al menos 8 caracteres");
        flag = false;
    } else if(!/[A-Z]/.test(passwordValue)){
        showError(passwordError, "La contraseña debe contener al menos una mayúscula");
        flag = false;
    } else if(!/[0-9]/.test(passwordValue)){
        showError(passwordError, "La contraseña debe contener al menos un número");
        flag = false;
    } else if(!/[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)){
        showError(passwordError, "La contraseña debe contener al menos un carácter especial");
        flag = false;
    }
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = "inline-block";
    element.style.marginTop = "0px";
    element.style.marginBottom = "10px";
}