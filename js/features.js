// Interface: sliders, recálculo em tempo real, partilha, simulações guardadas, exportação e impressão.
(function () {
    const H = window.Hamurabi;
    const t = i18n.t;
    const STORE = 'hamurabi.simulacoes';
    const MAX_SIMS = 30;
    document.documentElement.classList.add('js');

    function sec(id) { return document.getElementById(id); }
    function camposDe(section) {
        return Array.prototype.slice.call(section.querySelectorAll('.calculator-inputs input[id], .calculator-inputs select[id]'))
            .filter(function (el) { return el.type !== 'range'; });
    }
    function definir(el, valor) {
        if (el.type === 'checkbox') {
            el.checked = valor === true || valor === 'true' || valor === 'on';
        } else if (el.tagName === 'SELECT') {
            const existe = Array.prototype.some.call(el.options, function (o) { return o.value === String(valor); });
            if (existe) el.value = String(valor);
        } else if (valor !== '' && isFinite(parseFloat(valor))) {
            el.value = valor;
        }
    }
    function escapar(s) {
        return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
    }

    // ---------- Valores iniciais: ligação partilhada ou troca de idioma ----------
    (function restaurar() {
        const origem = [];
        try {
            const guardados = JSON.parse(sessionStorage.getItem('hamurabi.restore') || 'null');
            sessionStorage.removeItem('hamurabi.restore');
            if (guardados) Object.keys(guardados).forEach(function (k) { origem.push([k, guardados[k]]); });
        } catch (e) { /* ignora */ }
        new URLSearchParams(location.search).forEach(function (v, k) { origem.push([k, v]); });
        origem.forEach(function (par) {
            const el = document.getElementById(par[0]);
            if (el && el.closest('.calculator-inputs')) definir(el, par[1]);
        });
    })();

    // ---------- Sliders ----------
    document.querySelectorAll('input[data-slider]').forEach(function (input) {
        const p = input.dataset.slider.split(',').map(Number);
        const range = document.createElement('input');
        range.type = 'range';
        range.min = p[0]; range.max = p[1]; range.step = p[2];
        range.value = input.value;
        range.className = 'slider';
        const label = document.querySelector('label[for="' + input.id + '"]');
        if (label) range.setAttribute('aria-label', label.textContent);
        range.tabIndex = -1;
        range.setAttribute('aria-hidden', 'true');
        input.insertAdjacentElement('afterend', range);
        const pintar = function () {
            const v = parseFloat(range.value), pct = (v - p[0]) / (p[1] - p[0]) * 100;
            range.style.setProperty('--fill', Math.min(100, Math.max(0, pct)) + '%');
        };
        range.addEventListener('input', function () {
            input.value = range.value;
            pintar();
            input.dispatchEvent(new Event('input', { bubbles: true }));
        });
        input.addEventListener('input', function () {
            if (input.value !== '') range.value = input.value;
            pintar();
        });
        pintar();
    });

    // ---------- Campos condicionais ----------
    function atualizarVisibilidade(section) {
        section.querySelectorAll('[data-show-when]').forEach(function (el) {
            const par = el.dataset.showWhen.split('=');
            const alvo = document.getElementById(par[0]);
            el.hidden = !(alvo.type === 'checkbox' ? alvo.checked : alvo.value === par[1]);
        });
    }

    // ---------- Recálculo ----------
    function validos(section) {
        let ok = true;
        section.querySelectorAll('.calculator-inputs input[type="number"]').forEach(function (el) {
            const valido = !!el.closest('[hidden]') || (el.value !== '' && el.checkValidity());
            el.setAttribute('aria-invalid', String(!valido));
            if (!valido) ok = false;
        });
        return ok;
    }

    function calcular(tool) {
        const section = sec(tool.section);
        atualizarVisibilidade(section);
        if (!validos(section)) return;
        H.showError(tool.section, '');
        tool.calcular();
    }

    H.initTables();

    H.tools.forEach(function (tool) {
        const section = sec(tool.section);
        let timer;
        const inputs = section.querySelector('.calculator-inputs');
        inputs.addEventListener('input', function (e) {
            if (e.target.type === 'range') return;
            clearTimeout(timer);
            timer = setTimeout(function () { calcular(tool); }, 250);
        });
        inputs.addEventListener('change', function (e) {
            if (e.target.tagName === 'SELECT' || e.target.type === 'checkbox') {
                clearTimeout(timer);
                calcular(tool);
            }
        });
        const botao = section.querySelector('[data-calc]');
        if (botao) botao.addEventListener('click', function () { calcular(tool); });
        section.querySelectorAll('input[type="number"]').forEach(function (el) {
            el.addEventListener('keydown', function (e) { if (e.key === 'Enter') calcular(tool); });
        });
    });

    // ---------- Ações: partilhar, guardar, CSV, imprimir ----------
    const ICONS = {
        share: '<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"/>',
        save: '<path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/>',
        csv: '<path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"/>',
        print: '<path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2M6 14h12v7H6z"/>'
    };
    const ACOES = { share: partilhar, save: guardar, csv: function (id) { H.downloadCsv(id); }, print: imprimir };

    H.tools.forEach(function (tool) {
        const results = sec(tool.section).querySelector('.calculator-results');
        const bar = document.createElement('div');
        bar.className = 'tool-actions';
        Object.keys(ICONS).forEach(function (acao) {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'btn-secondary';
            b.dataset.act = acao;
            b.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[acao] + '</svg><span data-i18n="act.' + acao + '"></span>';
            bar.appendChild(b);
        });
        results.appendChild(bar);
        i18n.apply(bar);
        bar.addEventListener('click', function (e) {
            const b = e.target.closest('button[data-act]');
            if (b) ACOES[b.dataset.act](tool.section);
        });
    });

    function valoresDe(sectionId) {
        const v = {};
        camposDe(sec(sectionId)).forEach(function (el) { v[el.id] = el.type === 'checkbox' ? el.checked : el.value; });
        return v;
    }

    function partilhar(sectionId) {
        const params = new URLSearchParams();
        const v = valoresDe(sectionId);
        Object.keys(v).forEach(function (k) { params.set(k, String(v[k])); });
        const url = location.origin + location.pathname + '?' + params.toString() + '#' + sectionId;
        const falha = function () { H.toast(t('toast.shareFail')); history.replaceState(null, '', url); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(function () { H.toast(t('toast.copied')); }, falha);
        } else falha();
    }

    // ---------- Simulações guardadas ----------
    function lerSims() {
        try { return JSON.parse(localStorage.getItem(STORE) || '[]'); } catch (e) { return []; }
    }
    function gravarSims(lista) {
        try { localStorage.setItem(STORE, JSON.stringify(lista)); } catch (e) { /* cheio ou indisponível */ }
        atualizarContagem();
    }
    function atualizarContagem() {
        const n = lerSims().length, el = H.$('simsCount');
        el.textContent = n;
        el.hidden = n === 0;
    }
    function tituloDe(sectionId) {
        const h = sec(sectionId).querySelector('h2');
        return h ? h.textContent : sectionId;
    }
    function dataLocal(d) { return new Date(d).toLocaleDateString(i18n.lang === 'pt' ? 'pt-PT' : 'en-IE'); }

    const saveDialog = H.$('saveDialog');
    let sectionAGuardar = null;
    function guardar(sectionId) {
        sectionAGuardar = sectionId;
        H.$('saveName').value = tituloDe(sectionId) + ' · ' + dataLocal(Date.now());
        saveDialog.showModal();
        H.$('saveName').select();
    }
    saveDialog.addEventListener('close', function () {
        if (saveDialog.returnValue !== 'ok' || !sectionAGuardar) return;
        const lista = lerSims();
        lista.unshift({
            id: Date.now().toString(36), section: sectionAGuardar,
            name: H.$('saveName').value.trim() || tituloDe(sectionAGuardar),
            date: new Date().toISOString(), values: valoresDe(sectionAGuardar)
        });
        gravarSims(lista.slice(0, MAX_SIMS));
        H.toast(t('toast.saved'));
    });

    const simsDialog = H.$('simsDialog');
    function renderSims() {
        const lista = lerSims(), ul = H.$('simsList');
        ul.innerHTML = '';
        H.$('simsEmpty').hidden = lista.length > 0;
        lista.forEach(function (s) {
            const li = document.createElement('li');
            const info = document.createElement('div');
            const nome = document.createElement('strong');
            nome.textContent = s.name;
            const meta = document.createElement('small');
            meta.textContent = dataLocal(s.date);
            info.append(nome, meta);
            const abrir = document.createElement('button');
            abrir.type = 'button'; abrir.className = 'btn-secondary'; abrir.textContent = t('sims.load');
            abrir.addEventListener('click', function () { carregar(s); });
            const apagar = document.createElement('button');
            apagar.type = 'button'; apagar.className = 'btn-ghost'; apagar.textContent = t('sims.delete');
            apagar.addEventListener('click', function () {
                gravarSims(lerSims().filter(function (x) { return x.id !== s.id; }));
                renderSims();
                H.toast(t('toast.deleted'));
            });
            li.append(info, abrir, apagar);
            ul.appendChild(li);
        });
    }
    function carregar(s) {
        const section = sec(s.section);
        if (!section) return;
        camposDe(section).forEach(function (el) {
            if (s.values[el.id] === undefined) return;
            definir(el, s.values[el.id]);
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        calcular(H.tools.filter(function (x) { return x.section === s.section; })[0]);
        simsDialog.close();
        section.scrollIntoView({ behavior: 'smooth' });
        H.toast(t('toast.restored'));
    }
    H.$('simsBtn').addEventListener('click', function () { renderSims(); simsDialog.showModal(); });
    [saveDialog, simsDialog].forEach(function (d) {
        d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    });
    atualizarContagem();

    // ---------- Impressão / PDF ----------
    function imprimir(sectionId) {
        const section = sec(sectionId);
        const tema = H.theme.get();
        const resumo = document.createElement('div');
        resumo.className = 'print-summary';
        const linhas = camposDe(section).filter(function (el) { return !el.closest('[hidden]'); }).map(function (el) {
            const label = document.querySelector('label[for="' + el.id + '"]') || el.closest('label');
            let valor = el.value;
            if (el.type === 'checkbox') valor = t(el.checked ? 'yes' : 'no');
            else if (el.tagName === 'SELECT') valor = el.options[el.selectedIndex].textContent;
            return '<dt>' + escapar(label ? label.textContent.trim() : el.id) + '</dt><dd>' + escapar(valor) + '</dd>';
        });
        resumo.innerHTML = '<h2>' + escapar(t('print.heading') + ' · ' + tituloDe(sectionId)) + '</h2><h3>' + t('print.inputs') + '</h3><dl>' + linhas.join('') + '</dl><h3>' + t('print.results') + '</h3>';
        section.querySelector('.calculator-container').insertAdjacentElement('beforebegin', resumo);
        section.classList.add('print-target');
        document.body.classList.add('printing');
        if (tema !== 'light') H.theme.set('light');
        const limpar = function () {
            window.removeEventListener('afterprint', limpar);
            resumo.remove();
            section.classList.remove('print-target');
            document.body.classList.remove('printing');
            if (tema !== 'light') H.theme.set(tema);
        };
        window.addEventListener('afterprint', limpar);
        Object.keys(H.charts).forEach(function (id) { H.charts[id].resize(); });
        setTimeout(function () { window.print(); }, 350);
    }

    // ---------- Navegação e animações ----------
    const grupos = {};
    document.querySelectorAll('nav a[data-group]').forEach(function (a) { grupos[a.dataset.group] = a; });
    const observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
            if (!en.isIntersecting) return;
            Object.keys(grupos).forEach(function (g) {
                if (g === en.target.dataset.group) grupos[g].setAttribute('aria-current', 'true');
                else grupos[g].removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    document.querySelectorAll('main section[data-group]').forEach(function (s) { observador.observe(s); });

    // ---------- Cálculo inicial e PWA ----------
    H.tools.forEach(calcular);
    if (location.hash && sec(location.hash.slice(1))) sec(location.hash.slice(1)).scrollIntoView();

    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
        navigator.serviceWorker.register('sw.js').catch(function () { /* sem offline */ });
    }
})();
