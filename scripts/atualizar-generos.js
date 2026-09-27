const fs = require('fs');
const path = require('path');

async function gerarArquivoTraduzido() {
  console.log('Buscando séries na TVMaze...');
  const resSeries = await fetch('https://api.tvmaze.com/shows');
  const series = await resSeries.json();
  
  const todosOsGeneros = series.flatMap(serie => serie.genres);
  const generosUnicos = [...new Set(todosOsGeneros)].sort();
  
  const dicionarioGeneros = {};

  console.log('Traduzindo gêneros...');
  for (const genero of generosUnicos) {
    try {
      const resTraducao = await fetch(`https://api.mymemory.translated.net/get?q=${genero}&langpair=en|pt-br`);
      const dados = await resTraducao.json();
      dicionarioGeneros[genero] = dados.responseData.translatedText || genero;
      await new Promise(resolve => setTimeout(resolve, 500)); 
    } catch (e) {
      dicionarioGeneros[genero] = genero;
    }
  }

  const caminhoDir = path.join(__dirname, '../dados');
  if (!fs.existsSync(caminhoDir)) fs.mkdirSync(caminhoDir);
  
  const caminhoArquivo = path.join(caminhoDir, 'generos.json');
  fs.writeFileSync(caminhoArquivo, JSON.stringify(dicionarioGeneros, null, 2));
  
  console.log('Arquivo generos.json atualizado com sucesso!');
}

gerarArquivoTraduzido();