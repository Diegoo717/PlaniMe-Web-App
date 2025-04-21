    const ageError = document.getElementById("msjError-edad");
    const genderError = document.getElementById("msjError-sexo");
    const weightError = document.getElementById("msjError-peso");
    const heightError = document.getElementById("msjError-altura");
    const activityError = document.getElementById("msjError-actividad");
    const goalError = document.getElementById("msjError-objetivo");

    const inputAge = document.getElementById("input-edad");
    const inputGenderM = document.getElementById("hombre");
    const inputGenderF = document.getElementById("mujer");
    const inputWeight = document.getElementById("input-peso");
    const inputHeight = document.getElementById("input-altura");
    const inputActivity = document.getElementById("select-actividad");
    const inputGoal = document.getElementById("select-objetivo");

    const body = document.querySelector(".body-crearPlan")

    const button = document.querySelector(".btnCalcular");
    let flag = false;

    button.addEventListener("click", function validate(event) {
        event.preventDefault();
        flag = true;
        resetErrors();

        ageValidate();
        genderValidate();
        weightValidate();
        heightValidate();
        activityValidate();
        goalValidate();
        
        if(flag === true) {
            // Petición al servidor tipo POST

            //Redireccionamos
            window.location.href = 'dashboard.html';
        }
    });

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
