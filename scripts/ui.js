import { MatchCalculator } from './modelo.js';

const GENEROS_ESTATICOS = [
    { label: 'Ação', value: 'Action' },
    { label: 'Aventura', value: 'Adventure' },
    { label: 'Anime', value: 'Anime' },
    { label: 'Comédia', value: 'Comedy' },
    { label: 'Crime', value: 'Criminal' },
    { label: 'Drama', value: 'Drama' },
    { label: 'Espionagem', value: 'Espionage' },
    { label: 'Família', value: 'Family' },
    { label: 'Histórico', value: 'History' },
    { label: 'Terror', value: 'Horror' },
    { label: 'Medico', value: 'Medical' },
    { label: 'Musica', value: 'Music' },
    { label: 'Misterio', value: 'Mystery' },
    { label: 'Romance', value: 'Romance' },
    { label: 'Ficção Científica', value: 'Science-Fiction' },
    { label: 'Esportes', value: 'Sports' },
    { label: 'Sobrenatural', value: 'Supernatural' },
    { label: 'Thriller', value: 'Thriller' },
    { label: 'Guerra', value: 'War' },
    { label: 'Faroeste', value: 'Western' }
];

const generosSelecionados = new Set();
let filtroIdiomaAtivo = false;
let localizacaoAtiva = false;
const elementosErro = [];

/**
 * Renderiza os botões estáticos de gêneros
 */
