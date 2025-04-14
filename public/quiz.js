// Variáveis globais
let todasPerguntas = []
let perguntasSelecionadas = []
let currentQuestion = 0
let pontuacao = 0
const TOTAL_PERGUNTAS_QUIZ = 11 // Número de perguntas que serão selecionadas para o quiz

// Quando o documento estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  // Seleciona o botão de iniciar quiz
  const botaoIniciarQuiz = document.getElementById("iniciarQuiz")

  // Adiciona um evento de clique ao botão
  botaoIniciarQuiz.addEventListener("click", () => {
    iniciarQuiz()
  })
})

// Função para iniciar o quiz
function iniciarQuiz() {
  console.log("Quiz iniciado!")

  // Salvar o conteúdo original para poder voltar depois
  const container = document.querySelector(".container")
  const conteudoOriginal = container.innerHTML
  sessionStorage.setItem("conteudoOriginal", conteudoOriginal)

  // Criar o container do quiz
  const quizContainer = document.createElement("div")
  quizContainer.className = "quiz-container"
  quizContainer.innerHTML = `
    <h2 class="quiz-container-titulo">Quiz sobre Inclusão Digital</h2>
    <div id="quiz-content" class="quiz-content">
      <div class="loading">Carregando perguntas...</div>
    </div>
    <button class="botao-voltar">Voltar para a página inicial</button>
  `

  // Substituir o conteúdo pelo quiz
  container.innerHTML = ""
  container.appendChild(quizContainer)

  // Adicionar evento ao botão voltar
  document.querySelector(".botao-voltar").addEventListener("click", () => {
    container.innerHTML = sessionStorage.getItem("conteudoOriginal")
    // Recarregar os event listeners após restaurar o conteúdo
    const botaoIniciarQuizRestaurado = document.getElementById("iniciarQuiz")
    if (botaoIniciarQuizRestaurado) {
      botaoIniciarQuizRestaurado.addEventListener("click", iniciarQuiz)
    }
  })

  // Carregar as perguntas do JSON
  carregarPerguntas()
}

// Função para embaralhar um array (algoritmo Fisher-Yates)
function embaralharArray(array) {
  const novoArray = [...array]
  for (let i = novoArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[novoArray[i], novoArray[j]] = [novoArray[j], novoArray[i]]
  }
  return novoArray
}

// Função para carregar perguntas do arquivo JSON
function carregarPerguntas() {
  fetch("perguntas.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Não foi possível carregar as perguntas")
      }
      return response.json()
    })
    .then((data) => {
      todasPerguntas = data
      console.log(`Total de perguntas carregadas: ${todasPerguntas.length}`)

      // Embaralhar e selecionar apenas 11 perguntas aleatórias
      perguntasSelecionadas = embaralharArray(todasPerguntas).slice(0, TOTAL_PERGUNTAS_QUIZ)
      console.log(`Perguntas selecionadas para o quiz: ${perguntasSelecionadas.length}`)

      currentQuestion = 0
      pontuacao = 0
      mostrarPergunta(currentQuestion)
    })
    .catch((error) => {
      document.getElementById("quiz-content").innerHTML = `
        <div class="error">
          <p>Erro ao carregar as perguntas: ${error.message}</p>
          <p>Verifique se o arquivo perguntas.json existe e está no formato correto.</p>
        </div>
      `
      console.error("Erro:", error)
    })
}

// Função para mostrar uma pergunta específica
function mostrarPergunta(index) {
  const quizContent = document.getElementById("quiz-content")

  // Verificar se ainda há perguntas
  if (index >= perguntasSelecionadas.length) {
    mostrarResultadoFinal()
    return
  }

  const pergunta = perguntasSelecionadas[index]

  // Criar HTML da pergunta
  quizContent.innerHTML = `
    <div class="pergunta">
      <div class="pergunta-numero">Pergunta ${index + 1} de ${perguntasSelecionadas.length}</div>
      <h3>${pergunta.question}</h3>
      ${pergunta.imageUrl ? `<img src="${pergunta.imageUrl}" class="pergunta-imagem" alt="Ilustração da pergunta" />` : ""}
      <div class="opcoes">
        ${pergunta.options
          .map(
            (opt, i) => `
          <div class="opcao">
            <input type="radio" id="opcao${i}" name="resposta" value="${i}">
            <label for="opcao${i}">${opt}</label>
          </div>
        `,
          )
          .join("")}
      </div>
      <div class="feedback" id="feedback"></div>
      <button class="botao-responder" onclick="verificarResposta()">Responder</button>
    </div>
  `
}

// Função para verificar a resposta selecionada
function verificarResposta() {
  const radios = document.getElementsByName("resposta")
  let respostaSelecionada = null

  // Encontrar qual opção foi selecionada
  for (const radio of radios) {
    if (radio.checked) {
      respostaSelecionada = Number.parseInt(radio.value)
      break
    }
  }

  // Se nenhuma opção foi selecionada
  if (respostaSelecionada === null) {
    const feedback = document.getElementById("feedback")
    feedback.textContent = "Por favor, selecione uma resposta."
    feedback.className = "feedback erro"
    return
  }

  const pergunta = perguntasSelecionadas[currentQuestion]
  // Ajuste importante: o JSON usa índice base 1, então precisamos subtrair 1
  const correta = pergunta.correctAnswer

  const feedback = document.getElementById("feedback")
  const opcoes = document.querySelectorAll(".opcao")

  // Desabilitar todas as opções após responder
  opcoes.forEach((opcao) => {
    const input = opcao.querySelector("input")
    input.disabled = true
  })

  // Destacar a opção correta e a selecionada
  opcoes[correta].classList.add("correta")
  if (respostaSelecionada !== correta) {
    opcoes[respostaSelecionada].classList.add("incorreta")
  }

  // Verificar se a resposta está correta
  if (respostaSelecionada === correta) {
    feedback.textContent = "✅ Resposta correta!"
    feedback.className = "feedback correto"
    pontuacao++
  } else {
    feedback.innerHTML = `❌ Resposta incorreta. <br>${pergunta.explanation}`
    feedback.className = "feedback incorreto"
  }

  // Mudar o botão de responder para próxima pergunta
  const botaoResponder = document.querySelector(".botao-responder")
  botaoResponder.textContent = "Próxima Pergunta"
  botaoResponder.onclick = () => {
    currentQuestion++
    mostrarPergunta(currentQuestion)
  }
}

// Função para mostrar o resultado final
function mostrarResultadoFinal() {
  const quizContent = document.getElementById("quiz-content")
  const percentual = Math.round((pontuacao / perguntasSelecionadas.length) * 100)

  quizContent.innerHTML = `
    <div class="resultado-final">
      <h2>Quiz Concluído!</h2>
      <div class="pontuacao">
        <p>Você acertou ${pontuacao} de ${perguntasSelecionadas.length} perguntas</p>
        <div class="pontuacao-barra">
          <div class="pontuacao-progresso" style="width: ${percentual}%"></div>
        </div>
        <p class="pontuacao-percentual">${percentual}%</p>
      </div>
      <div class="mensagem-final">
        ${
          percentual >= 70
            ? "<p>🎉 Parabéns! Você tem um bom conhecimento sobre o assunto!</p>"
            : "<p>📚 Continue estudando para melhorar seu conhecimento!</p>"
        }
      </div>
      <button class="botao-reiniciar" onclick="iniciarQuiz()">Tentar Novamente</button>
    </div>
  `
}
