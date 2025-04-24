document.addEventListener("DOMContentLoaded", () => {
  // Referências aos elementos
  const formulario = document.getElementById("avaliacaoForm");
  const agradecimento = document.getElementById("agradecimento");
  const botaoVoltar = document.getElementById("voltarInicio");

  // Adicionar efeitos visuais às opções de avaliação
  const ratingOpcoes = document.querySelectorAll(".rating-opcao input");
  ratingOpcoes.forEach((opcao) => {
  opcao.addEventListener("change", function () {
  // Encontrar todos os inputs do mesmo grupo
  const name = this.getAttribute("name");
  const grupo = document.querySelectorAll(`input[name="${name}"]`);

  // Remover classes de todos os labels do grupo
  grupo.forEach((input) => {
  const label = input.nextElementSibling;
  label.classList.remove("selecionado");
  });

  // Adicionar classe ao label selecionado
  const label = this.nextElementSibling;
  label.classList.add("selecionado");

  // Efeito de brilho
  const container = this.closest(".rating-container");
  container.classList.add("brilho");
  setTimeout(() => {
  container.classList.remove("brilho");
  }, 500);
  });
  });

  // Adicionar efeito de foco às áreas de texto
  const textAreas = document.querySelectorAll(".texto-area");
  textAreas.forEach((area) => {
  area.addEventListener("focus", function () {
  this.classList.add("focado");
  });

  area.addEventListener("blur", function () {
  this.classList.remove("focado");
  });
  });

  // Lidar com o envio do formulário
  formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  // Coletar dados do formulário
  const formData = new FormData(formulario);
  const respostas = {
  nome: formData.get("nome"), // Coletar nome
  email: formData.get("email"), // Coletar email
  };

  for (const [key, value] of formData.entries()) {
    if (key !== "nome" && key !== "email") { // Evitar duplicação
    respostas[key] = value;
    }
  }

  // Enviar dados para o servidor via fetch
  fetch("/send-email-avaliacao", { // *** Rota do servidor para avaliação ***
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  },
  body: JSON.stringify({
  nome: respostas.nome, // Enviar nome
  email: respostas.email, // Enviar email
  mensagem: JSON.stringify(respostas), // Enviando todas as respostas
  }),
  })
  .then(response => {
  if (response.status === 200) { // Ou outro status de sucesso
  return response.json();
  } else {
  return response.text().then(text => { // Se não for 200, tenta ler como texto
  throw new Error(`Erro do servidor: ${response.status} - ${text}`);
  });
  }
  })
  .then(data => {
  console.log("Sucesso:", data);
  alert("Avaliação enviada com sucesso! Obrigado pelo seu feedback.");
  formulario.reset();

  // Mostrar tela de agradecimento
  formulario.classList.add("hidden");
  agradecimento.classList.remove("hidden");

  // Redirecionar para a página inicial após 5 segundos (opcional)
  setTimeout(() => {
    window.location.href = "index.html";
    }, 5000);
    })
    .catch(error => {
    console.error("Erro ao enviar email:", error);
    alert("Ocorreu um erro ao enviar sua avaliação. Por favor, tente novamente.");
    });
    });

  // Botão para voltar à página inicial
  botaoVoltar.addEventListener("click", () => {
  window.location.href = "index.html";
  });

  // Animação de entrada para as seções
  const secoes = document.querySelectorAll(".secao-formulario");
  secoes.forEach((secao, index) => {
  secao.style.opacity = "0";
  secao.style.transform = "translateY(20px)";

  setTimeout(
  () => {
  secao.style.transition = "all 0.5s ease";
  secao.style.opacity = "1";
  secao.style.transform = "translateY(0)";
  },
  300 * (index + 1)
  );
  });

  // Lógica do feedback (semelhante ao feedback.js)
  const feedbackDisponivel = localStorage.getItem("feedbackDisponivel") === "true";

  // Impede que a avaliação seja acessada até que esteja disponível
  if (!feedbackDisponivel) {
  window.location.href = "index.html"; // Redireciona para a página inicial
  }
 });