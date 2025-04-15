document.addEventListener("DOMContentLoaded", () => {
    // Elementos do DOM
    const btnInscrever = document.getElementById("btnInscrever");
    const btnMostrarRecursos = document.getElementById("btnMostrarRecursos");
    const recursosConteudo = document.getElementById("recursosConteudo");
    const iniciarQuiz = document.getElementById("iniciarQuiz");

    // Configuração da data de liberação do feedback
    const dataLiberacao = new Date(2025, 3, 25, 19, 30, 0); // 25 de abril de 2025 às 19:30
    const feedbackSection = document.getElementById("feedbackSection");
    const feedbackButton = document.getElementById("feedbackButton");
    const feedbackLink = document.getElementById("feedbackLink");
    const feedbackCountdown = document.getElementById("feedbackCountdown");
    const countdownTimer = document.getElementById("countdownTimer");

    // Variável para armazenar o ID do intervalo do contador
    let intervalId;

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

    // Função para verificar se o feedback está disponível e atualizar a interface
    function atualizarFeedbackUI() {
        const agora = new Date();

        if (agora >= dataLiberacao) {
            feedbackSection.classList.remove("locked");
            feedbackSection.classList.add("available");
            feedbackButton.disabled = false;
            feedbackCountdown.innerHTML =
                '<i class="fas fa-unlock feedback-lock-icon"></i> <span class="feedback-countdown-text">Avaliação disponível!</span>';
            clearInterval(intervalId); // Parar o contador quando disponível
        } else {
            feedbackSection.classList.add("locked");
            feedbackSection.classList.remove("available");
            feedbackButton.disabled = true;
            feedbackCountdown.innerHTML =
                '<i class="fas fa-lock feedback-lock-icon"></i> <span class="feedback-countdown-text">Disponível em: <span id="countdownTimer"></span></span>';
            atualizarContador(); // Garante que o contador seja chamado imediatamente
            if (!intervalId) { // Inicia o intervalo se ainda não estiver ativo
                intervalId = setInterval(atualizarContador, 1000);
            }
        }
    }

    // Função para atualizar o contador regressivo
    function atualizarContador() {
        const agora = new Date();
        const diferenca = dataLiberacao - agora;

        if (diferenca <= 0) {
            atualizarFeedbackUI(); // Verificar novamente se já liberou
            return;
        }

        // Calcular dias, horas, minutos e segundos
        const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

        // Formatar o contador
        if (dias > 0) {
            countdownTimer.textContent = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
        } else {
            countdownTimer.textContent = `${horas}h ${minutos}m ${segundos}s`;
        }
    }

    // Inicializar a interface e o contador
    atualizarFeedbackUI();

    // Adicionar evento de clique ao botão de feedback
    feedbackLink.addEventListener("click", (e) => {
        if (feedbackButton.disabled || !localStorage.getItem("dadosInscricao")) {
            e.preventDefault();
            alert("A avaliação ainda não está disponível ou você não está inscrito.");
            window.location.href = "formulario.html";
        }
    });
});