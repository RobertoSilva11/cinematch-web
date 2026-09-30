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