document.addEventListener("DOMContentLoaded", () => {
    // Configuração da data de liberação do feedback
    // Formato: ano, mês (0-11), dia, hora, minuto, segundo
    // IMPORTANTE: Altere esta data para quando o feedback deve ser liberado
    const dataLiberacao = new Date(2025, 3, 23, 19, 30, 0) // 23 de abril de 2025 às 19:30
  
    // Elementos do DOM
    const feedbackSection = document.getElementById("feedbackSection")
    const feedbackButton = document.getElementById("feedbackButton")
    const feedbackLink = document.getElementById("feedbackLink")
    const feedbackCountdown = document.getElementById("feedbackCountdown")
    const countdownTimer = document.getElementById("countdownTimer")
  
    // Verificar se o feedback já está disponível no localStorage
    const feedbackDisponivel = localStorage.getItem("feedbackDisponivel") === "true"
  
    // Variável para armazenar o ID do intervalo do contador
    let intervalId
  
    // Função para verificar se o feedback está disponível
    function verificarDisponibilidade() {
      const agora = new Date()
  
      // Se já passou da data de liberação ou se já foi marcado como disponível
      if (agora >= dataLiberacao || feedbackDisponivel) {
        // Marcar como disponível no localStorage
        localStorage.setItem("feedbackDisponivel", "true")
  
        // Atualizar a interface
        feedbackSection.classList.remove("locked")
        feedbackSection.classList.add("available")
        feedbackButton.disabled = false
        feedbackCountdown.innerHTML =
          '<i class="fas fa-unlock feedback-lock-icon"></i> <span class="feedback-countdown-text">Avaliação disponível!</span>'
  
        // Adicionar animação de desbloqueio
        feedbackSection.classList.add("unlocking")
        setTimeout(() => {
          feedbackSection.classList.remove("unlocking")
        }, 500)
  
        // Parar o contador
        clearInterval(intervalId)
  
        return true
      }
  
      return false
    }
  
    // Função para atualizar o contador regressivo
    function atualizarContador() {
      const agora = new Date()
      const diferenca = dataLiberacao - agora
  
      if (diferenca <= 0) {
        verificarDisponibilidade()
        return
      }
  
      // Calcular dias, horas, minutos e segundos
      const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24))
      const horas = Math.floor((diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60))
      const segundos = Math.floor((diferenca % (1000 * 60)) / 1000)
  
      // Formatar o contador
      if (dias > 0) {
        countdownTimer.textContent = `${dias}d ${horas}h ${minutos}m ${segundos}s`
      } else {
        countdownTimer.textContent = `${horas}h ${minutos}m ${segundos}s`
      }
    }
  
    // Inicialização
    if (!verificarDisponibilidade()) {
      // Se o feedback ainda não está disponível
      feedbackSection.classList.add("locked")
      atualizarContador()
  
      // Atualizar o contador a cada segundo
      intervalId = setInterval(atualizarContador, 1000)
    }
  
    // Adicionar evento de clique ao botão (para casos onde o JavaScript está habilitado mas o atributo disabled é ignorado)
    feedbackLink.addEventListener("click", (e) => {
      if (feedbackButton.disabled) {
        e.preventDefault()
        alert("A avaliação ainda não está disponível. Por favor, aguarde até o final da atividade.")
      }
    })
  
    // Verificar a disponibilidade a cada minuto (caso o usuário deixe a página aberta)
    setInterval(verificarDisponibilidade, 60000)
  })
  