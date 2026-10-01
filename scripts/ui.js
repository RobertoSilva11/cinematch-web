import { MatchCalculator } from "./modelo.js";

const GENEROS_ESTATICOS = [
  { label: "Ação", value: "Action" },
  { label: "Aventura", value: "Adventure" },
  { label: "Anime", value: "Anime" },
  { label: "Comédia", value: "Comedy" },
  { label: "Crime", value: "Criminal" },
  { label: "Drama", value: "Drama" },
  { label: "Espionagem", value: "Espionage" },
  { label: "Família", value: "Family" },
  { label: "Histórico", value: "History" },
  { label: "Terror", value: "Horror" },
  { label: "Medico", value: "Medical" },
  { label: "Musica", value: "Music" },
  { label: "Misterio", value: "Mystery" },
  { label: "Romance", value: "Romance" },
  { label: "Ficção Científica", value: "Science-Fiction" },
  { label: "Esportes", value: "Sports" },
  { label: "Sobrenatural", value: "Supernatural" },
  { label: "Thriller", value: "Thriller" },
  { label: "Guerra", value: "War" },
  { label: "Faroeste", value: "Western" },
];

const generosSelecionados = new Set();
let filtroIdiomaAtivo = false;
let localizacaoAtiva = false;
const elementosErro = [];

// Cache de catálogo estático e dicionário local de sinopses para evitar falhas de rede/API externa
let catalogoCompletoCache = [];

/**
 * Retorna a sinopse original sem tags HTML. A tradução será feita pelo navegador.
 */
function obterSinopse(serie) {
  if (!serie.summary) return "Sinopse indisponível.";

  // Retira as tags <p>, <b>, etc., que vêm da API
  const textoLimpo = serie.summary.replace(/<[^>]*>?/gm, "");

  return textoLimpo.length > 130
    ? textoLimpo.slice(0, 130) + "..."
    : textoLimpo;
}

/**
 * Renderiza os botões estáticos de gêneros
 */
export function renderizarGenerosEstaticos() {
  const container = document.getElementById("container-generos");
  if (!container) return;

  container.innerHTML = "";

  GENEROS_ESTATICOS.forEach((genero) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.classList.add("btn-genero");
    btn.dataset.value = genero.value;
    btn.textContent = genero.label;

    btn.addEventListener("click", () => {
      if (generosSelecionados.has(genero.value)) {
        generosSelecionados.delete(genero.value);
        btn.classList.remove("selecionado");
      } else {
        generosSelecionados.add(genero.value);
        btn.classList.add("selecionado");
      }

      const inputHidden = document.getElementById("generos-selecionados");
      if (inputHidden) {
        inputHidden.value = Array.from(generosSelecionados).join(",");
      }

      validarFormulario();
    });

    container.appendChild(btn);
  });
}

/**
 * Alternância de Tema
 */
export function inicializarTema() {
  const btnTheme = document.getElementById("btn-theme-toggle");
  const savedTheme = localStorage.getItem("cinematch-theme") || "dark";

  aplicarTema(savedTheme);

  if (btnTheme) {
    btnTheme.addEventListener("click", () => {
      const currentTheme = document.documentElement.classList.contains("light")
        ? "light"
        : "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      aplicarTema(newTheme);
    });
  }
}

function aplicarTema(theme) {
  const html = document.documentElement;
  const icone = document.getElementById("icone-tema");
  const texto = document.getElementById("texto-tema");

  if (theme === "light") {
    html.classList.remove("dark");
    html.classList.add("light");
    if (icone) icone.className = "bi bi-sun-fill";
    if (texto) texto.textContent = "Tema Claro";
  } else {
    html.classList.remove("light");
    html.classList.add("dark");
    if (icone) icone.className = "bi bi-moon-stars-fill";
    if (texto) texto.textContent = "Tema Escuro";
  }
  localStorage.setItem("cinematch-theme", theme);
}

/**
 * Controle do Menu Hambúrguer
 */
export function inicializarMenuHamburguer() {
  const btnHamburguer = document.getElementById("btn-hamburguer");
  const menuNavegacao = document.getElementById("menu-navegacao");

  if (btnHamburguer && menuNavegacao) {
    btnHamburguer.addEventListener("click", () => {
      menuNavegacao.classList.toggle("aberto");
    });
  }
}
///COLOCAR NUM .JS SEPARADO
/**
 * Simula um clique invisível no widget do Google Tradutor e extermina a barra branca
 */
