async function carregarGenerosDaAPI() {
  const container = document.getElementById('container-generos');
  
  try {
    // 1. Busca as séries na TVMaze
    const resposta = await fetch('https://api.tvmaze.com/shows');
    const series = await resposta.json();
    
    // 2. Extrai os gêneros únicos da TVMaze (em inglês)
    const todosOsGeneros = series.flatMap(serie => serie.genres);
    const generosUnicos = [...new Set(todosOsGeneros)].sort();
    
    // Limpa a mensagem "Carregando..."
    container.innerHTML = ''; 
    
    // 3. Usamos for...of para carregar e traduzir um por um dinamicamente
    for (const genero of generosUnicos) {
      
      const divItem = document.createElement('div');
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'genero';
      checkbox.value = genero; // Mantém o value original (em inglês) para buscas futuras
      checkbox.id = `genero-${genero}`;
      checkbox.classList.add('checkbox-oculto');
      
      // ========================================================
      // TRADUÇÃO DINÂMICA VIA API (Sem texto hardcoded no JS)
      // ========================================================
      let nomeExibicao = genero; // Valor padrão caso a tradução falhe
      
      try {
        // Consome a API de tradução passando a palavra em inglês e pedindo pt-br
        const resTraducao = await fetch(`https://api.mymemory.translated.net/get?q=${genero}&langpair=en|pt-br`);
        const dadosTraducao = await resTraducao.json();
        
        // Se a API retornar a tradução com sucesso, atualiza o nome
        if (dadosTraducao.responseData && dadosTraducao.responseData.translatedText) {
          nomeExibicao = dadosTraducao.responseData.translatedText;
        }
      } catch (erroTraducao) {
        console.warn(`Aviso: Não foi possível traduzir dinamicamente o gênero ${genero}`);
      }
      // ========================================================
      
      // Monta a Label que o usuário vai ver e clicar
      const label = document.createElement('label');
      label.htmlFor = `genero-${genero}`;
      label.textContent = nomeExibicao; // Recebe o texto traduzido pela API
      label.classList.add('label-botao');
      
      divItem.appendChild(checkbox);
      divItem.appendChild(label);
      container.appendChild(divItem);
    }
    
  } catch (erro) {
    console.error('Erro ao carregar géneros:', erro);
    container.innerHTML = '<span style="color: red;">Erro ao carregar os gêneros.</span>';
  }
}

document.addEventListener('DOMContentLoaded', carregarGenerosDaAPI);

document.getElementById('form-perfil').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const nome = document.getElementById('nome').value;
  const idade = document.getElementById('idade').value;
  
  // Captura todos os checkboxes que foram marcados
  const checkboxesMarcados = document.querySelectorAll('input[name="genero"]:checked');
  const generosSelecionados = Array.from(checkboxesMarcados).map(checkbox => checkbox.value);
  
  if (generosSelecionados.length === 0) {
    alert('Por favor, selecione pelo menos um género favorito.');
    return; 
  }
  
  const perfilUsuario = {
    nome: nome,
    idade: idade,
    generos: generosSelecionados
  };
  
  localStorage.setItem('cineMatch_perfil', JSON.stringify(perfilUsuario));
  
  alert('Perfil guardado com sucesso!');
  console.log('Perfil salvo:', perfilUsuario);
});

// alterna botão tema claro e escuro
const btnModo = document.getElementById("btn-modo");

// Ícone inicial
btnModo.innerHTML = '<i class="bi bi-moon-fill"></i>';

btnModo.addEventListener('click', () => {
  // Alterna a classe 'modo-claro' no body (o CSS faz o resto mudar de cor sozinho)
  document.body.classList.toggle('modo-claro');

  // Muda o ícone
  if (document.body.classList.contains('modo-claro')) {
    btnModo.innerHTML = '<i class="bi bi-sun-fill" style="color: #E6A100;"></i>';
  } else {
    btnModo.innerHTML = '<i class="bi bi-moon-fill" style="color: var(--verde-cinematch);"></i>';
  }
});