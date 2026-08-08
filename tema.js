// tema.js
// Aplicar tema guardat a totes les pàgines

(function() {
    const tema = localStorage.getItem('benzapp_tema') || 'auto';
    document.documentElement.setAttribute('data-theme', tema);
})();

// Escoltar canvis de tema
window.addEventListener('storage', function(e) {
    if (e.key === 'benzapp_tema') {
        document.documentElement.setAttribute('data-theme', e.newValue || 'auto');
    }
});