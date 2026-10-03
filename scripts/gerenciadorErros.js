/**
 * Gerenciamento dos erros visuais de formulário.
 */

const elementosErro = [];

/**
 * Renderiza a mensagem de erro correspondente ao campo.
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
      console.log(
        `Nada a fazer na função renderizarMensagemErro!`,
      );
  }
}

/**
 * Remove as mensagens de erro atualmente exibidas.
 */
export function limparMensagensErro() {
  elementosErro.forEach((elemento) => {
    elemento.classList.remove("perfil-erro");
    const mensagemErro = document.getElementById(
      `${elemento.id}-erro`,
    );

    if (mensagemErro) {
      mensagemErro.remove();
    }
  });

  elementosErro.length = 0;
}

/**
 * Recebe os IDs dos campos identificados pelo validador
 * e realiza o tratamento visual correspondente.
 *
 * Retorna true quando não existem erros.
 */
export function processarErros(idsErros) {
  limparMensagensErro();

  idsErros.forEach((id) => {
    if (id === "generos") {
      return;
    }

    const elemento = document.getElementById(id);

    if (elemento) {
      elementosErro.push(elemento);
      renderizarMensagemErro(elemento, id);
    }
  });

  if (idsErros.length === 0) {
    return true;
  }

  if (elementosErro.length > 0) {
    elementosErro[0].focus();
  } else if (idsErros.includes("generos")) {
    alert(
      "Por favor, selecione pelo menos um gênero favorito.",
    );
  }

  return false;
}