//import { renderizarMensagemErro, limparMensagensErro } from "./ui.js";
/**
 * Função Validadora Dados Informados Formulário Perfil
 */
export function validarDadosFormPerfil(
  nome,
  idade,
  generosSelecionados,
) {
  const erros = [];
  const nomeNormalizado = String(nome ?? "").trim();
  const idadeNormalizada = String(idade ?? "").trim();
  const regexNome = /^(?=.*[A-Za-zÀ-ÿ])[A-Za-zÀ-ÿ\s]+$/;

  if (
    !regexNome.test(nomeNormalizado) ||
    nomeNormalizado.length < 3
  ) {
    erros.push("nome");
  }

  if (
    !idadeNormalizada ||
    Number(idadeNormalizada) < 1
  ) {
    erros.push("idade");
  }

  if (
    !generosSelecionados ||
    generosSelecionados.size === 0
  ) {
    erros.push("generos");
  }

  return erros;
}
