# 🎬 CineMatch Web: Recomendação de Séries

![Logo do CineMatch Web](./img/logo.png)

## ℹ️ Sobre o Projeto
O CineMatch Web é uma aplicação interativa desenvolvida para conectar usuários às suas próximas séries favoritas de forma dinâmica. Baseado nos princípios de experiência do usuário, o sistema recomenda produções televisivas cruzando os gêneros cinematográficos de maior afinidade com o gosto pessoal do usuário, além de considerar filtros de localização e idioma.

##  Funcionalidades Principais (User Stories)
- **Splash Screen de Introdução:** Tela inicial de apresentação animada com duração controlada de 5 segundos.
- **Cadastro de Perfil de Usuário:** Criação de perfil com nome, idade e seleção de múltiplos gêneros favoritos. Suporte para múltiplos perfis salvos via LocalStorage.
- **Recomendação Inteligente:** Cálculo percentual de afinidade (Match%) cruzando gêneros do perfil com os gêneros das séries do catálogo.
- **Duas Esteiras de Recomendações:** Classificação automática das séries em duas categorias exibidas em carrosséis horizontais:
  - *Séries com maior compatibilidade* (Match >= 50%)
  - *Menos recomendadas / Outros* (Match < 50%)
- **Tradução Local de Sinopses:** Ao ativar o recurso de geolocalização, sinopses do catálogo em inglês são traduzidas para o português através de um dicionário local integrado, otimizando o tempo de resposta e garantindo estabilidade offline.
- **Busca Avançada:** Modal dedicado com buscador textual que filtra todo o catálogo da API em tempo real conforme as iniciais digitadas.
- **Alternância de Temas:** Switch para modo diurno (Light Mode) e modo noturno (Dark Mode) com persistência no LocalStorage.
- **Responsividade:** Layout adaptável para dispositivos móveis e desktops.

## 💻 Tecnologias Utilizadas
- **HTML5:** Estrutura e semântica da aplicação.
- **CSS3:** Estilização, animações (Keyframes), variaveis CSS (Theming) e Flexbox/CSS Grid.
- **JavaScript (ES6+):** Programação Orientada a Objetos, Módulos (ES Modules), manipulação assíncrona (Fetch API) e uso de LocalStorage.
- **Bootstrap Icons:** Biblioteca de ícones.
- **API Consumida:** TVMaze API para obtenção de séries.
- **Fontes Google:** Plus Jakarta Sans.

## 🏗️ Estrutura do Código
A lógica interna foi dividida em componentes modulares para facilitar a manutenção e escalabilidade:

- `index.html`: Arquivo principal da interface que abriga o formulário de perfil, resultados em carrosséis e o modal de busca avançada.
- `script.js`: Arquivo que gerencia o fluxo inicial do carregamento do documento, incluindo o temporizador do splash screen e inicialização dos componentes visuais.
- `ui.js`: Módulo principal da interface do usuário. Contém funções de tradução local de sinopse, renderização de cards, carrosséis, controles de eventos e persistência de dados no LocalStorage.
- `modelo.js`: Módulo que contém a classe de Perfil do Usuário e a classe `MatchCalculator`, responsável pelo algoritmo puro de afinidade entre gêneros.
- `style.css`: Folha de estilo contendo as regras globais, temas claro/escuro, animações e componentes mobile.

## ⚙️ Como Executar
1. Clone este repositório para a sua máquina.
2. Certifique-se de que a estrutura de pastas (`img/logo.png` e os arquivos JS) está mantida.
3. Abra o arquivo `index.html` diretamente em qualquer navegador moderno.
4. Crie o seu perfil, selecione seus gêneros e clique em "Achar Meu Match".

## 👥 Desenvolvedores
- **Diego Lopes**
- **Edson Antonio**
- **Roberto Silva**
Qualificação em Desenvolvimento Mobile com React Native (SCTEC/SENAI) — 2026.