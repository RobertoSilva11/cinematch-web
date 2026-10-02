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
    return `
     ID: ${this.id}
     Título: ${this.titulo}
     Tipo: ${this.tipo}
     Gêneros: ${this.generos.join(", ")}`;
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
    classificacao,
    temporadas,
    episodios,
    imagemMedia = null,
    imagemOriginal = null,
    sinopse = null,
    avaliacaoNota = null,
    idioma = null,
    status = null,
    duracao = null,
    url = null,
  ) {
    super(id, titulo, tipo, generos);

    this.classificacao = classificacao;
    this.temporadas = temporadas;
    this.episodios = episodios;
    this.imagemMedia = imagemMedia;
    this.imagemOriginal = imagemOriginal;
    this.sinopse = sinopse;
    this.avaliacaoNota = avaliacaoNota;
    this.idioma = idioma;
    this.status = status;
    this.duracao = duracao;
    this.url = url;
  }

  /**
   * Exibe resumo específico da série
   */
  exibirResumoSeries() {
    return `
     Classificação: ${this.classificacao ?? "Não informado"}
     Temporadas: ${this.temporadas ?? "Não informado"}
     Episódios: ${this.episodios ?? "Não informado"}`;
  }
}

/**
 * Calculadora de Match para Séries (RF07)
 */
export class MatchCalculator {
  static calcularMatchDetalhado(generosUsuario, generosSerie) {
    if (
      !generosUsuario ||
      !generosUsuario.length ||
      !generosSerie ||
      !generosSerie.length
    ) {
      return {
        percentual: 0,
        classificacao: "Baixa",
        comuns: [],
        naoExplorados: generosSerie || [],
      };
    }

    const comuns = generosSerie.filter((g) => generosUsuario.includes(g));
    const naoExplorados = generosSerie.filter(
      (g) => !generosUsuario.includes(g),
    );
    const percentual = Math.min(
      Math.round((comuns.length / generosSerie.length) * 100),
      100,
    );

    // Cumpre o RF07: Classificação com if-else
    let classificacao = "";
    if (percentual >= 70) classificacao = "Alta Afinidade";
    else if (percentual >= 40) classificacao = "Média Afinidade";
    else classificacao = "Baixa Afinidade";

    return { percentual, classificacao, comuns, naoExplorados };
  }
}
