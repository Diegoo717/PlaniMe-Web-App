    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");

    const emailModalError = document.getElementById("emailModal-error");

    const inputEmail = document.getElementById("email");
    const inputPassword = document.getElementById("password");

    const button = document.getElementById("login-button");
    const buttonGoogle = document.querySelector(".gsi-material-button")

    const passwordRecoberyButton = document.getElementById("passwordRecobery")

    const emailModal = document.getElementById("emailModal")
    const inputEmailModal = document.getElementById("inputEmailModal")
    const emailModalAcceptBtn = document.getElementById("emailModalAcceptBtn")
    const exitEmailModalIcon = document.getElementById("exitEmailModalIcon")


    const codeModal = document.getElementById("codeModal")
    const inputCodeModal = document.getElementById("inputCodeModal")
    const codeModalAcceptBtn = document.getElementById("codeModalAcceptBtn")
    const exitCodeModalIcon = document.getElementById("exitCodeModalIcon")
    const codeModalError = document.getElementById("codeModal-error");

    const passwordModal = document.getElementById("passwordModal")
    const inputOnePasswordModal = document.getElementById("inputOnePasswordModal")
    const inputTwoPasswordModal = document.getElementById("inputTwoPasswordModal")
    const passwordModalAcceptBtn = document.getElementById("passwordModalAcceptBtn")
    const exitPasswordModalIcon = document.getElementById("exitPasswordModalIcon")
    const passwordModalError = document.getElementById("passwordModal-error");

    const confirmationModal = document.getElementById("confirmationModal")
    const confirmPasswordChangeBtn = document.getElementById("confirmPasswordChangeBtn")

    let flag = false;

    passwordRecoberyButton.addEventListener("click", (e)=>{
        emailModal.style.display = "Flex"
    })

    exitEmailModalIcon.addEventListener("click", (e)=>{
        emailModal.style.display = "none"
    })

    emailModalAcceptBtn.addEventListener("click", async (e) =>{
        e.preventDefault()
        flag = true;
        emailModalValidate()

        if(flag === false) return;

        const data = {
            email: inputEmailModal.value.trim()
        }

        const response = await fetch('https://planime-rest-api.diecode.lat/api/emailForRecobery',{
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
                localStorage.setItem("emailSaved", data.email);
                emailModal.style.display = "none"
                codeModal.style.display = "flex"
                return response.json();
            })
            .then(data => {
                console.log("Response: ", data);
            })
            .catch(error => {
                console.error("login error:", emailError.message);
                emailError.textContent = emailError.message;
                emailError.style.display = "inline-block";
            });
    })

    exitCodeModalIcon.addEventListener("click", (e)=>{
        codeModal.style.display = "none"
    })

    codeModalAcceptBtn.addEventListener("click", async (e) =>{
        e.preventDefault()
        flag = true;
        codeModalValidate()

        if(flag === false) return;

        const data = {
            email: localStorage.getItem("emailSaved"),
            code: inputCodeModal.value.trim()
        }

        const response = await fetch('https://planime-rest-api.diecode.lat/api/codeVerification',{
            method: 'Post',
            headers:{
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.error || "Invalid code");
                    });
                }
                codeModal.style.display = "none"
                passwordModal.style.display = "Flex"
                return response.json();
            })
            .then(data => {
                localStorage.setItem("token", data.token)
                console.log("Response: ", data);
            })
            .catch(error => {
                console.error("login error:", codeModalError.message);
                showModalError(codeModalError, error.message);
                emailError.style.display = "inline-block";
            });
    })

    exitPasswordModalIcon.addEventListener("click", (e)=>{
        passwordModal.style.display = "none"
    })

    passwordModalAcceptBtn.addEventListener("click", async (e) =>{
        e.preventDefault()
        flag = true;
        passwordModalValidate()
        samePasswordModal()

        if(flag === false) return;

        const data = {
            email: localStorage.getItem("emailSaved"),
            password: inputOnePasswordModal.value.trim()
        }

        token = localStorage.getItem("token")
        if(!token) {
            window.location.href = "login.html";
            return;
        }

        const response = await fetch('https://planime-rest-api.diecode.lat/api/protected/changePassword',{
            method: 'Put',
            headers:{
                'Content-type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
        .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.error || "Invalid passsword");
                    });
                }
                passwordModal.style.display = "none"
                confirmationModal.style.display = "Flex"
                return response.json();
            })
            .then(data => {
                console.log("Response: ", data);
            })
            .catch(error => {
                console.error("login error:", passwordError.message);
                emailError.textContent = passwordError.message;
                emailError.style.display = "inline-block";
            });
    })

    confirmPasswordChangeBtn.addEventListener("click", (e) =>{
        confirmationModal.style.display = "none"
    })

    buttonGoogle.addEventListener("click", async (e) =>{
        e.preventDefault()
        window.location.href = "https://planime-rest-api.diecode.lat/auth/google";
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

            fetch('https://planime-rest-api.diecode.lat/api/login', {
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

    function passwordModalValidate() {
    const passwordValue = inputOnePasswordModal.value;
    
    if(passwordValue === ""){
        showModalError(passwordModalError, "La contraseña es obligatoria"); 
        flag = false;
    } else if(passwordValue.length < 8){
        showModalError(passwordModalError, "La contraseña debe tener al menos 8 caracteres"); 
        flag = false;
    } else if(!/[A-Z]/.test(passwordValue)){
        showModalError(passwordModalError, "La contraseña debe contener al menos una mayúscula"); 
        flag = false;
    } else if(!/[0-9]/.test(passwordValue)){
        showModalError(passwordModalError, "La contraseña debe contener al menos un número"); 
        flag = false;
    } else if(!/[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)){
        showModalError(passwordModalError, "La contraseña debe contener al menos un carácter especial"); 
        flag = false;
    }
}

    function samePasswordModal(){
        if(inputOnePasswordModal.value.trim() == inputTwoPasswordModal.value.trim()){
            return true
        }else{
            showModalError(passwordModalError, "Las contraseñas no coinciden"); 
            flag = false;
            return false
        }
    }

    function codeModalValidate() {
        const codeValue = inputCodeModal.value.trim(); 
        const codeRegex = /^[a-zA-Z0-9]+$/; 
        
        if(codeValue === "") {
            showModalError(codeModalError, "El código es obligatorio");
            flag = false;
        } else if(codeValue.length > 9) {
            showModalError(codeModalError, "El código no puede tener más de 9 caracteres");
            flag = false;
        } else if(codeValue !== inputCodeModal.value) { 
            showModalError(codeModalError, "El código no debe tener espacios al principio ni al final");
            flag = false;
        } else if(!codeRegex.test(codeValue)) {
            showModalError(codeModalError, "Solo se permiten letras y números en el código");
            flag = false;
        } else if(codeValue.length < 9) {
            showModalError(codeModalError, "El código debe tener 9 caracteres");
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