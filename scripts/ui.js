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
// Array para elementos com erro validação
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
            // Evita criar a mesma mensagem novamente
            if (document.getElementById(`${id}-erro`)) {
                elemento.focus();
                break;
            }
            const errorPerfilNome = document.createElement("span");
            errorPerfilNome.id = `${id}-erro`;
            errorPerfilNome.classList.add("msg-erro");
            elemento.classList.add("perfil-erro");

            errorPerfilNome.textContent =
                'Nome não pode conter caracter especial, número, vários espaços e menos de 3 letras!';

            elemento.after(errorPerfilNome);
            elemento.focus();
            break;

        case 'idade':
            // Evita criar a mesma mensagem novamente
            if (document.getElementById(`${id}-erro`)) {
                elemento.focus();
                break;
            }
            const errorPerfilIdade = document.createElement("span");
            errorPerfilIdade.id = `${id}-erro`;
            errorPerfilIdade.classList.add("msg-erro");
            elemento.classList.add("perfil-erro");

            errorPerfilIdade.textContent =
                'Idade não pode ser menor que UM(1)!';

            elemento.after(errorPerfilIdade);
            elemento.focus();
            break;

        default:
            console.log(
                `Nada a fazer function renderizarMensagemErro!`
            );
    }
}

/** 
 * Remove as Mensagens e Classes dos Campos com Erro
 */
export function limparMensagensErro(elementosErro) {

    elementosErro.forEach(elemento => {
        elemento.classList.remove('perfil-erro');
        const mensagemErro = document.getElementById(
            `${elemento.id}-erro`
        );

        if (mensagemErro) {
            mensagemErro.remove();
        }
    });
}

/**
 * Função de chamada validações dados campos formulário perfil
 */
export function validarDadosFormPerfil() {
    const nomeUsuario = document.querySelector("#nome");
    const idadeUsuario = document.querySelector("#idade");
    
    // Limpa Erros de Tentativa de Salvar Perfil que Falhou
    //console.log(`Array de erros... ${elementosErro.map(elemento => {return elemento.value})}`);
    if (elementosErro.length > 0) {
        limparMensagensErro(elementosErro);
        elementosErro.length = 0; // Esvazia e Mantém o mesmo Array da const
    }
    // RegExp para validar o nome
    const regexNome = /^(?=.*[A-Za-zÀ-ÿ])[A-Za-zÀ-ÿ\s]+$/;
    // VALIDAÇÃO DO NOME
    //console.log(regexNome.test(nomeUsuario.value.trim()));
    if (
        !regexNome.test(nomeUsuario.value.trim()) ||
        nomeUsuario.value.trim().length < 3
    ) {
        elementosErro.push(nomeUsuario);
        //console.log(`Array de erros... ${elementosErro.map(elemento => {return elemento.value})}`);
        renderizarMensagemErro(
            nomeUsuario,
            nomeUsuario.id
        );
    }

    // VALIDAÇÃO DA IDADE
    if (
        !idadeUsuario.value ||
        Number(idadeUsuario.value) < 1
    ) {
        elementosErro.push(idadeUsuario);
        renderizarMensagemErro(
            idadeUsuario,
            idadeUsuario.id
        );
    }
    //console.log(`Array de erros... ${elementosErro.map(elemento => {return elemento.value})}`);    

    // -------------------------
    // RESULTADO
    // -------------------------

    if (
        elementosErro.length > 0 ||
        generosSelecionados.size === 0
    ) {
        elementosErro.length > 0 ? 
            elementosErro[0].focus() 
            : 
            alert('Por favor, selecione pelo menos um gênero favorito.');
        return false;
    }

    return true;
};

/**
 * Alternância de Telas (Formulário x Seleção de Perfil x Resultados x Página Inicial) e Submissão
 */
