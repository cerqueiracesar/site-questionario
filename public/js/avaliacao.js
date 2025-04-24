document.addEventListener("DOMContentLoaded", () => {
    // Referências aos elementos
    const formulario = document.getElementById("avaliacaoForm")
    const agradecimento = document.getElementById("agradecimento")
    const botaoVoltar = document.getElementById("voltarInicio")
    const submitButton = document.getElementById("submitButton")

    // Adicionar efeitos visuais às opções de avaliação
    const ratingOpcoes = document.querySelectorAll(".rating-opcao input")
    ratingOpcoes.forEach((opcao) => {
      opcao.addEventListener("change", function () {
        // Encontrar todos os inputs do mesmo grupo
        const name = this.getAttribute("name")
        const grupo = document.querySelectorAll(`input[name="${name}"]`)
  
        // Remover classes de todos os labels do grupo
        grupo.forEach((input) => {
          const label = input.nextElementSibling
          label.classList.remove("selecionado")
        })
  
        // Adicionar classe ao label selecionado
        const label = this.nextElementSibling
        label.classList.add("selecionado")
  
        // Efeito de brilho
        const container = this.closest(".rating-container")
        container.classList.add("brilho")
        setTimeout(() => {
          container.classList.remove("brilho")
        }, 500)
      })
    })
  
    // Adicionar efeito de foco às áreas de texto
    const textAreas = document.querySelectorAll(".texto-area")
    textAreas.forEach((area) => {
      area.addEventListener("focus", function () {
        this.classList.add("focado")
      })
  
      area.addEventListener("blur", function () {
        this.classList.remove("focado")
      })
    })
  
    // Lidar com o envio do formulário
    formulario.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Aqui você pode adicionar código para enviar os dados para um servidor
      // Por exemplo, usando fetch() ou XMLHttpRequest
  
      // Simulação de envio (remover em produção)
      const botaoEnviar = document.querySelector(".botao-enviar")
      botaoEnviar.disabled = true
      botaoEnviar.innerHTML = '<span class="botao-icone"><i class="fas fa-spinner fa-spin"></i></span> ENVIANDO...'
  
      setTimeout(() => {
        // Mostrar tela de agradecimento
        formulario.classList.add("hidden")
        agradecimento.classList.remove("hidden")
  
        // Coletar dados do formulário (para uso futuro)
        const formData = new FormData(formulario)
        const respostas = {}
  
        for (const [key, value] of formData.entries()) {
          respostas[key] = value
        }
  
        // Você pode salvar as respostas em localStorage para análise futura
        localStorage.setItem("avaliacaoRespostas", JSON.stringify(respostas))
  
        console.log("Respostas coletadas:", respostas)
      }, 1500)
    })
  
    // Botão para voltar à página inicial
    botaoVoltar.addEventListener("click", () => {
      window.location.href = "index.html"
    })
  
    // Animação de entrada para as seções
    const secoes = document.querySelectorAll(".secao-formulario")
    secoes.forEach((secao, index) => {
      secao.style.opacity = "0"
      secao.style.transform = "translateY(20px)"
  
      setTimeout(
        () => {
          secao.style.transition = "all 0.5s ease"
          secao.style.opacity = "1"
          secao.style.transform = "translateY(0)"
        },
        300 * (index + 1),
      )
    })
     // Lógica do feedback (semelhante ao feedback.js)
     const feedbackDisponivel = localStorage.getItem("feedbackDisponivel") === "true";

     // Impede que a avaliação seja acessada até que esteja disponível
     if (!feedbackDisponivel) {
       window.location.href = "index.html";  // Redireciona para a página inicial
     }
   })