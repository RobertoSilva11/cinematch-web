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

    return { percentual, classificacao, generosComuns, generosNaoExplorados,
    };
  }
}
