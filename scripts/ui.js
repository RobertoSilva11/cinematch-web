import { buscarCatalogo } from "./api.js";
import { MatchCalculator, Series } from "./modelo.js";

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

// --- RF11: CLOSURE ---
// Preserva o estado de quantas buscas o utilizador fez nesta sessão
const contadorSessao = (function () {
  let calculos = 0;
  return function () {
    calculos += 1;
    return calculos;
  };
})();

// --- RF10: CALLBACK ---
// Função que será passada como argumento para controlar o fluxo após renderizar
export function exibirBoasVindas(nome, tentativas) {
  const tituloAlto = document.getElementById("titulo-match-alto");
  if (tituloAlto) {
    tituloAlto.textContent = `${nome}, aqui está o seu match ideal (Busca nº ${tentativas} na sessão):`;
  }
}

export function exibirMensagemFeedback(
  elementoContainer,
  textoMensagem,
  ehErro = false,
  temSpinner = false,
) {
  elementoContainer.innerHTML = "";
  const p = document.createElement("p");
  p.className = "mensagem-feedback";

  if (temSpinner) {
    const icon = document.createElement("i");
    icon.className = "bi bi-arrow-repeat spin";
    p.appendChild(icon);
    p.appendChild(document.createTextNode(" "));
  }

  p.appendChild(document.createTextNode(textoMensagem));
  if (ehErro) p.style.color = "#e63946";

  elementoContainer.appendChild(p);
}

/**
 * Retorna a sinopse original sem tags HTML. A tradução será feita pelo navegador.
 */
