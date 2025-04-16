const nameError = document.getElementById("msjError-nombre");
const surNamesError = document.getElementById("msjError-apellidos");
const emailError = document.getElementById("msjError-correo");
const passwordError = document.getElementById("msjError-contraseña");

const inputName = document.getElementById("username");
const inputSurnames = document.getElementById("lastname");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

const button = document.getElementById("buttonRegister");
const form = document.getElementById("formRegister");

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
        // Primero ejecutaremos la peticion al servidor
        
        // Despues redireccionaremos
        window.location.href = 'login.html';
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
    element.style.marginTop = "0";
    element.style.marginBottom = "10px";
}