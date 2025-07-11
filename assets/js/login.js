const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

const emailModalError = document.getElementById("emailModal-error");

const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

const button = document.getElementById("login-button");
const buttonGoogle = document.querySelector(".gsi-material-button")

const emailModal = document.getElementById("successModal")
const inputEmailModal = document.getElementById("inputEmailModal")
const passwordRecoberyButton = document.getElementById("passwordRecobery")
const modalAcceptBtn = document.getElementById("modalAcceptBtn")
const exitModalIcon = document.getElementById("exitModalIcon")

let flag = false;

exitModalIcon.addEventListener("click", (e)=>{
    emailModal.style.display = "none"
})

passwordRecoberyButton.addEventListener("click", (e)=>{
    openEmailModal()
})

modalAcceptBtn.addEventListener("click", async (e) =>{
    e.preventDefault()
    emailModalValidate()

    const data = {
        email: inputEmailModal.value.trim()
    }

    const response = await fetch('http://localhost:5000/api/emailForRecobery',{
        method: 'Post',
        headers:{
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || "Email not found");
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Response: ", data);
        })
        .catch(error => {
            console.error("login error:", error.message);
            emailError.textContent = error.message;
            emailError.style.display = "inline-block";
        });
})

buttonGoogle.addEventListener("click", async (e) =>{
    e.preventDefault()
    window.location.href = "http://localhost:5000/auth/google";
})

button.addEventListener("click", function validate(event) {  
    event.preventDefault();
    flag = true;
    resetErrors();

    emailValidate();
    passwordValidate();
    
    if (flag === true) {
        const data = {
            email: inputEmail.value.trim(),
            password: inputPassword.value
        };

        fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.error || "Login failed");
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Login succesful:", data);
            localStorage.setItem("token", data.token);
            window.location.href = '../../pages/home/dashboard.html';
        })
        .catch(error => {
            console.error("login error:", error.message);
            emailError.textContent = error.message;
            emailError.style.display = "inline-block";
        });
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

function emailModalValidate() {
    const emailValue = inputEmailModal.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if(emailValue === "") {
        showModalError(emailModalError, "El correo electrónico es obligatorio");
        flag = false;
    } else if(!emailRegex.test(emailValue)) {
        showModalError(emailModalError, "Ingresa un correo electrónico válido");
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
    element.style.marginBottom = "30px";
}

function showModalError(element, message) {
    element.textContent = message;
    element.style.display = "block";
    element.style.marginBottom = "0px";
}

function openEmailModal(){
    emailModal.style.display = "flex"
}