function forcarTraducaoGoogle(ativar) {
  const selectBox = document.querySelector(".goog-te-combo");

  if (ativar) {
    if (selectBox) {
      selectBox.value = "pt";
      selectBox.dispatchEvent(new Event("change"));
    }
  } else {
    // 1. Tenta reverter definindo o idioma alvo de volta para o original ('en')
    if (selectBox) {
      selectBox.value = "en";
      selectBox.dispatchEvent(new Event("change"));
    }

    // 2. Tenta acionar o botão oculto "Show Original" dentro da estrutura do Google
    try {
      const iframe = document.querySelector(
        ".goog-te-banner-frame, body > .skiptranslate > iframe",
      );
      if (iframe) {
        const innerDoc =
          iframe.contentDocument || iframe.contentWindow.document;
        const btnRestore =
          innerDoc.getElementById("restore") ||
          innerDoc.querySelector('button[id*="restore"]');
        if (btnRestore) btnRestore.click();
      }
    } catch (erro) {
      // Ignora bloqueios de segurança do navegador (CORS) caso o iframe seja protegido
    }

    // 3. Destrói o cookie de memória do Google Tradutor
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" +
      location.hostname +
      "; path=/;";
  }

  // Mantém a vigilância contra a barra branca intrusiva
  setTimeout(() => {
    document.body.style.top = "0px";
    const barraGoogle = document.querySelector(
      ".goog-te-banner-frame, .skiptranslate > iframe, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf",
    );
    if (barraGoogle) {
      barraGoogle.style.display = "none";
    }
  }, 500);
}

/**
 * Botão On/Off de Localização com Gatilho de Tradução Instantânea
 SEPARADO*/
export function inicializarGeolocalizacao() {
  const btnGeo = document.getElementById("btn-geolocalizacao");
  const textoBtnGeo = document.getElementById("texto-btn-geo");
  const indicadorCidade = document.getElementById("indicador-cidade");
  const textoCidade = document.getElementById("texto-cidade");

  if (!btnGeo) return;

  btnGeo.addEventListener("click", () => {
    // SE ESTIVER ATIVADO -> VAMOS DESATIVAR
    if (localizacaoAtiva) {
      localizacaoAtiva = false;

      if (indicadorCidade) indicadorCidade.classList.add("escondido");
      if (textoBtnGeo) textoBtnGeo.textContent = "Ativar Localização";

      // Reverte a tradução imediatamente
      forcarTraducaoGoogle(false);
      return;
    }

    // SE ESTIVER DESATIVADO -> VAMOS ATIVAR
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    if (textoCidade) textoCidade.textContent = "Detectando...";
    if (indicadorCidade) indicadorCidade.classList.remove("escondido");

    navigator.geolocation.getCurrentPosition(
      async (posicao) => {
        const lat = posicao.coords.latitude;
        const lon = posicao.coords.longitude;

        try {
          const resposta = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          );
          const dados = await resposta.json();

          const cidade =
            dados.address.city ||
            dados.address.town ||
            dados.address.village ||
            "Sua Região";
          const estado = dados.address.state ? `, ${dados.address.state}` : "";

          if (textoCidade) textoCidade.textContent = `${cidade}${estado}`;
          localizacaoAtiva = true;
          if (textoBtnGeo) textoBtnGeo.textContent = "Desativar Localização";

          // Dispara a tradução imediatamente para Português!
          forcarTraducaoGoogle(true);
        } catch (erro) {
          if (textoCidade) textoCidade.textContent = "Localização Ativa";
          localizacaoAtiva = true;
          if (textoBtnGeo) textoBtnGeo.textContent = "Desativar Localização";

          // Mesmo se a API de mapas falhar, a tradução acontece
          forcarTraducaoGoogle(true);
        }
      },
      () => {
        alert("Não foi possível obter a sua localização.");
        if (indicadorCidade) indicadorCidade.classList.add("escondido");
        localizacaoAtiva = false;
        if (textoBtnGeo) textoBtnGeo.textContent = "Ativar Localização";
      },
    );
  });
}

/**
 * Renderizar e Exibir as Mensagens de Erro
 */
