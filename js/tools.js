// Ferramentas: crédito habitação, investir vs amortizar, reforma e fundo de emergência.
(function () {
    const H = window.Hamurabi;
    const F = window.Finance;
    const t = i18n.t;
    const euro = i18n.euro;

    // ---------- Crédito habitação ----------
    H.registerTool({
        section: 'calculadora-habitacao',
        calcular: function () {
            const tipo = H.str('habTipo');
            const choque = H.num('habChoque');
            const r = F.creditoHabitacao({
                valorImovel: H.num('habValor'), entradaPct: H.num('habEntrada'), prazoAnos: H.int('habPrazo'),
                tipo: tipo, taxaFixa: H.num('habTaxaFixa'), euribor: H.num('habEuribor'), spread: H.num('habSpread'),
                revisaoMeses: H.int('habRevisao'), variacaoAnual: H.num('habVariacao'), choque: choque,
                seguros: H.num('habSeguros'), comissoes: H.num('habComissoes')
            });
            H.setText('habPrestacao', euro(r.prestacaoInicial));
            H.setText('habPrestacaoSub', t('res.capital', { v: euro(r.capital, 0) }));
            H.setText('habTotalJuros', euro(r.totalJuros));
            H.setText('habTaeg', i18n.pct(r.taeg));
            H.setText('habStress', euro(r.prestacaoStressInicial));
            H.setText('habStressSub', tipo === 'fixa' ? t('res.fixa.stress') : t('res.max', { v: euro(r.prestacaoStressMax) }));
            H.setText('habInsight', t(tipo === 'fixa' ? 'hab.insight.fixa' : 'hab.insight', {
                total: euro(r.totalPago, 0), choque: i18n.num(choque, 2), atual: euro(r.prestacaoInicial), stress: euro(r.prestacaoStressInicial)
            }));

            const anual = F.agregarAnual(r.selecionado);
            const porAno = function (linhas) {
                return anual.map(function (a, i) { return linhas[i * 12].prestacao + linhas[i * 12].seguros; });
            };
            const datasets = [{ label: t(tipo === 'fixa' ? 'ch.fixed' : 'ch.variable'), data: porAno(r.selecionado), role: 'gold' }];
            if (tipo === 'variavel') datasets.push({ label: t('ch.stress'), data: porAno(r.stress), role: 'red', fill: false, dashed: true });
            H.chart('habChart', {
                labels: anual.map(function (a) { return H.anoLabel(a.ano); }),
                datasets: datasets, beginAtZero: false, aria: t('aria.hab')
            });

            const seg = r.selecionado[0].seguros;
            H.setTable('calculadora-habitacao', [
                {
                    label: 'tbl.v.anual',
                    columns: [{ key: 'c.year', fmt: 'int' }, { key: 'c.payment', fmt: 'euro' }, { key: 'c.interest', fmt: 'euro' }, { key: 'c.principal', fmt: 'euro' }, { key: 'c.insurance', fmt: 'euro' }, { key: 'c.balance', fmt: 'euro' }],
                    rows: anual.map(function (a) { return [a.ano, a.prestacao + seg, a.juros, a.capital, a.seguros, a.saldo]; })
                },
                {
                    label: 'tbl.v.mensal',
                    columns: [{ key: 'c.month', fmt: 'int' }, { key: 'c.rate', fmt: 'pct' }, { key: 'c.payment', fmt: 'euro' }, { key: 'c.interest', fmt: 'euro' }, { key: 'c.principal', fmt: 'euro' }, { key: 'c.insurance', fmt: 'euro' }, { key: 'c.balance', fmt: 'euro' }],
                    rows: r.selecionado.map(function (l) { return [l.mes, l.taxa, l.prestacao + l.seguros, l.juros, l.capital, l.seguros, l.saldo]; })
                }
            ]);
        }
    });

    // ---------- Investir vs amortizar ----------
    H.registerTool({
        section: 'calculadora-investir-amortizar',
        calcular: function () {
            const p = {
                divida: H.num('ivaDivida'), taxaCredito: H.num('ivaTaxa'), prazoAnos: H.int('ivaPrazo'),
                unico: H.num('ivaUnico'), mensal: H.num('ivaMensal'), rendimento: H.num('ivaRend'), imposto: H.num('ivaImposto')
            };
            const r = F.investirVsAmortizar(p);
            const be = F.rendimentoEquilibrio(p);
            H.setText('ivaVeredito', t('iva.' + r.melhor));
            H.setText('ivaVereditoSub', t('iva.sub', { v: euro(Math.abs(r.diferenca)) }));
            H.setText('ivaPatA', euro(r.patrimonioAmortizar));
            H.setText('ivaPatB', euro(r.patrimonioInvestir));
            H.setText('ivaBreakeven', be === null ? t('iva.nobe') : i18n.pct(be));
            H.setText('ivaInsight', t('iva.insight', { p: euro(r.prestacao), dur: i18n.dur(Math.max(0, r.mesesCreditoAmortizar)) }));

            const anuais = r.serie.filter(function (s) { return s.mes % 12 === 0; });
            H.chart('ivaChart', {
                labels: anuais.map(function (s) { return H.anoLabel(s.mes / 12); }),
                datasets: [
                    { label: t('ch.patA'), data: anuais.map(function (s) { return s.patrimonioA; }), role: 'blue', fill: false },
                    { label: t('ch.patB'), data: anuais.map(function (s) { return s.patrimonioB; }), role: 'gold' }
                ],
                beginAtZero: false, aria: t('aria.iva')
            });

            const colunas = function (primeira) {
                return [{ key: primeira, fmt: 'int' }, { key: 'c.debtA', fmt: 'euro' }, { key: 'c.portA', fmt: 'euro' }, { key: 'c.patA', fmt: 'euro' }, { key: 'c.debtB', fmt: 'euro' }, { key: 'c.portB', fmt: 'euro' }, { key: 'c.patB', fmt: 'euro' }];
            };
            const linha = function (s, n) { return [n, s.saldoA, s.carteiraA, s.patrimonioA, s.saldoB, s.carteiraB, s.patrimonioB]; };
            H.setTable('calculadora-investir-amortizar', [
                { label: 'tbl.v.anual', columns: colunas('c.year'), rows: anuais.map(function (s) { return linha(s, s.mes / 12); }) },
                { label: 'tbl.v.mensal', columns: colunas('c.month'), rows: r.serie.map(function (s) { return linha(s, s.mes); }) }
            ]);
        }
    });

    // ---------- Reforma ----------
    H.registerTool({
        section: 'calculadora-reforma',
        calcular: function () {
            const idade = H.num('refIdade'), idadeReforma = H.num('refIdadeReforma'), esperanca = H.num('refEsperanca');
            if (!(idade < idadeReforma && idadeReforma < esperanca)) {
                H.showError('calculadora-reforma', t('err.ages'));
                return false;
            }
            H.showError('calculadora-reforma', '');
            const inflacao = H.num('refInflacao');
            const r = F.reforma({
                idade: idade, idadeReforma: idadeReforma, esperanca: esperanca,
                poupanca: H.num('refPoupanca'), contribuicao: H.num('refContrib'), indexar: H.checked('refIndexar'),
                rendimento: H.num('refRend'), rendimentoReforma: H.num('refRendReforma'), inflacao: inflacao,
                desejado: H.num('refDesejado'), pensao: H.num('refPensao')
            });
            H.setText('refCapital', euro(r.capital, 0));
            H.setText('refCapitalSub', t('ref.sub', { v: euro(r.capitalReal, 0) }));
            H.setText('refNecessario', euro(r.capitalNecessarioReal, 0));
            H.setText('refRenda', euro(r.rendaSustentavel, 0));
            H.setText('refContribNec', euro(r.contribuicaoNecessaria));

            const difReal = r.capitalReal - r.capitalNecessarioReal;
            let insight;
            if (difReal >= 0) insight = t('ref.insight.ok', { d: euro(difReal, 0), idade: esperanca });
            else if (r.idadeEsgota !== null) insight = t('ref.insight.short', { d: euro(-difReal, 0), idade: i18n.num(r.idadeEsgota, 0) });
            else insight = t('ref.insight.short2', { d: euro(-difReal, 0) });
            H.setText('refInsight', insight);

            H.chart('refChart', {
                labels: r.serie.map(function (s) { return t('chart.age', { n: i18n.num(s.idade, 0) }); }),
                datasets: [
                    { label: t('ch.capital'), data: r.serie.map(function (s) { return s.capitalReal; }), role: 'gold' },
                    { label: t('r.refNecessario'), data: r.serie.map(function () { return r.capitalNecessarioReal; }), role: 'green', fill: false, dashed: true }
                ],
                aria: t('aria.ref')
            });
            H.setTable('calculadora-reforma', [{
                label: 'tbl.v.anual',
                columns: [{ key: 'c.age', fmt: 'int' }, { key: 'c.capital', fmt: 'euro' }],
                rows: r.serie.map(function (s) { return [s.idade, s.capitalReal]; })
            }]);
        }
    });

    // ---------- Fundo de emergência ----------
    H.registerTool({
        section: 'calculadora-emergencia',
        calcular: function () {
            const despesas = H.num('funDespesas');
            const r = F.fundoEmergencia({
                despesas: despesas, meses: H.num('funMeses'), atual: H.num('funAtual'),
                mensal: H.num('funMensal'), rendimento: H.num('funRend')
            });
            H.setText('funMeta', euro(r.meta, 0));
            H.setText('funFalta', euro(r.falta, 0));
            H.setText('funCobertura', t('fun.months', { n: i18n.num(r.coberturaAtual, 1) }));
            const pct = Math.round(r.progresso * 100);
            H.$('funProgressoBar').style.width = pct + '%';
            H.$('funProgresso').setAttribute('aria-valuenow', String(pct));
            H.$('funProgresso').setAttribute('aria-valuetext', pct + ' %');

            const n = r.mesesAteMeta;
            const alvoLongo = n === null || n > 600;
            H.setText('funTempo', n === 0 ? t('fun.done') : alvoLongo ? t('fun.never') : i18n.dur(n));
            const cob = i18n.num(r.coberturaAtual, 1);
            H.setText('funInsight', n === 0 ? t('fun.insight.done', { n: cob })
                : alvoLongo ? t('fun.insight.never')
                    : t('fun.insight', { mensal: euro(H.num('funMensal'), 0), dur: i18n.dur(n), n: cob }));

            H.chart('funChart', {
                labels: r.serie.map(function (_, i) { return t('chart.month', { n: i }); }),
                datasets: [
                    { label: t('ch.fund'), data: r.serie, role: 'gold' },
                    { label: t('ch.goal'), data: r.serie.map(function () { return r.meta; }), role: 'green', fill: false, dashed: true }
                ],
                aria: t('aria.fun')
            });
            H.setTable('calculadora-emergencia', [{
                label: 'tbl.v.mensal',
                columns: [{ key: 'c.month', fmt: 'int' }, { key: 'c.fund', fmt: 'euro' }],
                rows: r.serie.map(function (v, i) { return [i, v]; })
            }]);
        }
    });
})();
