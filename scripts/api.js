import { exibirMensagemFeedback } from './ui.js';

const esteiraAlto = document.getElementById("esteira-match-alto");

export async function buscarCatalogo() {
    const url = "https://api.tvmaze.com/shows";
    
    exibirMensagemFeedback(esteiraAlto, "Buscando recomendações no catálogo...", false, true);
    
    try {
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
        exibirMensagemFeedback(esteiraAlto, "Erro ao carregar os dados da API TVMaze. Tente novamente mais tarde.", true);
        return [];
    }
}