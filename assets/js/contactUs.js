document.addEventListener('DOMContentLoaded', function() {
    document.body.style.visibility = 'visible';

    const sendBtn = document.querySelector('.send-btn');
    const modal = document.getElementById('successModal');
    const modalAcceptBtn = document.getElementById('modalAcceptBtn');

    sendBtn.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    modalAcceptBtn.addEventListener('click', function() {
        modal.style.display = 'none';
        window.location.href = "/index.html";
    });
});