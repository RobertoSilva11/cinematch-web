import { 
    inicializarTema, 
    renderizarGenerosEstaticos, 
    inicializarGeolocalizacao, 
    inicializarMenuHamburguer, 
    configurarFormularioPerfil 
} from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    inicializarTema();
    renderizarGenerosEstaticos();
    inicializarGeolocalizacao();
    inicializarMenuHamburguer();
    configurarFormularioPerfil();
});