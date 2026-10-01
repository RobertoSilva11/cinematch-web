const esteiraAlto = document.getElementById("esteira-match-alto");

export async function buscarCatalogo() {
    const url = "https://api.tvmaze.com/shows";
    esteiraAlto.innerHTML =
          '<p class="mensagem-feedback"><i class="bi bi-arrow-repeat spin"></i> Buscando recomendações no catálogo...</p>';
    try {
        /**separar a busca api para uma função buscar catálogo para tratativa de erro é mais facil SEPARADO */
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error(`Falha de conexão com API. Erro HTTP: ${resposta.status}`);
        const catalogoDados = await resposta.json();
         
        if (!Array.isArray(catalogoDados) || catalogoDados.length === 0) {
            throw new Error('Catálogo vazio ou formato inválido.');
        }

        return catalogoDados;

    } catch (erro) {
        console.error('Erro ao carregar catálogo:', erro);
        console.error('Erro ao carregar séries:', erro);
        esteiraAlto.innerHTML = '<p class="mensagem-feedback" style="color: #e63946;">Erro ao carregar os dados da API TVMaze. Tente novamente mais tarde.</p>';
        return [];
    }
}