export function renderizarMensagemErro(elemento, id) {
  switch (id) {
    case "nome":
      if (document.getElementById(`${id}-erro`)) {
        elemento.focus();
        break;
      }
      const errorPerfilNome = document.createElement("span");
      errorPerfilNome.id = `${id}-erro`;
      errorPerfilNome.classList.add("msg-erro");
      elemento.classList.add("perfil-erro");

      errorPerfilNome.textContent =
        "Nome não pode conter caracter especial, número, vários espaços e menos de 3 letras!";

      elemento.after(errorPerfilNome);
      elemento.focus();
      break;

    case "idade":
      if (document.getElementById(`${id}-erro`)) {
        elemento.focus();
        break;
      }
      const errorPerfilIdade = document.createElement("span");
      errorPerfilIdade.id = `${id}-erro`;
      errorPerfilIdade.classList.add("msg-erro");
      elemento.classList.add("perfil-erro");

      errorPerfilIdade.textContent = "Idade não pode ser menor que UM(1)!";

      elemento.after(errorPerfilIdade);
      elemento.focus();
      break;

    default:
      console.log(`Nada a fazer na função renderizarMensagemErro!`);
  }
}

/**
 * Remove as Mensagens e Classes dos Campos com Erro
 */
export function limparMensagensErro(elementosErro) {
  elementosErro.forEach((elemento) => {
    elemento.classList.remove("perfil-erro");
    const mensagemErro = document.getElementById(`${elemento.id}-erro`);

    if (mensagemErro) {
      mensagemErro.remove();
    }
  });
}

/**
 * Função de validação dos campos do formulário
 SEPARADO*/
export function validarDadosFormPerfil() {
  const nomeUsuario = document.querySelector("#nome");
  const idadeUsuario = document.querySelector("#idade");

  if (elementosErro.length > 0) {
    limparMensagensErro(elementosErro);
    elementosErro.length = 0;
  }

  const regexNome = /^(?=.*[A-Za-zÀ-ÿ])[A-Za-zÀ-ÿ\s]+$/;

  if (
    !regexNome.test(nomeUsuario.value.trim()) ||
    nomeUsuario.value.trim().length < 3
  ) {
    elementosErro.push(nomeUsuario);
    renderizarMensagemErro(nomeUsuario, nomeUsuario.id);
  }

  if (!idadeUsuario.value || Number(idadeUsuario.value) < 1) {
    elementosErro.push(idadeUsuario);
    renderizarMensagemErro(idadeUsuario, idadeUsuario.id);
  }

  if (elementosErro.length > 0 || generosSelecionados.size === 0) {
    elementosErro.length > 0
      ? elementosErro[0].focus()
      : alert("Por favor, selecione pelo menos um gênero favorito.");
    return false;
  }

  return true;
}

/**
 * Cria o elemento HTML de um Card de Série

FAZ SENTIDO FAZER UMA REESCRITRA PARA CREATELEMENT?*/

function criarCardSerie(serie) {
  const card = document.createElement("article");
  card.className = "card-serie";

  const imagemPoster =
    serie.image?.medium ||
    serie.image?.original ||
    "https://via.placeholder.com/210x295?text=Sem+Capa";
  const nota = serie.rating?.average ? `${serie.rating.average} / 10` : "N/A";
  const sinopseExibicao = obterSinopse(serie);

  card.innerHTML = `
        <div class="badge-match ${serie.match >= 50 ? "match-alto" : "match-medio"} notranslate">
            ${serie.match}% Match
        </div>
        <img src="${imagemPoster}" alt="Poster de ${serie.name}" loading="lazy" class="img-poster">
        <div class="conteudo-card">
            <h3>${serie.name}</h3>
            <p class="generos-card">${(serie.genres || []).join(" • ")}</p>
            <p class="sinopse-card">${sinopseExibicao}</p>
            <div class="rodape-card">
                <span class="nota-card"><i class="bi bi-star-fill"></i> ${nota}</span>
                <a href="${serie.url}" target="_blank" rel="noopener noreferrer" class="btn-detalhes">
                    Ver Mais <i class="bi bi-box-arrow-up-right"></i>
                </a>
            </div>
        </div>
    `;

  return card;
}

/**
 * Consome a API do TVMaze, separa em duas seções de recomendação com carrossel
 */
