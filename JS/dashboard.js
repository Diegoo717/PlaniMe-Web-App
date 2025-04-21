const createPlan = document.querySelector("#create-plan")
const yourPlans = document.querySelector("#your-plans")
const profile = document.querySelector("#profile")

createPlan.addEventListener("click", function(){
    window.location.href = 'createPlan.html';
})

yourPlans.addEventListener("click", function(){
    window.location.href = 'yourPlans.html';
})

profile.addEventListener("click", function(){
    window.location.href = 'profile.html';
})