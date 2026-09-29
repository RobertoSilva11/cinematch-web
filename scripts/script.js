import { 
    inicializarTema, 
    renderizarGenerosEstaticos, 
    inicializarGeolocalizacao, 
    inicializarMenuHamburguer, 
    configurarFormularioPerfil 
} from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Temporizador de 5 segundos para a Splash Screen de Introdução
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.classList.add('esconder-splash');
        }
    }, 5000);

    // 2. Inicialização dos componentes
    inicializarTema();
    renderizarGenerosEstaticos();
    inicializarGeolocalizacao();
    inicializarMenuHamburguer();
    configurarFormularioPerfil();
});