import { 
    inicializarTema, 
    renderizarGenerosEstaticos, 
    inicializarMenuHamburguer, 
    configurarFormularioPerfil,
    carregarBannerInicial,
    configurarModalBuscaAvancada
} from './ui.js';

import {
    inicializarGeolocalizacao
}from './translator.js'

import { 
    buscarCatalogo
} from './api.js';


import { 
    Series
} from './modelo.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Temporizador de 5 segundos para a Splash Screen de Introdução
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.classList.add('esconder-splash');
        }
    }, 5000);

    // 2. Inicialização dos componentes da UI
    inicializarTema();
    renderizarGenerosEstaticos();
    inicializarGeolocalizacao();
    inicializarMenuHamburguer();
    configurarFormularioPerfil();
    carregarBannerInicial();
    buscarCatalogo();
    configurarModalBuscaAvancada();
});


