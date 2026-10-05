# 🎬 CineMatch Web: Recomendação de Séries
**🌍 Acesso ao projeto online:** [Clique aqui para abrir o CineMatch Web](https://robertosilva11.github.io/cinematch-web/
**🎬 Video de apreserntação: https://drive.google.com/file/d/1ib8zstRrRqntrnlqPdmoAd2bGJMVZu5C/view?usp=drive_link
<div align="center">
  <img src="https://github.com/RobertoSilva11/cinematch-web/raw/develop/img/Logo.png" width="300" alt="Logo do CineMatch Web">
</div>

## ℹ️ Sobre o Projeto
O **CineMatch Web** é a evolução com interface gráfica do motor de recomendação original. A aplicação resolve o problema da indecisão na hora de escolher uma série, permitindo que o usuário crie um perfil com os seus gêneros favoritos e receba recomendações instantâneas, baseadas num catálogo real de séries (TVMaze), diretamente no navegador.

## 🚀 Funcionalidades Principais (User Stories)
- **Apresentação Animada:** Splash Screen inicial com loader dinâmico.
- **Gerenciamento de Perfis:** Criação, seleção e exclusão de múltiplos perfis com persistência de dados utilizando a API de `LocalStorage`.
- **Motor de Recomendação (Match%):** Algoritmo inteligente que cruza as preferências do usuário com o catálogo. Classifica as produções detalhadamente em "Alta", "Média" ou "Baixa" afinidade, além de mapear gêneros em comum e gêneros não explorados.
- **Tradução Dinâmica Integrada:** Recurso de geolocalização que, ao ativado, adapta as sinopses em tempo real para o idioma local (Português) explorando de forma invisível a API do Google Translate.
- **Esteiras de Recomendação:** Resultados organizados em carrosséis interativos, separados entre "Maior Compatibilidade" e "Outras Recomendações".
- **Busca Avançada em Tempo Real:** Modal de pesquisa que filtra as produções do catálogo conforme o usuário digita.
- **Acessibilidade Plena (a11y):** Implementação de *Roving Tabindex* para navegação fluida via teclado (setas direcionais) pelas esteiras de filmes e modais.
- **Tema Customizável:** Alternância nativa entre *Light Mode* e *Dark Mode*, com persistência de estado.

## 💻 Tecnologias e Arquitetura
O projeto foi modernizado e estruturado com os melhores padrões de desenvolvimento front-end (Mobile-First):

*   **HTML5 Semântico:** Estrutura rica em landmarks (`<search>`, `<article>`, `<section>`, `<header>`) focada na legibilidade e indexação.
*   **CSS3 Vanilla:** Variaveis CSS para paleta de cores (Temas), Flexbox e Animações (Keyframes).
*   **JavaScript (ES6+):** 
    *   **Arquitetura ESM (ES Modules):** Código totalmente modularizado em múltiplos arquivos para clara separação de responsabilidades.
    *   **Orientação a Objetos (POO):** Utilização de Classes, Herança e métodos compartilhados.
    *   **Lógica Funcional:** Uso de Closures (para rastreio de sessão), Callbacks e alta manipulação de arrays iterativos (`map`, `filter`, `sort`).
    *   **Assincronicidade:** Integração com a *Fetch API* (TVMaze) e funções assíncronas com tratamento de rede.
*   **Acessibilidade e Usabilidade:** Elementos focáveis geridos manualmente e validações de input em tempo real.

## 🏗️ Estrutura do Projeto (Módulos)
A modularização do código dividiu a aplicação nos seguintes componentes lógicos:
- `script.js`: Ponto de entrada da aplicação (Entry Point) e fluxo inicial.
- `api.js`: Camada exclusiva para consumo assíncrono de dados externos (API TVMaze) e simulação de rede.
- `modelo.js`: Regras de negócio e Classes principais (`PerfilUsuario`, `Conteudo`, `Series` e `MatchCalculator`).
- `ui.js`: Controladores principais da interface do usuário (DOM), renderização de cards, carrosséis e formulários.
- `translator.js`: Lógica complexa de geolocalização atrelada à adaptação instantânea de idiomas.
- `gerenciadorErros.js`: Motor de validação visual e feedbacks em tempo real de formulário.

## ⚙️ Como Executar o Projeto Localmente
Para a melhor experiência, recomendamos a utilização de um servidor local para que o sistema de módulos (ESM) funcione corretamente.

1. Clone este repositório para a sua máquina:
   ```bash
   git clone [https://github.com/RobertoSilva11/cinematch-web.git](https://github.com/RobertoSilva11/cinematch-web.git)
   cd cinematch-web
2. Certifique-se de que a estrutura de pastas (`img/logo.png e logo-fundo.png` e os arquivos JS) está mantida.
3. **Instale as dependências locais:**
    ```bash
    npm install
    ```
4. **Inicie o servidor de desenvolvimento:**
    ```bash
    npm start
    ```
    *O comando irá iniciar o pacote `live-server` configurado no `package.json` e abrirá a aplicação automaticamente no seu navegador.*    
5. Crie o seu perfil, selecione seus gêneros e clique em "Achar Meu Match".

## 👥 Desenvolvedores
- **Diego Lopes**
- **Edson Antonio**
- **Roberto Silva**

Qualificação em Desenvolvimento Mobile com React Native (SCTEC/SENAI) — 2026.
