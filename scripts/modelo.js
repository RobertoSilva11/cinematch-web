/**
 * Classe PerfilUsuario (RF02)
 */
export class PerfilUsuario {
  constructor(nome, idade, generos = []) {
    this.nome = nome;
    this.idade = Number(idade);
    this.generos = generos;
  }
}

/** RF06
 * Classe Conteudo do Catalogo (pai)
 */
export class Conteudo {
  constructor(id, titulo, tipo, generos) {
    this.id = id;
    this.titulo = titulo;
    this.tipo = tipo;
    this.generos = generos;
  }

  exibirResumoConteudo() {
    return `Título: ${this.titulo} | Gêneros: ${this.generos.join(", ")}`;
  }
}

/**
 * Classe Series do Conteudo (filha)
 */
export class Series extends Conteudo {
  constructor(
    id,
    titulo,
    tipo,
    generos,
    imagem,
    sinopse,
    avaliacaoNota,
    url,
    idioma,
    status,
  ) {
    super(id, titulo, tipo, generos); // Chama o construtor pai

    this.imagem = imagem;
    this.sinopse = sinopse;
    this.avaliacaoNota = avaliacaoNota;
    this.url = url;
    this.idioma = idioma;
    this.status = status;
  }

  /**
   * Exibe resumo específico da série herdando e sobrescrevendo o pai (RF06)
   */
  exibirResumoSeries() {
    const resumoPai = super.exibirResumoConteudo();
    return `${resumoPai} \nIdioma: ${this.idioma ?? "Não informado"} \nStatus: ${this.status ?? "Não informado"} \nNota TVMaze: ${this.avaliacaoNota ?? "N/A"}`;
  }
}

/**
 * Calculadora de Match para Séries (RF07)
 */
export class MatchCalculator {
  static calcularMatchDetalhado(generosUsuario = [], generosSerie = []) {
    if (!generosUsuario.length || !generosSerie.length) {
      return {
        percentual: 0,
        classificacao: "Nenhuma",
        generosComuns: [],
        generosNaoExplorados: generosSerie,
      };
    }

    // Gêneros no perfil do usuário em comum aos da série
    const generosComuns = generosSerie.filter((g) =>
      generosUsuario.includes(g),
    );
    // Gêneros da série que não estão no perfil do usuário
    const generosNaoExplorados = generosSerie.filter(
      (g) => !generosUsuario.includes(g),
    );
    // Calcular percentual compatibilidade/correspondencia
    const percentual = Math.min(
      Math.round((generosComuns.length / generosSerie.length) * 100),
      100,
    );
    // Classificar compatibilidade/correspondencia (Baixa | Média | Alta)
    let classificacao;
    // Cumpre o RF07: Classificação com switch-case
    switch (true) {
      case percentual >= 1 && percentual <= 49:
        classificacao = "Baixa";
        break;
      case percentual >= 50 && percentual <= 79:
        classificacao = "Média";
        break;
      case percentual > 79:
        classificacao = "Alta";
        break;
      default:
        classificacao = "Nenhuma Afinidade";
    }

    return { percentual, classificacao, generosComuns, generosNaoExplorados };
  }
}
