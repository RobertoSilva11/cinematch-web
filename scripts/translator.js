/**
 * Simula um clique invisível no widget do Google Tradutor e extermina a barra branca
 */

const btnLocalizacao = document.getElementById('id-do-seu-botao'); // Confirme se o ID está correto
let localizacaoAtiva = false;

export function forcarTraducaoGoogle(ativar) {
  const selectBox = document.querySelector(".goog-te-combo");

  if (ativar) {
    if (selectBox) {
      selectBox.value = "pt";
      selectBox.dispatchEvent(new Event("change"));
    }
  } else {
    // 1. Tenta reverter definindo o idioma alvo de volta para o original ('en')
    if (selectBox) {
      selectBox.value = "en";
      selectBox.dispatchEvent(new Event("change"));
    }

    // 2. Tenta acionar o botão oculto "Show Original" dentro da estrutura do Google
    try {
      const iframe = document.querySelector(
        ".goog-te-banner-frame, body > .skiptranslate > iframe",
      );
      if (iframe) {
        const innerDoc =
          iframe.contentDocument || iframe.contentWindow.document;
        const btnRestore =
          innerDoc.getElementById("restore") ||
          innerDoc.querySelector('button[id*="restore"]');
        if (btnRestore) btnRestore.click();
      }
    } catch (erro) {
      // Ignora bloqueios de segurança do navegador (CORS) caso o iframe seja protegido
    }

    // 3. Destrói o cookie de memória do Google Tradutor
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" +
      location.hostname +
      "; path=/;";
  }

  // Mantém a vigilância contra a barra branca intrusiva
  setTimeout(() => {
    document.body.style.top = "0px";
    const barraGoogle = document.querySelector(
      ".goog-te-banner-frame, .skiptranslate > iframe, .VIpgJd-ZVi9od-aZ2wEe-wOHMyf",
    );
    if (barraGoogle) {
      barraGoogle.style.display = "none";
    }
  }, 500);
}

/**
 * Botão On/Off de Localização com Gatilho de Tradução Instantânea
 */
export function inicializarGeolocalizacao() {
  const btnGeo = document.getElementById("btn-geolocalizacao");
  const textoBtnGeo = document.getElementById("texto-btn-geo");
  const indicadorCidade = document.getElementById("indicador-cidade");
  const textoCidade = document.getElementById("texto-cidade");

  if (!btnGeo) return;

  btnGeo.addEventListener("click", () => {
    // SE ESTIVER ATIVADO -> VAMOS DESATIVAR
    if (localizacaoAtiva) {
      localizacaoAtiva = false;

      if (indicadorCidade) indicadorCidade.classList.add("escondido");
      if (textoBtnGeo) textoBtnGeo.textContent = "Ativar Localização";

      // Reverte a tradução imediatamente
      forcarTraducaoGoogle(false);
      return;
    }

    // SE ESTIVER DESATIVADO -> VAMOS ATIVAR
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    if (textoCidade) textoCidade.textContent = "Detectando...";
    if (indicadorCidade) indicadorCidade.classList.remove("escondido");

    navigator.geolocation.getCurrentPosition(
      async (posicao) => {
        const lat = posicao.coords.latitude;
        const lon = posicao.coords.longitude;

        try {
          const resposta = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
          );
          const dados = await resposta.json();

          const cidade =
            dados.address.city ||
            dados.address.town ||
            dados.address.village ||
            "Sua Região";
          const estado = dados.address.state ? `, ${dados.address.state}` : "";

          if (textoCidade) textoCidade.textContent = `${cidade}${estado}`;
          localizacaoAtiva = true;
          if (textoBtnGeo) textoBtnGeo.textContent = "Desativar Localização";

          // Dispara a tradução imediatamente para Português!
          forcarTraducaoGoogle(true);
        } catch (erro) {
          if (textoCidade) textoCidade.textContent = "Localização Ativa";
          localizacaoAtiva = true;
          if (textoBtnGeo) textoBtnGeo.textContent = "Desativar Localização";

          // Mesmo se a API de mapas falhar, a tradução acontece
          forcarTraducaoGoogle(true);
        }
      },
      () => {
        alert("Não foi possível obter a sua localização.");
        if (indicadorCidade) indicadorCidade.classList.add("escondido");
        localizacaoAtiva = false;
        if (textoBtnGeo) textoBtnGeo.textContent = "Ativar Localização";
      },
    );
  });
}