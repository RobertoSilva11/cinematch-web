async function carregarGenerosDaAPI() {
  const container = document.getElementById('container-generos');
  
  try {
    // 1. Busca a lista principal de séries da API
    const resposta = await fetch('https://api.tvmaze.com/shows');
    const series = await resposta.json();
    
    // 2. Extrai e filtra apenas os géneros únicos (em ordem alfabética)
    const todosOsGeneros = series.flatMap(serie => serie.genres);
    const generosUnicos = [...new Set(todosOsGeneros)].sort();
    
    // 3. Limpa o texto "A carregar géneros..."
    container.innerHTML = '';
    
    // 4. Cria dinamicamente os elementos HTML para cada género
    generosUnicos.forEach(genero => {
      const label = document.createElement('label');
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'genero';
      checkbox.value = genero; // Mantém em inglês para a API funcionar depois
      
      // Tradução visual básica para os géneros mais comuns (opcional)
      const nomesTraduzidos = {
        "Action": "Ação",
        "Adventure": "Aventura",
        "Comedy": "Comédia",
        "Drama": "Drama",
        "Romance": "Romance",
        "Science-Fiction": "Ficção Científica",
        "Thriller": "Suspense"
      };
      const nomeExibicao = nomesTraduzidos[genero] || genero;
      
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(` ${nomeExibicao}`));
      
      container.appendChild(label);
    });
    
  } catch (erro) {
    console.error('Erro ao carregar géneros:', erro);
    container.innerHTML = '<p>Erro ao carregar os géneros. Tente novamente mais tarde.</p>';
  }
}

// Executa a função assim que o HTML terminar de carregar
document.addEventListener('DOMContentLoaded', carregarGenerosDaAPI);

document.getElementById('form-perfil').addEventListener('submit', function(event) {
  // 1. Impede a página de recarregar
  event.preventDefault();
  
  // 2. Captura os valores digitados
  const nome = document.getElementById('nome').value;
  const idade = document.getElementById('idade').value;
  
  // 3. Captura os géneros selecionados
  // Seleciona todos os inputs com name="genero" que estão marcados (:checked)
  const checkboxesMarcados = document.querySelectorAll('input[name="genero"]:checked');
  
  // Transforma a lista de elementos HTML num array apenas com os textos (values)
  const generosSelecionados = Array.from(checkboxesMarcados).map(checkbox => checkbox.value);
  
  // 4. Validação extra: Obriga a selecionar pelo menos um género
  if (generosSelecionados.length === 0) {
    alert('Por favor, selecione pelo menos um género favorito.');
    return; // Para a execução da função aqui
  }
  
  // 5. Monta o objeto com o perfil do utilizador
  const perfilUsuario = {
    nome: nome,
    idade: idade,
    generos: generosSelecionados
  };
  
  // 6. Guarda no localStorage (convertendo o objeto para texto/JSON)
  localStorage.setItem('cineMatch_perfil', JSON.stringify(perfilUsuario));
  
  alert('Perfil guardado com sucesso!');
  
  // Próximo passo: esconder o formulário e carregar a lista de séries (RF04)
  console.log('Perfil salvo:', perfilUsuario);
});