export async function carregarERenderizarSeries() {
  const esteiraAlto = document.getElementById("esteira-match-alto");
  const esteiraMedio = document.getElementById("esteira-match-medio");
  const tituloAlto = document.getElementById("titulo-match-alto");

  if (!esteiraAlto || !esteiraMedio) return;

  const perfilAtivo = JSON.parse(
    localStorage.getItem("cineMatch_perfil_ativo"),
  );
  /**CREATELEMENT E APPENDCHILD NO ESTEIRA ALTO */
  if (
    !perfilAtivo ||
    !perfilAtivo.generos ||
    perfilAtivo.generos.length === 0
  ) {
    esteiraAlto.innerHTML =
      '<p class="mensagem-feedback">Nenhum perfil ativo encontrado. Por favor, crie ou selecione um perfil.</p>';
    return;
  }

  if (tituloAlto) {
    tituloAlto.textContent = `${perfilAtivo.nome}, escolha o match ideal que encontramos para você:`;
  }

  try {
    esteiraAlto.innerHTML =
      '<p class="mensagem-feedback"><i class="bi bi-arrow-repeat spin"></i> Buscando recomendações no catálogo...</p>';
    esteiraMedio.innerHTML = "";
    /**separar a busca api para uma função buscar catálogo para tratativa de erro é mais facil SEPARADO */
    if (catalogoCompletoCache.length === 0) {
      const resposta = await fetch("https://api.tvmaze.com/shows");
      if (!resposta.ok) throw new Error("Falha ao conectar à API de séries.");
      catalogoCompletoCache = await resposta.json();
    }

    let series = [...catalogoCompletoCache];

    // Calcula o % de Match e ordena de forma decrescente
    const seriesComMatch = series
      .map((serie) => {
        const percentualMatch = MatchCalculator.calcularMatch(
          perfilAtivo.generos,
          serie.genres || [],
        );
        return { ...serie, match: percentualMatch };
      })
      .sort((a, b) => b.match - a.match);

    // Separação em duas categorias (Match >= 50% e Match < 50%)
    const maiorCompatibilidade = seriesComMatch.filter((s) => s.match >= 50);
    const menosRecomendadas = seriesComMatch.filter((s) => s.match < 50);

    esteiraAlto.innerHTML = "";
    esteiraMedio.innerHTML = "";

    // Renderiza Seção 1
    if (maiorCompatibilidade.length === 0) {
      esteiraAlto.innerHTML =
        '<p class="mensagem-feedback">Nenhuma série com alta compatibilidade para os gêneros escolhidos.</p>';
    } else {
      maiorCompatibilidade.forEach((serie) => {
        esteiraAlto.appendChild(criarCardSerie(serie));
      });
    }

    // Renderiza Seção 2
    menosRecomendadas.forEach((serie) => {
      esteiraMedio.appendChild(criarCardSerie(serie));
    });

    configurarControlesCarrossel();
    configurarModalBuscaAvancada();
  } catch (erro) {
    console.error("Erro ao carregar séries:", erro);
    esteiraAlto.innerHTML =
      '<p class="mensagem-feedback" style="color: #e63946;">Erro ao carregar os dados da API TVMaze. Tente novamente mais tarde.</p>';
  }
}

/**
 * Ativa a rolagem horizontal nos botões de prev e next
 */
function configurarControlesCarrossel() {
  const btnPrevAlto = document.getElementById("btn-prev-alto");
  const btnNextAlto = document.getElementById("btn-next-alto");
  const esteiraAlto = document.getElementById("esteira-match-alto");

  const btnPrevMedio = document.getElementById("btn-prev-medio");
  const btnNextMedio = document.getElementById("btn-next-medio");
  const esteiraMedio = document.getElementById("esteira-match-medio");

  if (btnPrevAlto && btnNextAlto && esteiraAlto) {
    btnPrevAlto.onclick = () =>
      esteiraAlto.scrollBy({ left: -400, behavior: "smooth" });
    btnNextAlto.onclick = () =>
      esteiraAlto.scrollBy({ left: 400, behavior: "smooth" });
  }

  if (btnPrevMedio && btnNextMedio && esteiraMedio) {
    btnPrevMedio.onclick = () =>
      esteiraMedio.scrollBy({ left: -400, behavior: "smooth" });
    btnNextMedio.onclick = () =>
      esteiraMedio.scrollBy({ left: 400, behavior: "smooth" });
  }
}

/**
 * Inicializa a funcionalidade do Modal de Busca Avançada
 */
