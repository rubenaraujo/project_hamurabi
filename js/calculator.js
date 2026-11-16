// Ferramentas: amortização de crédito, juros compostos e objetivos financeiros.
(function () {
    const H = window.Hamurabi;
    const F = window.Finance || window.Hamurabi.Finance;
    const t = i18n.t;
    const euro = i18n.euro;

    const CADENCIA = { mensal: 1, trimestral: 3, semestral: 6, anual: 12 };
    const anosLabels = function (n) {
        const l = [];
        for (let a = 0; a <= n; a++) l.push(H.anoLabel(a));
        return l;
    };

    // ---------- Amortização ----------
    H.registerTool({
        section: 'calculadora-amortizacao',
        calcular: function () {
            const r = F.simularAmortizacao({
                capital: H.num('montanteInicial'), taxaAnual: H.num('taxaJuro'), prazoAnos: H.int('prazoAnos'),
                tipoTaxa: H.str('tipoTaxaAmortizacao'), variacaoAnual: H.num('variacaoTaxaAmortizacao'),
                extraValor: H.num('amortizacaoRegular'), cadenciaMeses: CADENCIA[H.str('frequenciaAmortizacao')]
            });
            H.setText('poupancaTotal', euro(r.poupanca));
            H.setText('reducaoPrazo', r.mesesPoupados > 0 ? i18n.dur(r.mesesPoupados) : '0');
            H.setText('tempoPoupado', r.mesesPoupados > 0
                ? t('amort.insight', { dur: i18n.dur(r.mesesPoupados), depois: euro(r.totalPagoExtra), antes: euro(r.totalPagoBase) })
                : t('amort.none', { dur: i18n.dur(r.base.length), antes: euro(r.totalPagoBase) }));

            const anual = F.agregarAnual(r.comExtra);
            const anualBase = F.agregarAnual(r.base);
            const capital = H.num('montanteInicial');
            const saldoBase = [capital].concat(anualBase.map(function (a) { return a.saldo; }));
            const saldoExtra = [capital].concat(anualBase.map(function (a, i) { return anual[i] ? anual[i].saldo : 0; }));
            H.chart('amortizacaoChart', {
                labels: anosLabels(anualBase.length),
                datasets: [
                    { label: t('ch.noExtra'), data: saldoBase, role: 'red', fill: false, dashed: true },
                    { label: t('ch.extra'), data: saldoExtra, role: 'gold' }
                ],
                aria: t('aria.amort')
            });

            H.setTable('calculadora-amortizacao', [
                {
                    label: 'tbl.v.anual',
                    columns: [{ key: 'c.year', fmt: 'int' }, { key: 'c.payment', fmt: 'euro' }, { key: 'c.interest', fmt: 'euro' }, { key: 'c.principal', fmt: 'euro' }, { key: 'c.balance', fmt: 'euro' }],
                    rows: anual.map(function (a) { return [a.ano, a.prestacao, a.juros, a.capital, a.saldo]; })
                },
                {
                    label: 'tbl.v.mensal',
                    columns: [{ key: 'c.month', fmt: 'int' }, { key: 'c.rate', fmt: 'pct' }, { key: 'c.payment', fmt: 'euro' }, { key: 'c.interest', fmt: 'euro' }, { key: 'c.principal', fmt: 'euro' }, { key: 'c.extra', fmt: 'euro' }, { key: 'c.balance', fmt: 'euro' }],
                    rows: r.comExtra.map(function (l) { return [l.mes, l.taxa, l.prestacao, l.juros, l.capital, l.extra, l.saldo]; })
                }
            ]);
        }
    });

    // ---------- Juros compostos ----------
    function paramsJuros(sufixo) {
        return {
            montanteInicial: H.num('montanteInicialJuros'),
            contribuicao: sufixo ? H.num('contribuicaoRegularB') : H.num('contribuicaoRegular'),
            frequenciaContribuicao: H.str('frequenciaContribuicao'),
            frequenciaComposicao: H.str('frequenciaComposicaoJuros'),
            taxaAnual: sufixo ? H.num('taxaJurosB') : H.num('taxaJurosAnual'),
            anos: H.int('periodoAnos'),
            inflacao: H.num('inflacaoJuros')
        };
    }

    H.registerTool({
        section: 'calculadora-juros',
        calcular: function () {
            const p = paramsJuros(false);
            const r = F.jurosCompostos(p);
            H.setText('montanteFinal', euro(r.montanteFinal));
            H.setText('jurosGanhos', euro(r.jurosTotais));
            H.setText('montanteFinalReal', euro(r.montanteFinalReal));

            const comparar = H.checked('compararJuros');
            const b = comparar ? F.jurosCompostos(paramsJuros(true)) : null;
            if (b) {
                H.setText('montanteFinalB', euro(b.montanteFinal));
                const d = b.montanteFinal - r.montanteFinal;
                H.setText('montanteFinalBSub', t('juros.subB', { v: (d >= 0 ? '+' : '−') + euro(Math.abs(d)) }));
            }

            const serie = function (res, campo, inicio) { return [inicio].concat(res.resultados.map(function (x) { return x[campo]; })); };
            const datasets = [
                { label: t('ch.contrib'), data: serie(r, 'contribuicoesAcumuladas', p.montanteInicial), role: 'blue', fill: false },
                { label: t('ch.total'), data: serie(r, 'montanteTotal', p.montanteInicial), role: 'gold' }
            ];
            if (p.inflacao > 0) datasets.push({ label: t('ch.real'), data: serie(r, 'montanteReal', p.montanteInicial), role: 'green', fill: false, dashed: true });
            if (b) datasets.push({ label: t('ch.scenarioB'), data: serie(b, 'montanteTotal', p.montanteInicial), role: 'alt', fill: false });
            H.chart('jurosCompostosChart', { labels: anosLabels(p.anos), datasets: datasets, aria: t('aria.juros') });

            H.setTable('calculadora-juros', [{
                label: 'tbl.v.anual',
                columns: [{ key: 'c.year', fmt: 'int' }, { key: 'c.contribYear', fmt: 'euro' }, { key: 'c.contribAcc', fmt: 'euro' }, { key: 'c.interestYear', fmt: 'euro' }, { key: 'c.total', fmt: 'euro' }, { key: 'c.real', fmt: 'euro' }],
                rows: r.resultados.map(function (x) { return [x.ano, x.contribuicoesAno, x.contribuicoesAcumuladas, x.jurosAno, x.montanteTotal, x.montanteReal]; })
            }]);
        }
    });

    // ---------- Objetivos ----------
    H.registerTool({
        section: 'calculadora-objetivos',
        calcular: function () {
            const anos = H.int('prazoObjetivo');
            const inflacao = H.num('inflacaoObjetivo');
            const objetivoReal = H.num('montanteObjetivo');
            const nominal = objetivoReal * Math.pow(1 + inflacao / 100, anos);
            const base = {
                montanteInicial: H.num('montanteInicialObjetivo'), anos: anos,
                frequenciaContribuicao: H.str('frequenciaContribuicaoObjetivo'),
                frequenciaComposicao: H.str('frequenciaComposicaoJurosObjetivo'),
                taxaAnual: H.num('taxaJuroObjetivo'), compostos: H.checked('jurosCompostosObjetivo'), inflacao: inflacao
            };
            const contrib = Math.max(0, F.contribuicaoObjetivo(Object.assign({ objetivo: nominal }, base)));
            const r = F.simularObjetivo(Object.assign({ contribuicao: contrib }, base));

            H.setText('contribuicaoNecessaria', euro(contrib));
            H.setText('contribuicaoNecessariaSub', t('obj.sub.' + base.frequenciaContribuicao));
            H.setText('montanteTotalPoupado', euro(r.montanteFinal));
            H.setText('objetivoInsight', inflacao > 0
                ? t('obj.insight', { real: euro(objetivoReal, 0), anos: anos, nominal: euro(nominal, 0) })
                : t('obj.insight.simple', { real: euro(objetivoReal, 0) }));

            const serie = function (campo) { return [base.montanteInicial].concat(r.resultados.map(function (x) { return x[campo]; })); };
            H.chart('objetivosChart', {
                labels: anosLabels(anos),
                datasets: [
                    { label: t('ch.contrib'), data: serie('contribuicoesAcumuladas'), role: 'blue', fill: false },
                    { label: t('ch.total'), data: serie('montanteTotal'), role: 'gold' },
                    { label: t('ch.target'), data: anosLabels(anos).map(function () { return nominal; }), role: 'green', fill: false, dashed: true }
                ],
                aria: t('aria.obj')
            });

            H.setExport('calculadora-objetivos',
                [{ key: 'c.year', fmt: 'int' }, { key: 'c.contribYear', fmt: 'euro' }, { key: 'c.contribAcc', fmt: 'euro' }, { key: 'c.interestYear', fmt: 'euro' }, { key: 'c.total', fmt: 'euro' }],
                r.resultados.map(function (x) { return [x.ano, x.contribuicoesAno, x.contribuicoesAcumuladas, x.jurosAno, x.montanteTotal]; }));
        }
    });
})();
