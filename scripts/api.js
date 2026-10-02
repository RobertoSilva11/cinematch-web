import { exibirMensagemFeedback } from "./ui.js";

const esteiraAlto = document.getElementById("esteira-match-alto");

export async function buscarCatalogo() {
  const url = "https://api.tvmaze.com/shows";

  exibirMensagemFeedback(
    esteiraAlto,
    "Buscando recomendações no catálogo...",
    false,
    true,
  );

  try {
    // RF12: Atraso proposital usando setTimeout (envolvido numa Promise para o async/await)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const resposta = await fetch(url);
    if (!resposta.ok)
      throw new Error(
        `Falha de conexão com API. Erro HTTP: ${resposta.status}`,
      );
    const catalogoDados = await resposta.json();

    if (!Array.isArray(catalogoDados) || catalogoDados.length === 0) {
      throw new Error("Catálogo vazio ou formato inválido.");
    }

    return catalogoDados;
  } catch (erro) {
    console.error("Erro ao carregar catálogo:", erro);
    exibirMensagemFeedback(
      esteiraAlto,
      "Erro ao carregar os dados da API TVMaze. Tente novamente mais tarde.",
      true,
    );
    return [];
  }
}
