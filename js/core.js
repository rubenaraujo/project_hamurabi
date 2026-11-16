// Núcleo da aplicação: gráficos, tabelas, exportação CSV e registo de ferramentas.
(function () {
    const H = window.Hamurabi = window.Hamurabi || {};
    const t = i18n.t;

    H.$ = function (id) { return document.getElementById(id); };
    H.num = function (id) { return parseFloat(H.$(id).value); };
    H.int = function (id) { return parseInt(H.$(id).value, 10); };
    H.str = function (id) { return H.$(id).value; };
    H.checked = function (id) { return H.$(id).checked; };
    H.setText = function (id, texto) { H.$(id).textContent = texto; };

    let toastTimer;
    H.toast = function (mensagem) {
        const el = H.$('toast');
        el.textContent = mensagem;
        el.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2600);
    };

    H.showError = function (sectionId, mensagem) {
        const el = document.querySelector('#' + sectionId + ' .form-error');
        if (!el) return;
        el.textContent = mensagem || '';
        el.hidden = !mensagem;
    };

    H.tools = [];
    H.registerTool = function (tool) { H.tools.push(tool); };

    // ---------- Gráficos ----------
    const PALETAS = {
        dark: { gold: '#d9946a', blue: '#7fb7c9', green: '#7fd1a0', red: '#e8786e', alt: '#c9a7f0', text: '#9a98a3', grid: 'rgba(255,255,255,0.06)', tooltipBg: '#1b1b23', tooltipText: '#f3f1ec', tooltipBorder: 'rgba(243,209,156,0.35)' },
        light: { gold: '#a65f38', blue: '#2f7d99', green: '#2b8a57', red: '#cc4a3d', alt: '#7d57b8', text: '#6b665c', grid: 'rgba(20,16,8,0.08)', tooltipBg: '#ffffff', tooltipText: '#1b1710', tooltipBorder: 'rgba(168,116,26,0.45)' }
    };
    H.paleta = function () { return PALETAS[H.theme.get()]; };

    function comAlfa(hex, alfa) {
        const n = parseInt(hex.slice(1), 16);
        return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + alfa + ')';
    }

    H.charts = {};
    const cfgs = {};
    const cfgDe = function (id) { return cfgs[id]; };

    function aplicarPaleta(chart) {
        const p = H.paleta();
        chart.data.datasets.forEach(function (d) {
            const cor = p[d.role] || p.gold;
            d.borderColor = cor;
            d.backgroundColor = d.fill === false ? 'transparent' : comAlfa(cor, 0.12);
        });
        const o = chart.options;
        ['x', 'y'].forEach(function (eixo) {
            o.scales[eixo].grid.color = p.grid;
            o.scales[eixo].ticks.color = p.text;
        });
        o.plugins.legend.labels.color = p.text;
        Object.assign(o.plugins.tooltip, {
            backgroundColor: p.tooltipBg, titleColor: p.tooltipText, bodyColor: p.tooltipText, borderColor: p.tooltipBorder
        });
    }

    // cfg: {labels, datasets:[{label, data, role, dashed, fill}], aria, yFormat, tooltipFormat, beginAtZero}
    H.chart = function (canvasId, cfg) {
        const canvas = H.$(canvasId);
        const datasets = cfg.datasets.map(function (d) {
            return {
                label: d.label, data: d.data, role: d.role || 'gold',
                borderDash: d.dashed ? [6, 5] : undefined, fill: d.fill === false ? false : 'origin',
                borderWidth: 2.5, tension: 0.3, pointRadius: 0, pointHoverRadius: 5
            };
        });
        cfgs[canvasId] = cfg;
        let chart = H.charts[canvasId];
        if (!chart) {
            chart = new Chart(canvas.getContext('2d'), {
                type: 'line',
                data: { labels: cfg.labels, datasets: datasets },
                options: {
                    responsive: true, maintainAspectRatio: false, animation: { duration: 400 },
                    interaction: { mode: 'index', intersect: false },
                    scales: {
                        x: { grid: {}, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 10 } },
                        y: { grid: {}, ticks: { callback: function (v) { return cfgDe(canvasId).yFormat ? cfgDe(canvasId).yFormat(v) : i18n.euro(v, 0); } } }
                    },
                    plugins: {
                        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 18 } },
                        tooltip: {
                            padding: 12, cornerRadius: 10, boxPadding: 4, borderWidth: 1,
                            callbacks: {
                                label: function (ctx) {
                                    if (ctx.parsed.y === null) return null;
                                    return ctx.dataset.label + ': ' + (cfgDe(canvasId).tooltipFormat ? cfgDe(canvasId).tooltipFormat(ctx.parsed.y) : i18n.euro(ctx.parsed.y));
                                }
                            }
                        }
                    }
                }
            });
            H.charts[canvasId] = chart;
        } else {
            chart.data.labels = cfg.labels;
            chart.data.datasets = datasets;
        }
        chart.options.scales.y.beginAtZero = cfg.beginAtZero !== false;
        aplicarPaleta(chart);
        chart.update();
        if (cfg.aria) canvas.setAttribute('aria-label', cfg.aria);
    };

    H.refreshCharts = function () {
        Object.keys(H.charts).forEach(function (id) {
            aplicarPaleta(H.charts[id]);
            H.charts[id].update('none');
        });
    };

    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    H.theme.onChange(H.refreshCharts);

    // ---------- Exportação CSV ----------
    H.exports = {};

    function celulaCsv(valor, fmt) {
        if (valor === null || valor === undefined) return '';
        if (typeof valor !== 'number') return String(valor);
        const s = fmt === 'int' ? String(Math.round(valor)) : valor.toFixed(2);
        return i18n.lang === 'pt' ? s.replace('.', ',') : s;
    }

    H.downloadCsv = function (sectionId) {
        const dados = H.exports[sectionId];
        if (!dados || !dados.rows.length) { H.toast(t('err.noexport')); return; }
        const sep = i18n.lang === 'pt' ? ';' : ',';
        const esc = function (s) { return s.indexOf(sep) >= 0 || /["\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
        const linhas = [dados.headers.map(esc).join(sep)].concat(dados.rows.map(function (r) {
            return r.map(function (v, i) { return esc(celulaCsv(v, dados.formats[i])); }).join(sep);
        }));
        const blob = new Blob(['\ufeff' + linhas.join('\r\n')], { type: 'text/csv;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'hamurabi-' + sectionId.replace('calculadora-', '') + '-' + new Date().toISOString().slice(0, 10) + '.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    };

    // ---------- Tabelas com vistas ----------
    const tabelas = {};

    function formatarCelula(valor, fmt) {
        if (valor === null || valor === undefined || valor === '') return '';
        if (fmt === 'euro') return i18n.euro(valor);
        if (fmt === 'pct') return i18n.num(valor, 2);
        if (fmt === 'int') return String(Math.round(valor));
        return String(valor);
    }

    H.initTables = function () {
        document.querySelectorAll('[data-table]').forEach(function (bloco) {
            const sectionId = bloco.closest('section').id;
            bloco.innerHTML =
                '<div class="table-controls">' +
                '<button type="button" class="btn-secondary" data-table-toggle aria-expanded="false"></button>' +
                '<div class="segmented" role="group" data-table-views hidden></div></div>' +
                '<div class="table-container hidden"><table><caption class="sr-only"></caption><thead></thead><tbody></tbody></table></div>';
            const estado = tabelas[sectionId] = { bloco: bloco, views: [], atual: 0, aberta: false };
            bloco.querySelector('[data-table-toggle]').addEventListener('click', function () {
                estado.aberta = !estado.aberta;
                renderTabela(sectionId);
            });
            bloco.querySelector('[data-table-views]').addEventListener('click', function (e) {
                const b = e.target.closest('button[data-view]');
                if (!b) return;
                estado.atual = parseInt(b.dataset.view, 10);
                renderTabela(sectionId);
            });
            renderTabela(sectionId);
        });
    };

    function renderTabela(sectionId) {
        const estado = tabelas[sectionId];
        const bloco = estado.bloco;
        const botao = bloco.querySelector('[data-table-toggle]');
        const seletor = bloco.querySelector('[data-table-views]');
        botao.textContent = t(estado.aberta ? 'tbl.hide' : 'tbl.show');
        botao.setAttribute('aria-expanded', String(estado.aberta));
        bloco.querySelector('.table-container').classList.toggle('hidden', !estado.aberta);
        seletor.hidden = !(estado.aberta && estado.views.length > 1);
        seletor.innerHTML = estado.views.map(function (v, i) {
            return '<button type="button" data-view="' + i + '" aria-pressed="' + (i === estado.atual) + '">' + t(v.label) + '</button>';
        }).join('');
        const view = estado.views[estado.atual];
        if (!view) return;
        bloco.querySelector('caption').textContent = t(view.label);
        bloco.querySelector('thead').innerHTML = '<tr>' + view.columns.map(function (c) { return '<th scope="col">' + t(c.key) + '</th>'; }).join('') + '</tr>';
        const tbody = bloco.querySelector('tbody');
        tbody.innerHTML = '';
        if (!estado.aberta) return;
        const frag = document.createDocumentFragment();
        view.rows.forEach(function (linha) {
            const tr = document.createElement('tr');
            linha.forEach(function (v, i) {
                const td = document.createElement('td');
                td.textContent = formatarCelula(v, view.columns[i].fmt);
                tr.appendChild(td);
            });
            frag.appendChild(tr);
        });
        tbody.appendChild(frag);
    }

    H.setExport = function (sectionId, columns, rows) {
        H.exports[sectionId] = {
            headers: columns.map(function (c) { return t(c.key); }),
            formats: columns.map(function (c) { return c.fmt; }),
            rows: rows
        };
    };

    // views: [{label, columns:[{key, fmt}], rows}]. O CSV usa a última vista (a mais detalhada).
    H.setTable = function (sectionId, views) {
        const estado = tabelas[sectionId];
        if (estado) {
            estado.views = views;
            if (estado.atual >= views.length) estado.atual = 0;
            renderTabela(sectionId);
        }
        const detalhe = views[views.length - 1];
        H.setExport(sectionId, detalhe.columns, detalhe.rows);
    };

    H.anoLabel = function (n) { return t('chart.year', { n: n }); };
})();