export function renderizarGenerosEstaticos() {
    const container = document.getElementById('container-generos');
    if (!container) return;

    container.innerHTML = '';

    GENEROS_ESTATICOS.forEach(genero => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.classList.add('btn-genero');
        btn.dataset.value = genero.value;
        btn.textContent = genero.label;

        btn.addEventListener('click', () => {
            if (generosSelecionados.has(genero.value)) {
                generosSelecionados.delete(genero.value);
                btn.classList.remove('selecionado');
            } else {
                generosSelecionados.add(genero.value);
                btn.classList.add('selecionado');
            }

            const inputHidden = document.getElementById('generos-selecionados');
            if (inputHidden) {
                inputHidden.value = Array.from(generosSelecionados).join(',');
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
    const btnTheme = document.getElementById('btn-theme-toggle');
    const savedTheme = localStorage.getItem('cinematch-theme') || 'dark';

    aplicarTema(savedTheme);

    if (btnTheme) {
        btnTheme.addEventListener('click', () => {
            const currentTheme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            aplicarTema(newTheme);
        });
    }
}

function aplicarTema(theme) {
    const html = document.documentElement;
    const icone = document.getElementById('icone-tema');
    const texto = document.getElementById('texto-tema');

    if (theme === 'light') {
        html.classList.remove('dark');
        html.classList.add('light');
        if (icone) icone.className = 'bi bi-sun-fill';
        if (texto) texto.textContent = 'Tema Claro';
    } else {
        html.classList.remove('light');
        html.classList.add('dark');
        if (icone) icone.className = 'bi bi-moon-stars-fill';
        if (texto) texto.textContent = 'Tema Escuro';
    }
    localStorage.setItem('cinematch-theme', theme);
}

/**
 * Controle do Menu Hambúrguer
 */
export function inicializarMenuHamburguer() {
    const btnHamburguer = document.getElementById('btn-hamburguer');
    const menuNavegacao = document.getElementById('menu-navegacao');

    if (btnHamburguer && menuNavegacao) {
        btnHamburguer.addEventListener('click', () => {
            menuNavegacao.classList.toggle('aberto');
        });
    }
}

/**
 * Botão On/Off de Localização no Menu
 */
export function inicializarGeolocalizacao() {
    const btnGeo = document.getElementById('btn-geolocalizacao');
    const textoBtnGeo = document.getElementById('texto-btn-geo');
    const indicadorCidade = document.getElementById('indicador-cidade');
    const textoCidade = document.getElementById('texto-cidade');

    if (!btnGeo) return;

    btnGeo.addEventListener('click', () => {
        if (localizacaoAtiva) {
            localizacaoAtiva = false;
            filtroIdiomaAtivo = false;

            if (indicadorCidade) indicadorCidade.classList.add('escondido');
            if (textoBtnGeo) textoBtnGeo.textContent = 'Ativar Localização';
            return;
        }

        if (!navigator.geolocation) {
            alert('Geolocalização não é suportada pelo seu navegador.');
            return;
        }

        if (textoCidade) textoCidade.textContent = 'Detectando...';
        if (indicadorCidade) indicadorCidade.classList.remove('escondido');

        navigator.geolocation.getCurrentPosition(
            async (posicao) => {
                const lat = posicao.coords.latitude;
                const lon = posicao.coords.longitude;

                try {
                    const resposta = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                    const dados = await resposta.json();

                    const cidade = dados.address.city || dados.address.town || dados.address.village || 'Sua Região';
                    const estado = dados.address.state ? `, ${dados.address.state}` : '';

                    if (textoCidade) textoCidade.textContent = `${cidade}${estado}`;
                    localizacaoAtiva = true;
                    filtroIdiomaAtivo = true;

                    if (textoBtnGeo) textoBtnGeo.textContent = 'Desativar Localização';
                } catch (erro) {
                    if (textoCidade) textoCidade.textContent = 'Localização Ativa';
                    localizacaoAtiva = true;
                    filtroIdiomaAtivo = true;

                    if (textoBtnGeo) textoBtnGeo.textContent = 'Desativar Localização';
                }
            },
            () => {
                alert('Não foi possível obter a sua localização.');
                if (indicadorCidade) indicadorCidade.classList.add('escondido');
                localizacaoAtiva = false;
                filtroIdiomaAtivo = false;

                if (textoBtnGeo) textoBtnGeo.textContent = 'Ativar Localização';
            }
        );
    });
}

/**
 * Renderizar e Exibir as Mensagens de Erro
 */
export function renderizarMensagemErro(elemento, id) {
    switch (id) {
        case 'nome':
            if (document.getElementById(`${id}-erro`)) {
                elemento.focus();
                break;
            }
            const errorPerfilNome = document.createElement("span");
            errorPerfilNome.id = `${id}-erro`;
            errorPerfilNome.classList.add("msg-erro");
            elemento.classList.add("perfil-erro");

            errorPerfilNome.textContent = 'Nome não pode conter caracter especial, número, vários espaços e menos de 3 letras!';

            elemento.after(errorPerfilNome);
            elemento.focus();
            break;

        case 'idade':
            if (document.getElementById(`${id}-erro`)) {
                elemento.focus();
                break;
            }
            const errorPerfilIdade = document.createElement("span");
            errorPerfilIdade.id = `${id}-erro`;
            errorPerfilIdade.classList.add("msg-erro");
            elemento.classList.add("perfil-erro");

            errorPerfilIdade.textContent = 'Idade não pode ser menor que UM(1)!';

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
    elementosErro.forEach(elemento => {
        elemento.classList.remove('perfil-erro');
        const mensagemErro = document.getElementById(`${elemento.id}-erro`);

        if (mensagemErro) {
            mensagemErro.remove();
        }
    });
}

/**
 * Função de validação dos campos do formulário
 */
export function validarDadosFormPerfil() {
    const nomeUsuario = document.querySelector("#nome");
    const idadeUsuario = document.querySelector("#idade");
    
    if (elementosErro.length > 0) {
        limparMensagensErro(elementosErro);
        elementosErro.length = 0;
    }

    const regexNome = /^(?=.*[A-Za-zÀ-ÿ])[A-Za-zÀ-ÿ\s]+$/;

    if (!regexNome.test(nomeUsuario.value.trim()) || nomeUsuario.value.trim().length < 3) {
        elementosErro.push(nomeUsuario);
        renderizarMensagemErro(nomeUsuario, nomeUsuario.id);
    }

    if (!idadeUsuario.value || Number(idadeUsuario.value) < 1) {
        elementosErro.push(idadeUsuario);
        renderizarMensagemErro(idadeUsuario, idadeUsuario.id);
    }

    if (elementosErro.length > 0 || generosSelecionados.size === 0) {
        elementosErro.length > 0 ? elementosErro[0].focus() : alert('Por favor, selecione pelo menos um gênero favorito.');
        return false;
    }

    return true;
}

/**
 * Consome a API do TVMaze, aplica os filtros de gênero e localização e renderiza os cards
 */
export async function carregarERenderizarSeries() {
    const containerResultados = document.getElementById('resultados');
    if (!containerResultados) return;

    const perfilAtivo = JSON.parse(localStorage.getItem('cineMatch_perfil_ativo'));

    if (!perfilAtivo || !perfilAtivo.generos || perfilAtivo.generos.length === 0) {
        containerResultados.innerHTML = '<p class="mensagem-feedback">Nenhum perfil ativo encontrado. Por favor, crie ou selecione um perfil.</p>';
        return;
    }

    try {
        containerResultados.innerHTML = '<p class="mensagem-feedback"><i class="bi bi-arrow-repeat spin"></i> Buscando recomendações no catálogo...</p>';

        const resposta = await fetch('https://api.tvmaze.com/shows');
        if (!resposta.ok) throw new Error('Falha ao conectar à API de séries.');
        
        let series = await resposta.json();

        // Filtro de séries em idioma/disponibilidade local se a geolocalização estiver ativa
        if (perfilAtivo.apenasTraduzidas) {
            series = series.filter(serie => {
                const idioma = serie.language ? serie.language.toLowerCase() : '';
                const pais = serie.network?.country?.code?.toLowerCase() || serie.webChannel?.country?.code?.toLowerCase() || '';
                return idioma === 'portuguese' || pais === 'br' || pais === 'pt';
            });

            if (series.length === 0) {
                series = await (await fetch('https://api.tvmaze.com/shows')).json();
            }
        }

        // Calcula o % de Match e ordena de forma decrescente
        const seriesComMatch = series.map(serie => {
            const percentualMatch = MatchCalculator.calcularMatch(perfilAtivo.generos, serie.genres || []);
            return { ...serie, match: percentualMatch };
        }).sort((a, b) => b.match - a.match);

        containerResultados.innerHTML = '';

        if (seriesComMatch.length === 0) {
            containerResultados.innerHTML = '<p class="mensagem-feedback">Nenhuma série encontrada para os gêneros selecionados.</p>';
            return;
        }

        // Renderiza cada card de série no container
        seriesComMatch.forEach(serie => {
            const card = document.createElement('article');
            card.className = 'card-serie';

            const imagemPoster = serie.image?.medium || serie.image?.original || 'https://via.placeholder.com/210x295?text=Sem+Capa';
            const nota = serie.rating?.average ? `${serie.rating.average} / 10` : 'N/A';
            const sinopseSemHtml = serie.summary ? serie.summary.replace(/<[^>]*>?/gm, '').slice(0, 120) + '...' : 'Sinopse indisponível.';

            card.innerHTML = `
                <div class="badge-match ${serie.match >= 70 ? 'match-alto' : 'match-medio'}">
                    ${serie.match}% Match
                </div>
                <img src="${imagemPoster}" alt="Poster de ${serie.name}" loading="lazy" class="img-poster">
                <div class="conteudo-card">
                    <h3>${serie.name}</h3>
                    <p class="generos-card">${(serie.genres || []).join(' • ')}</p>
                    <p class="sinopse-card">${sinopseSemHtml}</p>
                    <div class="rodape-card">
                        <span class="nota-card"><i class="bi bi-star-fill"></i> ${nota}</span>
                        <a href="${serie.url}" target="_blank" rel="noopener noreferrer" class="btn-detalhes">
                            Ver Mais <i class="bi bi-box-arrow-up-right"></i>
                        </a>
                    </div>
                </div>
            `;

            containerResultados.appendChild(card);
        });

    } catch (erro) {
        console.error('Erro ao carregar séries:', erro);
        containerResultados.innerHTML = '<p class="mensagem-feedback" style="color: #e63946;">Erro ao carregar os dados da API TVMaze. Tente novamente mais tarde.</p>';
    }
}

/**
 * Alternância de Telas e Submissão
 */
export function configurarFormularioPerfil() {
    const form = document.getElementById('form-perfil');
    const secaoPerfil = document.getElementById('secao-perfil');
    const secaoResultados = document.getElementById('secao-resultados');
    const secaoSelecaoPerfil = document.getElementById('secao-selecao-perfil');
    const listaPerfis = document.getElementById('lista-perfis');
    const secaoInicial = document.getElementById('secao-inicial'); 
    
    const btnTrocarPerfil = document.getElementById('btn-trocar-perfil');
    const btnCriarPerfil = document.getElementById('btn-criar-perfil');
    const btnSalvarPerfil = document.getElementById('btn-salvar-perfil');
    const inputNome = document.getElementById('nome');
    const inputIdade = document.getElementById('idade');
    
    if (inputNome) inputNome.addEventListener('input', validarFormulario);
    if (inputIdade) inputIdade.addEventListener('input', validarFormulario);
    
    const btnHeroCriar = document.getElementById('btn-hero-criar'); 
    const btnPaginaInicial = document.getElementById('btn-pagina-inicial'); 
    
    let perfilEditandoId = null;

    function obterPerfisSalvos() {
        return JSON.parse(localStorage.getItem('cineMatch_perfis')) || [];
    }

    function salvarPerfis(perfis) {
        localStorage.setItem('cineMatch_perfis', JSON.stringify(perfis));
    }

    function abrirPaginaInicial() {
        if (secaoSelecaoPerfil) secaoSelecaoPerfil.classList.add('escondido');
        if (secaoResultados) secaoResultados.classList.add('escondido');
        if (secaoPerfil) secaoPerfil.classList.add('escondido');
        if (secaoInicial) secaoInicial.classList.remove('escondido');
    }

    function abrirFormularioVazio() {
        if (secaoSelecaoPerfil) secaoSelecaoPerfil.classList.add('escondido');
        if (secaoResultados) secaoResultados.classList.add('escondido');
        if (secaoInicial) secaoInicial.classList.add('escondido');
        if (secaoPerfil) secaoPerfil.classList.remove('escondido');
        
        perfilEditandoId = null;
        if (form) form.reset();
        
        generosSelecionados.clear();
        document.querySelectorAll('.btn-genero').forEach(btn => btn.classList.remove('selecionado'));
        const inputHidden = document.getElementById('generos-selecionados');
        if (inputHidden) inputHidden.value = '';

        validarFormulario();
    }

    function preencherFormulario(perfil) {
        if (secaoSelecaoPerfil) secaoSelecaoPerfil.classList.add('escondido');
        if (secaoResultados) secaoResultados.classList.add('escondido');
        if (secaoInicial) secaoInicial.classList.add('escondido');
        if (secaoPerfil) secaoPerfil.classList.remove('escondido');
        
        perfilEditandoId = perfil.id;
        document.getElementById('nome').value = perfil.nome;
        document.getElementById('idade').value = perfil.idade;
        
        generosSelecionados.clear();
        perfil.generos.forEach(g => generosSelecionados.add(g));
        
        document.querySelectorAll('.btn-genero').forEach(btn => {
            if (generosSelecionados.has(btn.dataset.value)) {
                btn.classList.add('selecionado');
            } else {
                btn.classList.remove('selecionado');
            }
        });
        
        const inputHidden = document.getElementById('generos-selecionados');
        if (inputHidden) inputHidden.value = Array.from(generosSelecionados).join(',');

        validarFormulario();
    }

    function deletarPerfil(idParaDeletar) {
        let perfis = obterPerfisSalvos();
        perfis = perfis.filter(p => p.id !== idParaDeletar);
        salvarPerfis(perfis);
        abrirSelecaoDePerfis();
    }

    function abrirSelecaoDePerfis() {
        const perfis = obterPerfisSalvos();
        
        if (perfis.length === 0) {
            abrirPaginaInicial();
            return;
        }

        if (secaoPerfil) secaoPerfil.classList.add('escondido');
        if (secaoResultados) secaoResultados.classList.add('escondido');
        if (secaoInicial) secaoInicial.classList.add('escondido');
        if (secaoSelecaoPerfil) secaoSelecaoPerfil.classList.remove('escondido');
        
        listaPerfis.innerHTML = '';
        
        perfis.forEach(perfil => {
            const divItem = document.createElement('div');
            divItem.className = 'item-perfil';
            
            const divInfo = document.createElement('div');
            divInfo.className = 'info-perfil';
            divInfo.innerHTML = `<strong>${perfil.nome}</strong> <small>${perfil.idade} anos • ${perfil.generos.length} gêneros favoritados</small>`;
            divInfo.onclick = () => preencherFormulario(perfil);

            const btnDeletar = document.createElement('button');
            btnDeletar.className = 'btn-deletar-perfil';
            btnDeletar.innerHTML = '<i class="bi bi-x-lg"></i>';
            btnDeletar.title = "Excluir perfil";
            btnDeletar.onclick = (e) => {
                e.stopPropagation();
                if(confirm(`Tem certeza que deseja excluir o perfil de ${perfil.nome}?`)) {
                    deletarPerfil(perfil.id);
                }
            };

            divItem.appendChild(divInfo);
            divItem.appendChild(btnDeletar);
            listaPerfis.appendChild(divItem);
        });
    }

    if (btnPaginaInicial) {
        btnPaginaInicial.addEventListener('click', (e) => {
            e.preventDefault();
            const menuNavegacao = document.getElementById('menu-navegacao');
            if (menuNavegacao && menuNavegacao.classList.contains('aberto')) {
                menuNavegacao.classList.remove('aberto');
            }
            abrirPaginaInicial();
        });
    }

    if (btnHeroCriar) {
        btnHeroCriar.addEventListener('click', (e) => {
            e.preventDefault();
            abrirFormularioVazio();
        });
    }

    if (btnTrocarPerfil) {
        btnTrocarPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            const menuNavegacao = document.getElementById('menu-navegacao');
            if (menuNavegacao && menuNavegacao.classList.contains('aberto')) {
                menuNavegacao.classList.remove('aberto');
            }
            abrirSelecaoDePerfis();
        });
    }

    if (btnCriarPerfil) {
        btnCriarPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            const menuNavegacao = document.getElementById('menu-navegacao');
            if (menuNavegacao && menuNavegacao.classList.contains('aberto')) {
                menuNavegacao.classList.remove('aberto');
            }
            abrirFormularioVazio();
        });
    }

    if (btnSalvarPerfil) {
        btnSalvarPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value.trim();
            const idade = document.getElementById('idade').value;

            if (!validarDadosFormPerfil()) {
                return;
            }

            const perfilSalvo = {
                id: perfilEditandoId || Date.now().toString(),
                nome,
                idade: Number(idade),
                generos: Array.from(generosSelecionados),
                apenasTraduzidas: typeof filtroIdiomaAtivo !== 'undefined' ? filtroIdiomaAtivo : false
            };

            let perfis = obterPerfisSalvos();
            
            if (perfilEditandoId) {
                const index = perfis.findIndex(p => p.id === perfilEditandoId);
                if (index !== -1) perfis[index] = perfilSalvo;
            } else {
                perfis.push(perfilSalvo);
                perfilEditandoId = perfilSalvo.id;
            }
            
            salvarPerfis(perfis);
            localStorage.setItem('cineMatch_perfil_ativo', JSON.stringify(perfilSalvo));
            
            alert(`O perfil de ${nome} foi salvo com sucesso!`);
        });
    }
    
    // --- SUBMISSÃO DO FORMULÁRIO (EVENTO SUBMIT) ---
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const nome = document.getElementById('nome').value.trim();
            const idade = document.getElementById('idade').value;

            if (!validarDadosFormPerfil()) {
                return;
            }

            const perfilSalvo = {
                id: perfilEditandoId || Date.now().toString(),
                nome,
                idade: Number(idade),
                generos: Array.from(generosSelecionados),
                apenasTraduzidas: typeof filtroIdiomaAtivo !== 'undefined' ? filtroIdiomaAtivo : false
            };

            let perfis = obterPerfisSalvos();
            
            if (perfilEditandoId) {
                const index = perfis.findIndex(p => p.id === perfilEditandoId);
                if (index !== -1) perfis[index] = perfilSalvo;
            } else {
                perfis.push(perfilSalvo);
            }
            
            salvarPerfis(perfis);
            localStorage.setItem('cineMatch_perfil_ativo', JSON.stringify(perfilSalvo));

            // Transita para a seção de resultados
            if (secaoPerfil) secaoPerfil.classList.add('escondido');
            if (secaoResultados) secaoResultados.classList.remove('escondido');
            
            // Executa o consumo da API e a geração dos cards
            carregarERenderizarSeries();
            
            console.log('Perfil Atualizado/Criado:', perfilSalvo);
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
    const form = document.getElementById('form-perfil');
    const nome = document.getElementById('nome');
    const idade = document.getElementById('idade');
    const btnSalvar = document.getElementById('btn-salvar-perfil');
    const btnSubmit = document.getElementById('btn-submit');
    
    if (!nome || !idade || !btnSalvar || !btnSubmit || !form) return;
    
    const formValido = nome.value.trim() !== '' && idade.value.trim() !== '' && generosSelecionados.size > 0;
    
    btnSalvar.disabled = !formValido;
    btnSubmit.disabled = !formValido;

    if (formValido) {
        form.classList.add('form-completo');
    } else {
        form.classList.remove('form-completo');
    }
}