function obterSinopse(serie) {
  if (!serie.sinopse) return "Sinopse indisponível.";

  // Retira as tags <p>, <b>, etc., que vêm da API
  const textoLimpo = serie.sinopse.replace(/<[^>]*>?/gm, "");

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
 * Cria o elemento HTML de um Card de Série (RF08)
 */
function criarCardSerie(serie, matchDetalhes = null) {
  const card = document.createElement("article");
  card.className = "card-serie";

  const imagemPoster =
    serie.imagemMedia ||
    serie.imagemOriginal ||
    "https://via.placeholder.com/210x295?text=Sem+Capa";

  const nota = 
    serie.avaliacaoNota !== null && serie.avaliacaoNota !== undefined
      ? `${serie.avaliacaoNota} / 10`
      : "N/A";

  const sinopseExibicao = obterSinopse(serie);

  /*
   * Badge de Match
   */
  if (matchDetalhes) {
    const percentual = Number(matchDetalhes.percentual) || 0;

    const badge = document.createElement("div");
    // Usa a classificação para definir a cor
    badge.className = `badge-match ${matchDetalhes.percentual >= 50 ? "match-alto" : "match-medio"} notranslate`; 
    badge.textContent = `${percentual}% Match`;
    card.appendChild(badge);
  }

  /*
   * Imagem
   */
  const img = document.createElement("img");

  img.src = imagemPoster;
  img.alt = `Poster de ${serie.titulo}`;
  img.className = "img-poster";
  img.loading = "lazy";
  img.onerror = function () {
    card.remove();
  };
  card.appendChild(img);

  /*
   * Conteúdo
   */
  const conteudo = document.createElement("div");
  conteudo.className = "conteudo-card";

  /*
   * Título
   */
  const titulo = document.createElement("h3");
  titulo.textContent = serie.titulo || "Título não informado";
  conteudo.appendChild(titulo);

  /*
   * Gêneros da série
   */
  const generos = document.createElement("p");
  generos.className = "generos-card";
  generos.textContent =
    Array.isArray(serie.generos) && serie.generos.length > 0
      ? serie.generos.join(" • ")
      : "Gêneros não informados";

  conteudo.appendChild(generos);

  /*
   * Sinopse
   */
  const sinopse = document.createElement("p");
  sinopse.className = "sinopse-card";
  sinopse.textContent = sinopseExibicao;
  conteudo.appendChild(sinopse);

  // Injeção dos dados exigidos pelo RF08 (Gêneros em comum e não explorados)
  /*
   * Informações de afinidade
   */
  if (matchDetalhes) {
    const percentual = Number(matchDetalhes.percentual) || 0;
    const classificacao = matchDetalhes.classificacao || "Nenhuma Afinidade";

    // Container da afinidade
    const afinidade = document.createElement("div");
    afinidade.className = "afinidade-card";

    //Cabeçalho da afinidade
    const afinidadeCabecalho = document.createElement("div");
      afinidadeCabecalho.className = "afinidade-cabecalho";
    const afinidadeTitulo = document.createElement("span");
      afinidadeTitulo.className = "afinidade-titulo";
      afinidadeTitulo.textContent = percentual ? "Afinidade" : "";
    const afinidadeClassificacao = document.createElement("strong");
      afinidadeClassificacao.className = "afinidade-classificacao";
      afinidadeClassificacao.textContent = classificacao;
      afinidadeCabecalho.appendChild(afinidadeTitulo);
      afinidadeCabecalho.appendChild(afinidadeClassificacao);
      afinidade.appendChild(afinidadeCabecalho);

    // Barra de progresso
    const barra = document.createElement("div");
      barra.className = "match-barra";
      barra.setAttribute("role", "progressbar");
      barra.setAttribute("aria-valuenow", percentual);
      barra.setAttribute("aria-valuemin", "0");
      barra.setAttribute("aria-valuemax", "100");
      barra.setAttribute("aria-label", `Afinidade de ${percentual}%`);

    const progresso = document.createElement("div");
      progresso.className = "match-progresso";
      progresso.style.width = `${percentual}%`;
      barra.appendChild(progresso);
      afinidade.appendChild(barra);
      conteudo.appendChild(afinidade);

    //Gêneros em comum
    const generosComuns = Array.isArray(matchDetalhes.generosComuns)
      ? matchDetalhes.generosComuns
      : [];

    const containerComuns = document.createElement("div");
      containerComuns.className = "generos-match generos-comuns";

    const tituloComuns = document.createElement("span");
      tituloComuns.className = "titulo-generos-match";
      tituloComuns.textContent = "Em comum:";
      containerComuns.appendChild(tituloComuns);

    if (generosComuns.length > 0) {
      generosComuns.forEach((genero) => {
        const tag = document.createElement("span");
          tag.className = "genero-tag";
          tag.textContent = genero;
        containerComuns.appendChild(tag);
      });
    } else {
      const vazio = document.createElement("span");
        vazio.className = "generos-vazio";
        vazio.textContent = "Nenhum gênero em comum";
      containerComuns.appendChild(vazio);
    }
    conteudo.appendChild(containerComuns);

    // Gêneros ainda não explorados
    const generosNaoExplorados = Array.isArray(
      matchDetalhes.generosNaoExplorados,
    )
      ? matchDetalhes.generosNaoExplorados
      : [];

    const containerNaoExplorados = document.createElement("div");
      containerNaoExplorados.className = "generos-match generos-nao-explorados";
    
    const tituloNaoExplorados = document.createElement("span");
      tituloNaoExplorados.className = "titulo-generos-match";
      tituloNaoExplorados.textContent = "Ainda não explorados:";
      
      containerNaoExplorados.appendChild(tituloNaoExplorados);

    if (generosNaoExplorados.length > 0) {
      generosNaoExplorados.forEach((genero) => {
        const tag = document.createElement("span");
          tag.className = "genero-tag";
          tag.textContent = genero;
        containerNaoExplorados.appendChild(tag);
      });
    } else {
      const vazio = document.createElement("span");
        vazio.className = "generos-vazio";
        vazio.textContent = "Nenhum gênero novo";
      containerNaoExplorados.appendChild(vazio);
    }
    conteudo.appendChild(containerNaoExplorados);
  }

  /** 
   * Rodapé 
    */ 
  const rodape = document.createElement("div");
    rodape.className = "rodape-card";

  // Nota
  const spanNota = document.createElement("span");
    spanNota.className = "nota-card";
  const iconeEstrela = document.createElement("i");
    iconeEstrela.className = "bi bi-star-fill";
    spanNota.appendChild(iconeEstrela);
    spanNota.appendChild(document.createTextNode(` ${nota}`));

    rodape.appendChild(spanNota);

  // Link
  const link = document.createElement("a");
    link.href = serie.url || "#";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "btn-detalhes";
    link.textContent = "Ver Mais ";

  const iconeSeta = document.createElement("i");
    iconeSeta.className = "bi bi-box-arrow-up-right";
    link.appendChild(iconeSeta);
    rodape.appendChild(link);
    conteudo.appendChild(rodape);
    card.appendChild(conteudo);

  return card;
}

/**
 * Transforma os dados da API em objetos Series (RF05 - Tratamento de dados limpos)
 */
export function transformarDadosApiEmSeries(dados) {
  // Filtra séries que não têm gêneros, não têm avaliação OU NÃO TÊM IMAGEM
  return dados
    .filter(
      (dado) =>
        dado.genres &&
        dado.genres.length > 0 &&
        dado.rating &&
        dado.rating.average &&
        dado.image &&
        (dado.image.medium || dado.image.original),
    )
    .map(
      (dado) =>
        new Series(
          dado.id,
          dado.name,
          dado.type,
          dado.genres,
          null,
          null,
          null,
          dado.image.medium ?? null,
          dado.image.original ?? null,
          dado.summary ?? null,
          dado.rating.average,
          dado.language ?? null,
          dado.status ?? null,
          dado.runtime ?? null,
          dado.url,
        ),
    );
}

/**
 * Consome a API do TVMaze, separa em duas seções de recomendação com carrossel
 */
export async function renderizarSeries(callbackBoasVindas = exibirBoasVindas) {
  const esteiraAlto = document.getElementById("esteira-match-alto");
  const esteiraMedio = document.getElementById("esteira-match-medio");
  const tituloAlto = document.getElementById("titulo-match-alto");

  if (!esteiraAlto || !esteiraMedio) return;

  const perfilAtivo = JSON.parse(
    localStorage.getItem("cineMatch_perfil_ativo"),
  );

  if (
    !perfilAtivo ||
    !perfilAtivo.generos ||
    perfilAtivo.generos.length === 0
  ) {
    exibirMensagemFeedback(
      esteiraAlto,
      "Nenhum perfil ativo encontrado. Por favor, crie ou selecione um perfil.",
    );
    return;
  }

  try {
    esteiraMedio.innerHTML = "";

    // Chamada Busca Catálogo Completo API (api.js)
    const series = transformarDadosApiEmSeries(await buscarCatalogo());

    // Calcula o Match Detalhado e ordena
    const seriesComMatch = series
      .map((serie) => ({
        serie,
        matchDetalhes: MatchCalculator.calcularMatchDetalhado(
          perfilAtivo.generos,
          serie.generos || [],
        ),
      }))
      .sort((a, b) => b.matchDetalhes.percentual - a.matchDetalhes.percentual);

    // Separação em duas categorias
    const maiorCompatibilidade = seriesComMatch.filter(
      (s) => s.matchDetalhes.percentual >= 50,
    );
    const menosRecomendadas = seriesComMatch.filter(
      (s) => s.matchDetalhes.percentual < 50,
    );

    esteiraAlto.innerHTML = "";
    esteiraMedio.innerHTML = "";

    // Renderiza Seção 1
    if (maiorCompatibilidade.length === 0) {
      exibirMensagemFeedback(
        esteiraAlto,
        "Nenhuma série com alta compatibilidade para os gêneros escolhidos.",
      );
    } else {
      maiorCompatibilidade.forEach(({ serie, matchDetalhes }) => {
        esteiraAlto.appendChild(criarCardSerie(serie, matchDetalhes));
      });
    }

    // Renderiza Seção 2
    menosRecomendadas.forEach(({ serie, matchDetalhes }) => {
      esteiraMedio.appendChild(criarCardSerie(serie, matchDetalhes));
    });

    // Liga a inteligência de teclado nas esteiras
    aplicarNavegacaoTecladoAcessivel(esteiraAlto);
    aplicarNavegacaoTecladoAcessivel(esteiraMedio);
    configurarControlesCarrossel();
    configurarModalBuscaAvancada();

    // EXECUÇÃO DO CALLBACK + CLOSURE (RF10 E RF11)
    if (callbackBoasVindas && typeof callbackBoasVindas === "function") {
      const totalBuscas = contadorSessao();
      callbackBoasVindas(perfilAtivo.nome, totalBuscas);
    }
  } catch (erro) {
    console.error("Erro ao carregar séries:", erro);
    exibirMensagemFeedback(
      esteiraAlto,
      "Erro ao carregar os dados da API TVMaze. Tente novamente mais tarde.",
      true,
    );
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

export function configurarModalBuscaAvancada() {
  const modal = document.getElementById("modal-busca-avancada");
  const btnAbrir = document.getElementById("btn-abrir-busca-avancada");
  const btnFechar = document.getElementById("btn-fechar-busca-avancada");
  const inputBusca = document.getElementById("input-busca-avancada");
  const containerResultados = document.getElementById(
    "resultados-busca-avancada",
  );

  if (
    !modal ||
    !btnAbrir ||
    !btnFechar ||
    !inputBusca ||
    !containerResultados
  ) {
    return;
  }

  let series = [];

  const renderizarBusca = (filtro = "") => {
    containerResultados.innerHTML = "";

    const termo = filtro.trim().toLowerCase();

    const filtradas = series.filter((serie) =>
      serie.titulo.toLowerCase().includes(termo),
    );

    if (filtradas.length === 0) {
      containerResultados.innerHTML =
        '<p class="mensagem-sem-resultado">Nenhuma série encontrada.</p>';
      return;
    }

    filtradas.forEach((serie) => {
      containerResultados.appendChild(criarCardSerie(serie));
    });
    // Liga a inteligência de teclado nos resultados da busca
    aplicarNavegacaoTecladoAcessivel(containerResultados, true);
  };

  btnAbrir.onclick = async () => {
    modal.classList.remove("escondido");
    inputBusca.value = "";

    try {
      const dadosApi = await buscarCatalogo();

      series = transformarDadosApiEmSeries(dadosApi);

      renderizarBusca();
      inputBusca.focus();
    } catch (erro) {
      console.error("Erro ao carregar catálogo para busca avançada:", erro);

      containerResultados.innerHTML =
        '<p class="mensagem-sem-resultado">Não foi possível carregar o catálogo.</p>';
    }
  };

  btnFechar.onclick = () => {
    modal.classList.add("escondido");
    renderizarSeries();
  };

  // Permite fechar o modal com a tecla ESC a qualquer momento
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("escondido")) {
      btnFechar.click();
    }
  });

  inputBusca.oninput = (evento) => {
    renderizarBusca(evento.target.value);
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

      // 1. Criar o botão principal de seleção (Semântico e acessível por teclado)
      const btnInfo = document.createElement("button");
      btnInfo.type = "button";
      btnInfo.className = "info-perfil notranslate";

      // Criar o texto em negrito (Nome)
      const strong = document.createElement("strong");
      strong.textContent = perfil.nome;

      // Criar o texto menor (Idade e Gêneros)
      const small = document.createElement("small");
      small.textContent = ` ${perfil.idade} anos • ${perfil.generos.length} gêneros favoritos`;

      // Injetar os textos no botão de forma segura (Sem innerHTML)
      btnInfo.appendChild(strong);
      btnInfo.appendChild(small);

      // Ação de clique (Como é um <button>, o Enter/Espaço já ativam isto nativamente)
      btnInfo.onclick = () => preencherFormulario(perfil);

      // 2. Criar o botão de deletar
      const btnDeletar = document.createElement("button");
      btnDeletar.type = "button";
      btnDeletar.className = "btn-deletar-perfil";
      btnDeletar.title = "Excluir perfil";

      // Criar o ícone do Bootstrap (Sem innerHTML)
      const iconeDeletar = document.createElement("i");
      iconeDeletar.className = "bi bi-x-lg";
      btnDeletar.appendChild(iconeDeletar);

      btnDeletar.onclick = (e) => {
        e.stopPropagation();
        if (
          confirm(`Tem certeza que deseja excluir o perfil de ${perfil.nome}?`)
        ) {
          deletarPerfil(perfil.id);
        }
      };

      // 3. Montar a estrutura final
      divItem.appendChild(btnInfo);
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
      renderizarSeries();

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
    const series = transformarDadosApiEmSeries(await buscarCatalogo());

    const top20 = series
      .sort((a, b) => (b.avaliacaoNota || 0) - (a.avaliacaoNota || 0))
      .slice(0, 20);

    trilho.innerHTML = ""; // Limpa a área por segurança

    // Função construtora 100% baseada no DOM (sem innerHTML)
    const preencherTrilho = () => {
      top20.forEach((serie) => {
        const imagem =
          serie.imagemMedia ||
          serie.imagemOriginal ||
          "https://via.placeholder.com/200x295?text=Sem+Capa";

        const divCard = document.createElement("div");
        divCard.className = "card-banner";

        const img = document.createElement("img");
        img.src = imagem;
        img.alt = serie.titulo;
        img.loading = "lazy";

        divCard.appendChild(img);
        trilho.appendChild(divCard);
      });
    };

    // Injeta as 20 séries originais + 20 duplicadas (Para a animação CSS não falhar)
    preencherTrilho();
    preencherTrilho();
  } catch (erro) {
    console.error("Erro ao carregar o banner inicial:", erro);
  }
}