function configurarModalBuscaAvancada() {
  const btnAbrir = document.getElementById("btn-abrir-busca-avancada");
  const btnFechar = document.getElementById("btn-fechar-busca-avancada");
  const modal = document.getElementById("modal-busca-avancada");
  const inputBusca = document.getElementById("input-busca-avancada");
  const containerResultados = document.getElementById(
    "resultados-busca-avancada",
  );

  if (!btnAbrir || !modal || !inputBusca || !containerResultados) return;

  const renderizarBusca = (filtro = "") => {
    containerResultados.innerHTML = "";
    const termo = filtro.toLowerCase().trim();

    const filtradas = catalogoCompletoCache.filter((serie) =>
      serie.name.toLowerCase().includes(termo),
    );

    if (filtradas.length === 0) {
      containerResultados.innerHTML =
        '<p class="mensagem-feedback">Nenhuma série encontrada com esse nome.</p>';
      return;
    }

    filtradas.forEach((serie) => {
      containerResultados.appendChild(criarCardSerie(serie));
    });
  };

  btnAbrir.onclick = () => {
    modal.classList.remove("escondido");
    inputBusca.value = "";
    renderizarBusca();
    inputBusca.focus();
  };

  btnFechar.onclick = () => {
    modal.classList.add("escondido");
  };

  inputBusca.oninput = (e) => {
    renderizarBusca(e.target.value);
  };
}

/**
 * Alternância de Telas e Submissão
 */
