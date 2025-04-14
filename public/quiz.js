let perguntas = [];

document.getElementById('userForm').addEventListener('submit', function (e) {
  e.preventDefault();
  document.getElementById('userForm').classList.add('hidden');
  document.getElementById('quiz').classList.remove('hidden');
  carregarPerguntas();
});

function carregarPerguntas() {
  fetch('perguntas.json')
    .then(response => response.json())
    .then(data => {
      perguntas = data;
      mostrarPergunta(0);
    });
}

let currentQuestion = 0;
function mostrarPergunta(index) {
  const quizDiv = document.getElementById('quiz');
  const pergunta = perguntas[index];
  
  if (!pergunta) {
    quizDiv.innerHTML = `<p>Você concluiu o quiz! 🎉</p>`;
    return;
  }

  quizDiv.innerHTML = `
    <div class="question">
      <h3>${pergunta.question}</h3>
      ${pergunta.imageUrl ? `<img src="${pergunta.imageUrl}" class="image" />` : ''}
      <div class="options">
        ${pergunta.options.map((opt, i) => `
          <label><input type="radio" name="resposta" value="${i}" /> ${opt}</label>
        `).join('')}
      </div>
      <button onclick="verificarResposta(${index})">Responder</button>
    </div>
  `;
}

function verificarResposta(index) {
  const radios = document.getElementsByName('resposta');
  let respostaSelecionada = null;
  for (let radio of radios) {
    if (radio.checked) {
      respostaSelecionada = parseInt(radio.value);
      break;
    }
  }

  if (respostaSelecionada === null) {
    alert('Selecione uma resposta.');
    return;
  }

  const pergunta = perguntas[index];
  const correta = pergunta.correctAnswer;

  let mensagem = respostaSelecionada === correta
    ? "✅ Resposta correta!"
    : `❌ Resposta incorreta. ${pergunta.explanation}`;

  alert(mensagem);

  currentQuestion++;
  mostrarPergunta(currentQuestion);
}