/**
 * Aplica o padrão Roving Tabindex para acessibilidade de teclado em carrosséis e grelhas
 */
function aplicarNavegacaoTecladoAcessivel(container, ehGrid = false) {
  if (!container) return;

  const links = container.querySelectorAll(".btn-detalhes");
  if (links.length === 0) return;

  links.forEach((link, index) => {
    link.tabIndex = index === 0 ? 0 : -1;

    link.addEventListener("focus", () => {
      link.closest(".card-serie").classList.add("card-focado");
    });

    link.addEventListener("blur", () => {
      link.closest(".card-serie").classList.remove("card-focado");
    });

    link.addEventListener("keydown", (e) => {
      let novoIndex = -1;

      // Calcula dinamicamente quantas colunas o grid tem no momento (responsividade)
      let colunas = 1;
      if (ehGrid && links.length > 1) {
        const cards = Array.from(container.querySelectorAll(".card-serie"));
        colunas =
          cards.filter((c) => c.offsetTop === cards[0].offsetTop).length || 1;
      }

      if (e.key === "ArrowRight") {
        novoIndex = index + 1 < links.length ? index + 1 : index;
        e.preventDefault();
      } else if (e.key === "ArrowLeft") {
        novoIndex = index - 1 >= 0 ? index - 1 : index;
        e.preventDefault();
      } else if (ehGrid && e.key === "ArrowDown") {
        novoIndex = index + colunas < links.length ? index + colunas : index;
        e.preventDefault();
      } else if (ehGrid && e.key === "ArrowUp") {
        novoIndex = index - colunas >= 0 ? index - colunas : index;
        e.preventDefault();
      } else if (e.key === "Tab" && !e.shiftKey) {
        // No modal (Grid), o Tab "pula" os cards e vai direto para o botão fechar (X)
        if (ehGrid) {
          e.preventDefault();
          const btnFechar = document.getElementById(
            "btn-fechar-busca-avancada",
          );
          if (btnFechar) btnFechar.focus();
        }
        // Nos carrosséis, o Tab nativo já salta para a esteira de baixo graças ao tabIndex = -1 !
      }

      if (novoIndex !== -1 && novoIndex !== index) {
        links[index].tabIndex = -1;
        links[novoIndex].tabIndex = 0;
        links[novoIndex].focus();

        links[novoIndex].closest(".card-serie").scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    });
  });
}
