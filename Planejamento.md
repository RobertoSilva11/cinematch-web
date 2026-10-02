# 🎬 CineMatch Web: Recomendação de Séries em Tempo Real

O **CineMatch Web** é a evolução com interface gráfica do motor de recomendação CineMatch original (antes executado via terminal). A aplicação resolve o problema da indecisão na hora de escolher uma série, permitindo que o utilizador crie um perfil com os seus géneros favoritos e receba recomendações instantâneas, baseadas num catálogo real de séries, diretamente no navegador.

---

## 📋 Organização e Kanban (Trello)

O planeamento e execução do projeto seguiram uma metodologia ágil através do Kanban. Como o projeto se encontra finalizado, todas as tarefas de desenvolvimento propostas pelo escopo foram movidas para a coluna de concluídas.

🔗 **Link do Quadro Oficial:** [Quadro Trello - CineMatch Web](https://trello.com/b/EdJxC2T1/cinematch-web)

### Fluxo de Tarefas (Baseado nos Requisitos Funcionais)

| 📝 Backlog | ⏳ A Fazer | 🏗️️ Em Andamento | ✅ Concluído |
| :--- | :--- | :--- | :--- |
| *(Vazio)* | *(Vazio)* | *(Vazio)* | **[RF01/RF02]** Estruturar HTML Semântico e Formulário |
| | | | **[RF09]** Estilizar mobile-first e UI/UX |
| | | | **[RF03]** Persistir perfil no LocalStorage |
| | | | **[RF04]** Consumir API pública do TVMaze via Fetch |
| | | | **[RF05]** Tratar catálogo (Map, Filter, Sort) |
| | | | **[RF06]** Refatorar POO (Classes `Conteudo` e `Series`) |
| | | | **[RF07]** Lógica de cálculo de Match Detalhado |
| | | | **[RF08]** Renderizar Cards dinâmicos no DOM |
| | | | **[RF10/RF11]** Aplicar Callback (Boas-vindas) e Closure (Contador) |
| | | | **[RF12]** Simulação de rede com `setTimeout` |
| | | | **[RF13]** Revisar Acessibilidade (Roving Tabindex, ARIA) |
| | | | **[RF14]** Modularização com ES Modules |
| | | | **[RF15]** Deploy local com `live-server` |

---

## 🛠️ Tecnologias e Técnicas Utilizadas

*   **HTML5 Semântico:** Uso rigoroso de landmarks (`<header>`, `<main>`, `<section>`, `<article>`, `<search>`) e eliminação de "div soup".
*   **CSS3 Vanilla:** Layout estruturado com Flexbox, Mobile-First, variáveis nativas e tipografia responsiva.
*   **JavaScript (ES6+):**
    *   **DOM e Eventos:** Geração de elementos (`createElement`) e prevenção de comportamento padrão (`preventDefault`).
    *   **Browser APIs:** Consumo da `Fetch API` (TVMaze), manipulação de `LocalStorage`, e `Geolocation API`.
    *   **Lógica Avançada:** Orientação a Objetos (Classes, Herança, `super()`), Closures, Callbacks e manipulação massiva de arrays (`filter`, `map`, `sort`).
*   **Acessibilidade (a11y):** Implementação de Roving Tabindex 2D para navegação integral via teclado em esteiras e grid, labels adequados e gerenciamento de foco.
*   **Ecossistema Node:** Gerenciamento de dependências com `npm` para ambiente de desenvolvimento local (`live-server`).

---

## 📚 Notas de Arquitetura: CommonJS vs ESM

No protótipo anterior (CineMatch JS de terminal), utilizámos o **CommonJS** (`require` / `module.exports`), que é o sistema tradicional do Node.js desenhado para importar ficheiros de forma síncrona, ideal para scripts locais de servidor. 

Para a versão Web, o código foi modernizado para **ES Modules (ESM)** (`import` / `export`). O ESM é o padrão oficial e moderno do JavaScript, suportado nativamente pelos navegadores. Ele permite carregamento modular assíncrono, facilitando a otimização, segurança e a divisão de responsabilidades da interface sem a necessidade de um bundler externo.

---

## 🚀 Como Executar o Projeto

Para executar a aplicação no seu ambiente local, certifique-se de que tem o [Node.js](https://nodejs.org/) instalado.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/RobertoSilva11/cinematch-web.git](https://github.com/RobertoSilva11/cinematch-web.git)
    cd cinematch-web
    ```
2.  **Instale as dependências locais:**
    ```bash
    npm install
    ```
3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm start
    ```
    *O comando irá iniciar o pacote `live-server` configurado no `package.json` e abrirá a aplicação automaticamente no seu navegador.*

---

## 💡 Melhorias Futuras (Opcionais)

Embora a aplicação cumpra todos os requisitos base, há espaço para evolução:
*   **Filtros Rápidos:** Adicionar botões de filtro por género na secção de resultados para refinar a pesquisa sem ter de preencher o formulário novamente.
*   **Integração de Múltiplas APIs:** Mesclar a TVMaze com a TMDB para voltar a recomendar Filmes e Séries em simultâneo.
*   **Paginação / Infinite Scroll:** Aproveitar o endpoint `?page=` da TVMaze para ampliar o catálogo de recomendações além da primeira página de resultados.

---
*Projeto desenvolvido como Qualificação em Desenvolvimento Mobile com React Native (SCTEC/SENAI).*
**Autores:** Diego Lopes, Edson Antonio e Roberto Silva.