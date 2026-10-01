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
        url = null
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
 * Calculadora de Match para Séries
 */
export class MatchCalculator {
    /**
     * Calcula o percentual de afinidade entre os gêneros do perfil e da série
     * @param {Array<string>} generosUsuario 
     * @param {Array<string>} generosSerie 
     * @returns {number} Percentual de match (0 a 100)
     */
    static calcularMatch(generosUsuario, generosSerie) {
        if (!generosUsuario || !generosUsuario.length || !generosSerie || !generosSerie.length) return 0;

        const correspondencias = generosSerie.filter(g => generosUsuario.includes(g));
        const percentual = (correspondencias.length / generosUsuario.length) * 100;

        return Math.min(Math.round(percentual), 100);
    }
}