export function configurarFormularioPerfil() {
  const form = document.getElementById("form-perfil");
  const secaoPerfil = document.getElementById("secao-perfil");
  const secaoResultados = document.getElementById("secao-resultados");
  const secaoSelecaoPerfil = document.getElementById("secao-selecao-perfil");
  const listaPerfis = document.getElementById("lista-perfis");
  const secaoInicial = document.getElementById("secao-inicial");

  const btnTrocarPerfil = document.getElementById("btn-trocar-perfil");
  const btnCriarPerfil = document.getElementById("btn-criar-perfil");
  const btnSalvarPerfil = document.getElementById("btn-salvar-perfil");
  const inputNome = document.getElementById("nome");
  const inputIdade = document.getElementById("idade");

  if (inputNome) inputNome.addEventListener("input", validarFormulario);
  if (inputIdade) inputIdade.addEventListener("input", validarFormulario);

  const btnHeroCriar = document.getElementById("btn-hero-criar");
  const btnPaginaInicial = document.getElementById("btn-pagina-inicial");

  let perfilEditandoId = null;

  function obterPerfisSalvos() {
    return JSON.parse(localStorage.getItem("cineMatch_perfis")) || [];
  }

  function salvarPerfis(perfis) {
    localStorage.setItem("cineMatch_perfis", JSON.stringify(perfis));
  }

  function abrirPaginaInicial() {
    if (secaoSelecaoPerfil) secaoSelecaoPerfil.classList.add("escondido");
    if (secaoResultados) secaoResultados.classList.add("escondido");
    if (secaoPerfil) secaoPerfil.classList.add("escondido");
    if (secaoInicial) secaoInicial.classList.remove("escondido");
  }

  function abrirFormularioVazio() {
    if (secaoSelecaoPerfil) secaoSelecaoPerfil.classList.add("escondido");
    if (secaoResultados) secaoResultados.classList.add("escondido");
    if (secaoInicial) secaoInicial.classList.add("escondido");
    if (secaoPerfil) secaoPerfil.classList.remove("escondido");

    perfilEditandoId = null;
    if (form) form.reset();

    generosSelecionados.clear();
    document
      .querySelectorAll(".btn-genero")
      .forEach((btn) => btn.classList.remove("selecionado"));
    const inputHidden = document.getElementById("generos-selecionados");
    if (inputHidden) inputHidden.value = "";

    validarFormulario();
  }

  function preencherFormulario(perfil) {
    if (secaoSelecaoPerfil) secaoSelecaoPerfil.classList.add("escondido");
    if (secaoResultados) secaoResultados.classList.add("escondido");
    if (secaoInicial) secaoInicial.classList.add("escondido");
    if (secaoPerfil) secaoPerfil.classList.remove("escondido");

    perfilEditandoId = perfil.id;
    document.getElementById("nome").value = perfil.nome;
    document.getElementById("idade").value = perfil.idade;

    generosSelecionados.clear();
    perfil.generos.forEach((g) => generosSelecionados.add(g));

    document.querySelectorAll(".btn-genero").forEach((btn) => {
      if (generosSelecionados.has(btn.dataset.value)) {
        btn.classList.add("selecionado");
      } else {
        btn.classList.remove("selecionado");
      }
    });

    const inputHidden = document.getElementById("generos-selecionados");
    if (inputHidden)
      inputHidden.value = Array.from(generosSelecionados).join(",");

    validarFormulario();
  }

  function deletarPerfil(idParaDeletar) {
    let perfis = obterPerfisSalvos();
    perfis = perfis.filter((p) => p.id !== idParaDeletar);
    salvarPerfis(perfis);
    abrirSelecaoDePerfis();
  }

  function abrirSelecaoDePerfis() {
    const perfis = obterPerfisSalvos();

    if (perfis.length === 0) {
      abrirPaginaInicial();
      return;
    }

    if (secaoPerfil) secaoPerfil.classList.add("escondido");
    if (secaoResultados) secaoResultados.classList.add("escondido");
    if (secaoInicial) secaoInicial.classList.add("escondido");
    if (secaoSelecaoPerfil) secaoSelecaoPerfil.classList.remove("escondido");

    listaPerfis.innerHTML = "";

    perfis.forEach((perfil) => {
      const divItem = document.createElement("div");
      divItem.className = "item-perfil";

      const divInfo = document.createElement("div");
      divInfo.className = "info-perfil";
      divInfo.innerHTML = `<strong>${perfil.nome}</strong> <small>${perfil.idade} anos • ${perfil.generos.length} gêneros favoritados</small>`;
      divInfo.onclick = () => preencherFormulario(perfil);

      const btnDeletar = document.createElement("button");
      btnDeletar.className = "btn-deletar-perfil";
      btnDeletar.innerHTML = '<i class="bi bi-x-lg"></i>';
      btnDeletar.title = "Excluir perfil";
      btnDeletar.onclick = (e) => {
        e.stopPropagation();
        if (
          confirm(`Tem certeza que deseja excluir o perfil de ${perfil.nome}?`)
        ) {
          deletarPerfil(perfil.id);
        }
      };

      divItem.appendChild(divInfo);
      divItem.appendChild(btnDeletar);
      listaPerfis.appendChild(divItem);
    });
  }

  if (btnPaginaInicial) {
    btnPaginaInicial.addEventListener("click", (e) => {
      e.preventDefault();
      const menuNavegacao = document.getElementById("menu-navegacao");
      if (menuNavegacao && menuNavegacao.classList.contains("aberto")) {
        menuNavegacao.classList.remove("aberto");
      }
      abrirPaginaInicial();
    });
  }

  if (btnHeroCriar) {
    btnHeroCriar.addEventListener("click", (e) => {
      e.preventDefault();
      abrirFormularioVazio();
    });
  }

  if (btnTrocarPerfil) {
    btnTrocarPerfil.addEventListener("click", (e) => {
      e.preventDefault();
      const menuNavegacao = document.getElementById("menu-navegacao");
      if (menuNavegacao && menuNavegacao.classList.contains("aberto")) {
        menuNavegacao.classList.remove("aberto");
      }
      abrirSelecaoDePerfis();
    });
  }

  if (btnCriarPerfil) {
    btnCriarPerfil.addEventListener("click", (e) => {
      e.preventDefault();
      const menuNavegacao = document.getElementById("menu-navegacao");
      if (menuNavegacao && menuNavegacao.classList.contains("aberto")) {
        menuNavegacao.classList.remove("aberto");
      }
      abrirFormularioVazio();
    });
  }

  if (btnSalvarPerfil) {
    btnSalvarPerfil.addEventListener("click", (e) => {
      e.preventDefault();
      const nome = document.getElementById("nome").value.trim();
      const idade = document.getElementById("idade").value;

      if (!validarDadosFormPerfil()) {
        return;
      }

      const perfilSalvo = {
        id: perfilEditandoId || Date.now().toString(),
        nome,
        idade: Number(idade),
        generos: Array.from(generosSelecionados),
        apenasTraduzidas:
          typeof filtroIdiomaAtivo !== "undefined" ? filtroIdiomaAtivo : false,
      };

      let perfis = obterPerfisSalvos();

      if (perfilEditandoId) {
        const index = perfis.findIndex((p) => p.id === perfilEditandoId);
        if (index !== -1) perfis[index] = perfilSalvo;
      } else {
        perfis.push(perfilSalvo);
        perfilEditandoId = perfilSalvo.id;
      }

      salvarPerfis(perfis);
      localStorage.setItem(
        "cineMatch_perfil_ativo",
        JSON.stringify(perfilSalvo),
      );

      alert(`O perfil de ${nome} foi salvo com sucesso!`);
    });
  }

  // --- SUBMISSÃO DO FORMULÁRIO (EVENTO SUBMIT) ---
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const nome = document.getElementById("nome").value.trim();
      const idade = document.getElementById("idade").value;

      if (!validarDadosFormPerfil()) {
        return;
      }

      const perfilSalvo = {
        id: perfilEditandoId || Date.now().toString(),
        nome,
        idade: Number(idade),
        generos: Array.from(generosSelecionados),
        apenasTraduzidas:
          typeof filtroIdiomaAtivo !== "undefined" ? filtroIdiomaAtivo : false,
      };

      let perfis = obterPerfisSalvos();

      if (perfilEditandoId) {
        const index = perfis.findIndex((p) => p.id === perfilEditandoId);
        if (index !== -1) perfis[index] = perfilSalvo;
      } else {
        perfis.push(perfilSalvo);
      }

      salvarPerfis(perfis);
      localStorage.setItem(
        "cineMatch_perfil_ativo",
        JSON.stringify(perfilSalvo),
      );

      // Transita para a seção de resultados
      if (secaoPerfil) secaoPerfil.classList.add("escondido");
      if (secaoResultados) secaoResultados.classList.remove("escondido");

      // Executa o consumo da API e a geração dos cards
      carregarERenderizarSeries();

      console.log("Perfil Atualizado/Criado:", perfilSalvo);
    });
  }

  const perfisIniciais = obterPerfisSalvos();
  if (perfisIniciais.length > 0) {
    abrirSelecaoDePerfis();
  } else {
    abrirPaginaInicial();
  }
}

