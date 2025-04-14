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
  
    // Salvar no localStorage
    localStorage.setItem('respostasFormulario', JSON.stringify(dados));
  
    // Mostrar mensagem de agradecimento
    document.getElementById('mensagem-obrigado').classList.remove('hidden');
  
    // Opcional: Limpar o formulário
    this.reset();
  });
  