export function configurarFormularioPerfil() {
    const form = document.getElementById('form-perfil');
    const secaoPerfil = document.getElementById('secao-perfil');
    const secaoResultados = document.getElementById('secao-resultados');
    const secaoSelecaoPerfil = document.getElementById('secao-selecao-perfil');
    const listaPerfis = document.getElementById('lista-perfis');
    
    // NOVO: Captura da Seção Inicial
    const secaoInicial = document.getElementById('secao-inicial'); 
    
    const btnTrocarPerfil = document.getElementById('btn-trocar-perfil');
    const btnCriarPerfil = document.getElementById('btn-criar-perfil');

    // CAPTURA PARA VALIDAÇÃO DO FORMULÁRIO
    const btnSalvarPerfil = document.getElementById('btn-salvar-perfil');
    const inputNome = document.getElementById('nome');
    const inputIdade = document.getElementById('idade');
    
    // Adiciona o "olheiro" para cada vez que o utilizador digitar algo
    if (inputNome) inputNome.addEventListener('input', validarFormulario);
    if (inputIdade) inputIdade.addEventListener('input', validarFormulario);
    
    // NOVO: Captura dos novos botões
    const btnHeroCriar = document.getElementById('btn-hero-criar'); 
    const btnPaginaInicial = document.getElementById('btn-pagina-inicial'); 
    
    // Variável para saber se estamos a editar um perfil existente ou a criar um novo
    let perfilEditandoId = null;

    function obterPerfisSalvos() {
        return JSON.parse(localStorage.getItem('cineMatch_perfis')) || [];
    }

    function salvarPerfis(perfis) {
        localStorage.setItem('cineMatch_perfis', JSON.stringify(perfis));
    }

    // NOVO: Função para exibir apenas a Página Inicial (Hero)
    function abrirPaginaInicial() {
        if (secaoSelecaoPerfil) secaoSelecaoPerfil.classList.add('escondido');
        if (secaoResultados) secaoResultados.classList.add('escondido');
        if (secaoPerfil) secaoPerfil.classList.add('escondido');
        if (secaoInicial) secaoInicial.classList.remove('escondido');
    }

    // ATUALIZADO: Comportamento do botão "Criar Perfil" (Formulário Vazio)
    function abrirFormularioVazio() {
        if (secaoSelecaoPerfil) secaoSelecaoPerfil.classList.add('escondido');
        if (secaoResultados) secaoResultados.classList.add('escondido');
        if (secaoInicial) secaoInicial.classList.add('escondido'); // Esconde a Home
        if (secaoPerfil) secaoPerfil.classList.remove('escondido');
        
        perfilEditandoId = null; // Zera o ID
        if (form) form.reset();
        
        // Limpa os gêneros selecionados no JS e na tela
        generosSelecionados.clear();
        document.querySelectorAll('.btn-genero').forEach(btn => btn.classList.remove('selecionado'));
        const inputHidden = document.getElementById('generos-selecionados');
        if (inputHidden) inputHidden.value = '';

        validarFormulario();
    }

    // ATUALIZADO: Comportamento ao clicar num perfil existente na lista (Preencher o Form)
    function preencherFormulario(perfil) {
        if (secaoSelecaoPerfil) secaoSelecaoPerfil.classList.add('escondido');
        if (secaoResultados) secaoResultados.classList.add('escondido');
        if (secaoInicial) secaoInicial.classList.add('escondido'); // Esconde a Home
        if (secaoPerfil) secaoPerfil.classList.remove('escondido');
        
        perfilEditandoId = perfil.id; // Guarda o ID para atualizar e não duplicar
        document.getElementById('nome').value = perfil.nome;
        document.getElementById('idade').value = perfil.idade;
        
        // Sincroniza os gêneros guardados com os botões da interface
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

    // Comportamento do botão de Deletar (Lixeira)
    function deletarPerfil(idParaDeletar) {
        let perfis = obterPerfisSalvos();
        perfis = perfis.filter(p => p.id !== idParaDeletar);
        salvarPerfis(perfis);
        abrirSelecaoDePerfis(); // Recarrega a lista
    }

    // ATUALIZADO: Comportamento do botão "Trocar Perfil"
    function abrirSelecaoDePerfis() {
        const perfis = obterPerfisSalvos();
        
        // Se a lista estiver vazia, vai para a Página Inicial
        if (perfis.length === 0) {
            abrirPaginaInicial();
            return;
        }

        if (secaoPerfil) secaoPerfil.classList.add('escondido');
        if (secaoResultados) secaoResultados.classList.add('escondido');
        if (secaoInicial) secaoInicial.classList.add('escondido'); // Esconde a Home
        if (secaoSelecaoPerfil) secaoSelecaoPerfil.classList.remove('escondido');
        
        listaPerfis.innerHTML = ''; // Limpa antes de injetar
        
        perfis.forEach(perfil => {
            const divItem = document.createElement('div');
            divItem.className = 'item-perfil';
            
            const divInfo = document.createElement('div');
            divInfo.className = 'info-perfil';
            divInfo.innerHTML = `<strong>${perfil.nome}</strong> <small>${perfil.idade} anos • ${perfil.generos.length} gêneros favoritados</small>`;
            // Ao clicar na linha, carrega os dados no formulário
            divInfo.onclick = () => preencherFormulario(perfil);

            const btnDeletar = document.createElement('button');
            btnDeletar.className = 'btn-deletar-perfil';
            btnDeletar.innerHTML = '<i class="bi bi-x-lg"></i>';
            btnDeletar.title = "Excluir perfil";
            btnDeletar.onclick = (e) => {
                e.stopPropagation(); // Impede o clique de ativar a divInfo
                if(confirm(`Tem certeza que deseja excluir o perfil de ${perfil.nome}?`)) {
                    deletarPerfil(perfil.id);
                }
            };

            divItem.appendChild(divInfo);
            divItem.appendChild(btnDeletar);
            listaPerfis.appendChild(divItem);
        });
    }

    // --- LIGAÇÃO COM OS BOTÕES DO MENU E DA TELA INICIAL ---
    
    // NOVO: Clique no botão da Página Inicial no menu
    if (btnPaginaInicial) {
        btnPaginaInicial.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Fecha o menu hamburguer se ele estiver aberto (para Mobile)
            const menuNavegacao = document.getElementById('menu-navegacao');
            if (menuNavegacao && menuNavegacao.classList.contains('aberto')) {
                menuNavegacao.classList.remove('aberto');
            }
            
            abrirPaginaInicial();
        });
    }

    // NOVO: Clique no botão grande "Criar Meu Perfil" do Banner
    if (btnHeroCriar) {
        btnHeroCriar.addEventListener('click', (e) => {
            e.preventDefault();
            abrirFormularioVazio();
        });
    }

    if (btnTrocarPerfil) {
        btnTrocarPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Fecha o menu hamburguer se ele estiver aberto
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
            
            // Fecha o menu hamburguer se ele estiver aberto
            const menuNavegacao = document.getElementById('menu-navegacao');
            if (menuNavegacao && menuNavegacao.classList.contains('aberto')) {
                menuNavegacao.classList.remove('aberto');
            }
            
            abrirFormularioVazio();
        });
    }

    // --- AÇÃO DO NOVO BOTÃO: SALVAR PERFIL ---
    if (btnSalvarPerfil) {
        btnSalvarPerfil.addEventListener('click', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value.trim();
            const idade = document.getElementById('idade').value;

            // INÍCIO CHAMADAS VALIDAÇÕES DADOS CAMPOS OBRIGATÓRIOS
                if (!validarDadosFormPerfil()) {
                    return;
                }
            // FIM CHAMADA VALIDAÇÕES DADOS 

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
                perfilEditandoId = perfilSalvo.id; // Atualiza o ID para não duplicar se clicar várias vezes seguidas
            }
            
            salvarPerfis(perfis);
            localStorage.setItem('cineMatch_perfil_ativo', JSON.stringify(perfilSalvo));
            
            alert(`O perfil de ${nome} foi salvo com sucesso!`);
            // Nota: Só salva, não muda de ecrã. O utilizador pode clicar no botão de "Achar Meu Match" depois.
        });
    }
    
    // --- SUBMISSÃO DO FORMULÁRIO ---
    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const nome = document.getElementById('nome').value.trim();
            const idade = document.getElementById('idade').value;

            // INÍCIO CHAMADAS VALIDAÇÕES DADOS CAMPOS OBRIGATÓRIOS
                if (!validarDadosFormPerfil()) {
                    return;
                }
            // FIM CHAMADA VALIDAÇÕES DADOS   
            const perfilSalvo = {
                id: perfilEditandoId || Date.now().toString(), // Mantém o ID antigo ou cria um novo
                nome,
                idade: Number(idade),
                generos: Array.from(generosSelecionados),
                apenasTraduzidas: typeof filtroIdiomaAtivo !== 'undefined' ? filtroIdiomaAtivo : false
            };

            let perfis = obterPerfisSalvos();
            
            // Se estiver editando, atualiza. Se for novo, adiciona à lista.
            if (perfilEditandoId) {
                const index = perfis.findIndex(p => p.id === perfilEditandoId);
                if (index !== -1) perfis[index] = perfilSalvo;
            } else {
                perfis.push(perfilSalvo);
            }
            
            salvarPerfis(perfis);
            // Guarda também quem é o "utilizador do momento" para a API
            localStorage.setItem('cineMatch_perfil_ativo', JSON.stringify(perfilSalvo));

            // Transita para os resultados
            if (secaoPerfil) secaoPerfil.classList.add('escondido');
            if (secaoResultados) secaoResultados.classList.remove('escondido');
            
            const containerResultados = document.getElementById('resultados');
            if (containerResultados) containerResultados.innerHTML = '<p class="mensagem-feedback">Buscando recomendações...</p>';
            
            console.log('Perfil Atualizado/Criado:', perfilSalvo);
        });
    }

    // --- ATUALIZADO: VERIFICAÇÃO INICIAL AO ABRIR O SITE ---
    const perfisIniciais = obterPerfisSalvos();
    if (perfisIniciais.length > 0) {
        abrirSelecaoDePerfis(); // Já tem conta, mostra o ecrã "Quem está a assistir?"
    } else {
        abrirPaginaInicial(); // Se não há perfis, mostra a nova Landing Page!
    }
}

/**
 * Verifica em tempo real se o form cumpre as regras para ativar os botões
 */
export function validarFormulario() {
    const form = document.getElementById('form-perfil'); // Captura o formulário inteiro
    const nome = document.getElementById('nome');
    const idade = document.getElementById('idade');
    const btnSalvar = document.getElementById('btn-salvar-perfil');
    const btnSubmit = document.getElementById('btn-submit');
    
    // Trava de segurança para não dar erro se a tela for outra
    if (!nome || !idade || !btnSalvar || !btnSubmit || !form) return;
    
    // A regra: Nome preenchido + Idade preenchida + Pelo menos 1 gênero
    const formValido = nome.value.trim() !== '' && idade.value.trim() !== '' && generosSelecionados.size > 0;
    
    // Libera ou bloqueia os botões de ação
    btnSalvar.disabled = !formValido;
    btnSubmit.disabled = !formValido;

    // A MÁGICA: Adiciona a classe 'form-completo' no HTML se tudo estiver preenchido
    if (formValido) {
        form.classList.add('form-completo');
    } else {
        form.classList.remove('form-completo');
    }
}