// Comportamento partilhado por todas as páginas: tema e idioma.
(function () {
    const H = window.Hamurabi = window.Hamurabi || {};
    const root = document.documentElement;
    const themeListeners = [];

    H.theme = {
        get: function () { return root.dataset.theme === 'light' ? 'light' : 'dark'; },
        set: function (valor) {
            root.dataset.theme = valor;
            const meta = document.querySelector('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', valor === 'light' ? '#faf8f4' : '#0b0b0e');
            try { localStorage.setItem('hamurabi.theme', valor); } catch (e) { /* sem armazenamento */ }
            themeListeners.forEach(function (fn) { fn(valor); });
        },
        onChange: function (fn) { themeListeners.push(fn); }
    };

    i18n.apply(document);

    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            H.theme.set(H.theme.get() === 'light' ? 'dark' : 'light');
        });
    }

    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
        const outro = i18n.lang === 'pt' ? 'en' : 'pt';
        langBtn.textContent = outro.toUpperCase();
        langBtn.addEventListener('click', function () { i18n.setLang(outro); });
    }
})();
