async function carregarGenerosDaAPI() {
  const container = document.getElementById('container-generos');
  
  try {
    const resposta = await fetch('./dados/generos.json');
    const generosTraduzidos = await resposta.json();
    
    container.innerHTML = ''; 
    
    for (const [generoIngles, generoPtBr] of Object.entries(generosTraduzidos)) {
      const divItem = document.createElement('div');
      divItem.style.position = 'relative'; 
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'genero';
      checkbox.value = generoIngles; 
      checkbox.id = `genero-${generoIngles}`;
      checkbox.classList.add('checkbox-oculto');
      
      const label = document.createElement('label');
      label.htmlFor = `genero-${generoIngles}`;
      label.textContent = generoPtBr; 
      label.classList.add('label-botao');
      
      divItem.appendChild(checkbox);
      divItem.appendChild(label);
      container.appendChild(divItem);
    }
    
  } catch (erro) {
    console.error('Erro ao carregar gêneros:', erro);
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