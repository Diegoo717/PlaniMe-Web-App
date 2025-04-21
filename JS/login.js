const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

const button = document.getElementById("login-button");

let flag = false;

button.addEventListener("click", function validate(event) {  
    event.preventDefault();
    flag = true;
    resetErrors();

    emailValidate();
    passwordValidate();
    
    if(flag === true) {
        // First we'll make the server request
        
        // Then redirect
        window.location.href = 'dashboard.html';
    }
});

function resetErrors() {
    emailError.style.display = "none";
    passwordError.style.display = "none";
}

function emailValidate() {
    const emailValue = inputEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if(emailValue === "") {
        showError(emailError, "El correo electrónico es obligatorio");
        flag = false;
    } else if(!emailRegex.test(emailValue)) {
        showError(emailError, "Ingresa un correo electrónico válido");
        flag = false;
    }
}

function passwordValidate() {
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
    element.style.display = "block";
    element.style.marginBottom = "40px";
}