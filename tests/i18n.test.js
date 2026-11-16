const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const i18n = require('../js/i18n.js');

const raiz = path.join(__dirname, '..');
const ler = (f) => fs.readFileSync(path.join(raiz, f), 'utf8');

test('i18n: todas as chaves têm PT e EN', () => {
    Object.keys(i18n.dict).forEach((k) => {
        assert.ok(i18n.dict[k][0] && i18n.dict[k][1], 'falta tradução: ' + k);
    });
});

test('i18n: chaves usadas em HTML e JS existem no dicionário', () => {
    const usadas = new Set();
    ['index.html', 'legal.html'].forEach((f) => {
        const html = ler(f);
        for (const m of html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)) usadas.add(m[1]);
        for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
            m[1].split(';').forEach((p) => usadas.add(p.slice(p.indexOf(':') + 1)));
        }
        for (const m of html.matchAll(/<option[^>]*data-i18n="([^"]+)"/g)) usadas.add(m[1]);
    });
    ['core.js', 'tools.js', 'calculator.js', 'features.js'].forEach((f) => {
        for (const m of ler('js/' + f).matchAll(/\bt\('([a-zA-Z0-9_.]+)'/g)) usadas.add(m[1]);
        for (const m of ler('js/' + f).matchAll(/(?:key|label): '([a-z]+\.[a-zA-Z0-9_.]+)'/g)) usadas.add(m[1]);
    });
    // Prefixos dinâmicos (ex.: 'iva.' + melhor) são validados em separado.
    ['investir', 'amortizar'].forEach((o) => usadas.add('iva.' + o));
    ['anual', 'semestral', 'trimestral', 'mensal'].forEach((o) => usadas.add('obj.sub.' + o));
    const faltam = [...usadas].filter((k) => !k.endsWith('.') && !i18n.dict[k]);
    assert.deepStrictEqual(faltam, []);
});

test('i18n: duração em português e inglês', () => {
    i18n.lang = 'pt';
    assert.strictEqual(i18n.dur(105), '8 anos e 9 meses');
    assert.strictEqual(i18n.dur(12), '1 ano');
    i18n.lang = 'en';
    assert.strictEqual(i18n.dur(13), '1 year and 1 month');
});
