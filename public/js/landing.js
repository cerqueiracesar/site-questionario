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

    // O código relacionado à seção de feedback (avaliação) foi removido daqui.
});