/**
 * Verifica em tempo real se o formulário cumpre as regras para ativar os botões
 */
export function validarFormulario() {
  const form = document.getElementById("form-perfil");
  const nome = document.getElementById("nome");
  const idade = document.getElementById("idade");
  const btnSalvar = document.getElementById("btn-salvar-perfil");
  const btnSubmit = document.getElementById("btn-submit");

  if (!nome || !idade || !btnSalvar || !btnSubmit || !form) return;

  const formValido =
    nome.value.trim() !== "" &&
    idade.value.trim() !== "" &&
    generosSelecionados.size > 0;

  btnSalvar.disabled = !formValido;
  btnSubmit.disabled = !formValido;

  if (formValido) {
    form.classList.add("form-completo");
  } else {
    form.classList.remove("form-completo");
  }
}

/**
 * Busca as 20 melhores séries da API e cria o banner de rolagem infinita
 */
export async function carregarBannerInicial() {
  const trilho = document.getElementById("trilho-banner-inicial");
  if (!trilho) return;

  try {
    if (catalogoCompletoCache.length === 0) {
      const resposta = await fetch("https://api.tvmaze.com/shows");
      if (!resposta.ok) throw new Error("Falha ao conectar à API.");
      catalogoCompletoCache = await resposta.json();
    }

    // Ordena pela nota e pega as 20 melhores
    const top20 = [...catalogoCompletoCache]
      .sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0))
      .slice(0, 20);

    // Função interna para montar o bloco de 20 cards
    const gerarBlocoDeCards = () => {
      let htmlCards = "";
      top20.forEach((serie) => {
        const imagem =
          serie.image?.medium ||
          serie.image?.original ||
          "https://via.placeholder.com/200x295?text=Sem+Capa";
        htmlCards += `<div class="card-banner"><img src="${imagem}" alt="${serie.name}" loading="lazy"></div>`;
      });
      return htmlCards;
    };

    // Injeta os 20 cards originais + 20 duplicados (Necessário para a animação CSS não falhar)
    trilho.innerHTML = gerarBlocoDeCards() + gerarBlocoDeCards();
  } catch (erro) {
    console.error("Erro ao carregar o banner inicial:", erro);
  }
}
