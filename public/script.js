document.getElementById('formulario').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  let dados = {};

  for (let [key, value] of formData.entries()) {
    if (key === "ferramentas") {
      if (!dados[key]) dados[key] = [];
      dados[key].push(value);
    } else {
      dados[key] = value;
    }
  }

  // Enviar para o backend via fetch
fetch('/send-email', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    nome: dados.nome,
    email: dados.email,
    mensagem: dados.expectativas // ou outro campo
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erro ao enviar email:', error));


  // Opcional: salvar no localStorage também
  localStorage.setItem('respostasFormulario', JSON.stringify(dados));
});
