document.addEventListener("DOMContentLoaded", () => {
    // Elementos do DOM (mantendo apenas os relacionados a outras funcionalidades)
    const btnInscrever = document.getElementById("btnInscrever");
    const btnMostrarRecursos = document.getElementById("btnMostrarRecursos");
    const recursosConteudo = document.getElementById("recursosConteudo");
    const iniciarQuiz = document.getElementById("iniciarQuiz");

    // Redirecionar para o formulário de inscrição
    if (btnInscrever) {
        btnInscrever.addEventListener("click", () => {
            window.location.href = "formulario.html";
        });
    }

    // Mostrar/esconder recursos adicionais
    btnMostrarRecursos.addEventListener("click", () => {
        recursosConteudo.classList.toggle("visible");

        const icon = btnMostrarRecursos.querySelector("i");
        if (recursosConteudo.classList.contains("visible")) {
            icon.className = "fas fa-chevron-up";
        } else {
            icon.className = "fas fa-chevron-down";
        }
    });

    // Iniciar quiz
    iniciarQuiz.addEventListener("click", () => {
        // Verificar se o usuário já se inscreveu
        const dadosInscricao = localStorage.getItem("dadosInscricao");

        if (!dadosInscricao) {
            alert("Por favor, inscreva-se primeiro para acessar o quiz.");
            window.location.href = "formulario.html";
            return;
        }

        // Redirecionar para o quiz ou iniciar o quiz na mesma página
        window.location.href = "quiz.html";
    });

        // Controle da liberação da avaliação
        const feedbackSection = document.getElementById("feedbackSection");
        const feedbackButton = document.getElementById("feedbackButton");
        const feedbackCountdown = document.getElementById("feedbackCountdown");
        const countdownTimer = document.getElementById("countdownTimer");
        const feedbackLink = document.getElementById("feedbackLink");
    
        if (feedbackSection && feedbackButton && countdownTimer && feedbackLink) {
            const dataLiberacao = new Date();
            dataLiberacao.setDate(25); // Libera no dia 25
            dataLiberacao.setHours(0, 0, 0, 0); // À meia-noite
    
            const agora = new Date();
    
            if (agora >= dataLiberacao) {
                feedbackSection.classList.remove("locked");
                feedbackButton.disabled = false;
                feedbackCountdown.style.display = "none";
                feedbackLink.setAttribute("href", "avaliacao.html");
            } else {
                feedbackSection.classList.add("locked");
                feedbackButton.disabled = true;
                feedbackLink.removeAttribute("href");
    
                const intervalo = setInterval(() => {
                    const agora = new Date();
                    const tempoRestante = dataLiberacao - agora;
    
                    if (tempoRestante <= 0) {
                        clearInterval(intervalo);
                        feedbackSection.classList.remove("locked");
                        feedbackButton.disabled = false;
                        feedbackCountdown.style.display = "none";
                        feedbackLink.setAttribute("href", "avaliacao.html");
                    } else {
                        const horas = Math.floor((tempoRestante / (1000 * 60 * 60)) % 24);
                        const minutos = Math.floor((tempoRestante / (1000 * 60)) % 60);
                        const segundos = Math.floor((tempoRestante / 1000) % 60);
    
                        countdownTimer.textContent = `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
                    }
                }, 1000);
            }
        }
    
});