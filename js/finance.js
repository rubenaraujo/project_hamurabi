// Motor de cálculo financeiro (funções puras, sem DOM) — usado pela interface e pelos testes.
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory();
    else root.Finance = factory();
})(typeof self !== 'undefined' ? self : this, function () {
    const EPS = 1e-9;

    function periodosPorAno(frequencia) {
        switch (frequencia) {
            case 'mensal': return 12;
            case 'trimestral': return 4;
            case 'semestral': return 2;
            case 'anual': return 1;
            default: return 12;
        }
    }

    function taxaMensalEfetiva(taxaAnualPct) {
        return Math.pow(1 + taxaAnualPct / 100, 1 / 12) - 1;
    }

    function pmt(capital, taxaMensal, meses) {
        if (meses <= 0) return 0;
        if (Math.abs(taxaMensal) < EPS) return capital / meses;
        return (capital * taxaMensal) / (1 - Math.pow(1 + taxaMensal, -meses));
    }

    function valorReal(valor, inflacaoPct, anos) {
        return valor / Math.pow(1 + inflacaoPct / 100, anos);
    }

    function fatorAcumulacao(taxaPeriodo, periodos) {
        if (Math.abs(taxaPeriodo) < EPS) return periodos;
        return (Math.pow(1 + taxaPeriodo, periodos) - 1) / taxaPeriodo;
    }

    // ---------- Juros compostos ----------
    function jurosCompostos(p) {
        const pc = periodosPorAno(p.frequenciaContribuicao);
        const pj = periodosPorAno(p.frequenciaComposicao);
        const taxaPeriodo = p.taxaAnual / 100 / pj;
        const contribPorPeriodo = p.contribuicao * (pc / pj);
        const inflacao = p.inflacao || 0;

        const fv = function (anos) {
            const n = anos * pj;
            return p.montanteInicial * Math.pow(1 + taxaPeriodo, n) +
                contribPorPeriodo * fatorAcumulacao(taxaPeriodo, n);
        };

        const montanteFinal = fv(p.anos);
        const totalContribuicoes = p.montanteInicial + p.contribuicao * pc * p.anos;
        const resultados = [];
        let anterior = p.montanteInicial;
        for (let ano = 1; ano <= p.anos; ano++) {
            const contribuicoesAno = p.contribuicao * pc;
            const montanteTotal = fv(ano);
            resultados.push({
                ano: ano,
                contribuicoesAno: contribuicoesAno,
                contribuicoesAcumuladas: p.montanteInicial + contribuicoesAno * ano,
                jurosAno: montanteTotal - anterior - contribuicoesAno,
                montanteTotal: montanteTotal,
                montanteReal: valorReal(montanteTotal, inflacao, ano)
            });
            anterior = montanteTotal;
        }
        return {
            montanteFinal: montanteFinal,
            jurosTotais: montanteFinal - totalContribuicoes,
            totalContribuicoes: totalContribuicoes,
            montanteFinalReal: valorReal(montanteFinal, inflacao, p.anos),
            resultados: resultados
        };
    }

    // ---------- Objetivos ----------
    function contribuicaoObjetivo(p) {
        const pc = periodosPorAno(p.frequenciaContribuicao);
        if (!p.compostos) {
            return (p.objetivo - p.montanteInicial) / (p.anos * pc);
        }
        const pj = periodosPorAno(p.frequenciaComposicao);
        const taxaPeriodo = p.taxaAnual / 100 / pj;
        const n = p.anos * pj;
        const adicional = p.objetivo - p.montanteInicial * Math.pow(1 + taxaPeriodo, n);
        if (adicional <= 0) return 0;
        return adicional / fatorAcumulacao(taxaPeriodo, n) / (pc / pj);
    }

    function simularObjetivo(p) {
        const pc = periodosPorAno(p.frequenciaContribuicao);
        if (p.compostos) {
            return jurosCompostos({
                montanteInicial: p.montanteInicial, contribuicao: p.contribuicao,
                frequenciaContribuicao: p.frequenciaContribuicao, frequenciaComposicao: p.frequenciaComposicao,
                taxaAnual: p.taxaAnual, anos: p.anos, inflacao: p.inflacao
            });
        }
        const resultados = [];
        const rendimentoAno = p.montanteInicial * p.taxaAnual / 100;
        for (let ano = 1; ano <= p.anos; ano++) {
            const contribuicoesAno = p.contribuicao * pc;
            const contribuicoesAcumuladas = p.montanteInicial + contribuicoesAno * ano;
            const montanteTotal = contribuicoesAcumuladas + rendimentoAno * ano;
            resultados.push({
                ano: ano, contribuicoesAno: contribuicoesAno, contribuicoesAcumuladas: contribuicoesAcumuladas,
                jurosAno: rendimentoAno, montanteTotal: montanteTotal,
                montanteReal: valorReal(montanteTotal, p.inflacao || 0, ano)
            });
        }
        const ultimo = resultados[resultados.length - 1];
        return {
            montanteFinal: ultimo.montanteTotal,
            jurosTotais: rendimentoAno * p.anos,
            totalContribuicoes: ultimo.contribuicoesAcumuladas,
            resultados: resultados
        };
    }

    // ---------- Crédito: calendário, amortizações extra, taxa variável ----------
    function taxaVariavel(taxaInicial, variacaoPorRevisao, revisaoMeses) {
        return function (mes) {
            return Math.max(0, taxaInicial + variacaoPorRevisao * Math.floor((mes - 1) / revisaoMeses));
        };
    }

    // Calendário sem amortizações extra. A prestação é recalculada sempre que a taxa muda.
    function calendarioCredito(capital, prazoMeses, taxaFn, segurosMensais) {
        const linhas = [];
        let saldo = capital;
        let taxaAtual = null;
        let pagamento = 0;
        for (let m = 1; m <= prazoMeses; m++) {
            const taxaPct = taxaFn(m);
            const taxa = taxaPct / 1200;
            if (taxaAtual === null || taxa !== taxaAtual) {
                pagamento = pmt(saldo, taxa, prazoMeses - m + 1);
                taxaAtual = taxa;
            }
            const juros = saldo * taxa;
            const amortizado = m === prazoMeses ? saldo : pagamento - juros;
            saldo = Math.max(0, saldo - amortizado);
            linhas.push({
                mes: m, taxa: taxaPct, pagamento: pagamento, prestacao: juros + amortizado,
                juros: juros, capital: amortizado, extra: 0, seguros: segurosMensais || 0, saldo: saldo
            });
        }
        return linhas;
    }

    // Mantém a prestação do calendário base e abate amortizações extra (reduz o prazo).
    function calendarioComExtra(capital, base, extraValor, cadenciaMeses) {
        const linhas = [];
        let saldo = capital;
        for (let m = 1; m <= base.length && saldo > 0.005; m++) {
            const taxa = base[m - 1].taxa / 1200;
            const juros = saldo * taxa;
            const prestacao = Math.min(base[m - 1].pagamento, saldo + juros);
            saldo -= prestacao - juros;
            const extra = (extraValor > 0 && m % cadenciaMeses === 0) ? Math.min(extraValor, Math.max(0, saldo)) : 0;
            saldo = Math.max(0, saldo - extra);
            linhas.push({
                mes: m, taxa: base[m - 1].taxa, pagamento: base[m - 1].pagamento, prestacao: prestacao,
                juros: juros, capital: prestacao - juros, extra: extra, seguros: 0, saldo: saldo
            });
        }
        return linhas;
    }

    function totalPago(linhas) {
        return linhas.reduce(function (s, l) { return s + l.prestacao + l.extra; }, 0);
    }

    function agregarAnual(linhas) {
        const anos = [];
        for (let i = 0; i < linhas.length; i += 12) {
            const bloco = linhas.slice(i, i + 12);
            const ultimo = bloco[bloco.length - 1];
            anos.push({
                ano: i / 12 + 1,
                prestacao: bloco[0].pagamento,
                saldo: ultimo.saldo,
                juros: bloco.reduce(function (s, l) { return s + l.juros; }, 0),
                capital: bloco.reduce(function (s, l) { return s + l.capital + l.extra; }, 0),
                seguros: bloco.reduce(function (s, l) { return s + l.seguros; }, 0)
            });
        }
        return anos;
    }

    function simularAmortizacao(p) {
        const prazoMeses = p.prazoAnos * 12;
        const taxaFn = p.tipoTaxa === 'variavel'
            ? taxaVariavel(p.taxaAnual, p.variacaoAnual || 0, 12)
            : function () { return p.taxaAnual; };
        const base = calendarioCredito(p.capital, prazoMeses, taxaFn, 0);
        const comExtra = calendarioComExtra(p.capital, base, p.extraValor, p.cadenciaMeses);
        const pagoBase = totalPago(base);
        const pagoExtra = totalPago(comExtra);
        return {
            base: base, comExtra: comExtra,
            prestacaoInicial: base[0].pagamento,
            totalPagoBase: pagoBase, totalPagoExtra: pagoExtra,
            poupanca: pagoBase - pagoExtra,
            mesesPoupados: prazoMeses - comExtra.length,
            mesesComExtra: comExtra.length
        };
    }

    // Taxa Anual de Encargos Efetiva global: TIR mensal dos fluxos, anualizada.
    function taeg(capitalLiquido, pagamentos) {
        const valorPresente = function (r) {
            let v = 0;
            for (let i = 0; i < pagamentos.length; i++) v += pagamentos[i] / Math.pow(1 + r, i + 1);
            return v - capitalLiquido;
        };
        let lo = 0, hi = 1;
        if (valorPresente(lo) < 0) return 0;
        for (let i = 0; i < 200; i++) {
            const mid = (lo + hi) / 2;
            if (valorPresente(mid) > 0) lo = mid; else hi = mid;
        }
        return (Math.pow(1 + (lo + hi) / 2, 12) - 1) * 100;
    }

    function creditoHabitacao(p) {
        const capital = p.valorImovel * (1 - p.entradaPct / 100);
        const prazoMeses = p.prazoAnos * 12;
        const euriborBase = p.euribor + p.spread;
        const porRevisao = (p.variacaoAnual || 0) * p.revisaoMeses / 12;
        const fixaFn = function () { return p.taxaFixa; };
        const varFn = taxaVariavel(euriborBase, porRevisao, p.revisaoMeses);
        const stressFn = taxaVariavel(euriborBase + p.choque, porRevisao, p.revisaoMeses);

        const fixa = calendarioCredito(capital, prazoMeses, fixaFn, p.seguros);
        const variavel = calendarioCredito(capital, prazoMeses, varFn, p.seguros);
        const stress = calendarioCredito(capital, prazoMeses, stressFn, p.seguros);
        const selecionado = p.tipo === 'fixa' ? fixa : variavel;

        const totalJuros = selecionado.reduce(function (s, l) { return s + l.juros; }, 0);
        const totalSeguros = p.seguros * prazoMeses;
        const pagamentos = selecionado.map(function (l) { return l.prestacao + l.seguros; });
        const stressSel = p.tipo === 'fixa' ? fixa : stress;
        return {
            capital: capital, fixa: fixa, variavel: variavel, stress: stress, selecionado: selecionado,
            prestacaoInicial: selecionado[0].prestacao + selecionado[0].seguros,
            totalJuros: totalJuros, totalSeguros: totalSeguros,
            totalPago: capital + totalJuros + totalSeguros + p.comissoes,
            taeg: taeg(capital - p.comissoes, pagamentos),
            prestacaoStressMax: Math.max.apply(null, stressSel.map(function (l) { return l.prestacao + l.seguros; })),
            prestacaoStressInicial: stressSel[0].prestacao + stressSel[0].seguros
        };
    }

    // ---------- Investir vs. amortizar ----------
    function liquidoAposImposto(valor, investido, impostoPct) {
        return valor - Math.max(0, valor - investido) * impostoPct / 100;
    }

    function investirVsAmortizar(p) {
        const meses = p.prazoAnos * 12;
        const rc = p.taxaCredito / 1200;
        const rm = taxaMensalEfetiva(p.rendimento);
        const prestacao = pmt(p.divida, rc, meses);

        // B: investir (crédito segue o calendário normal)
        let carteiraB = p.unico, investidoB = p.unico, saldoB = p.divida;
        // A: amortizar (excedente do montante único e prestações libertadas vão para a carteira)
        let saldoA = Math.max(0, p.divida - p.unico);
        let carteiraA = Math.max(0, p.unico - p.divida), investidoA = carteiraA;
        const serie = [{
            mes: 0, saldoA: saldoA, carteiraA: carteiraA,
            patrimonioA: liquidoAposImposto(carteiraA, investidoA, p.imposto) - saldoA,
            saldoB: saldoB, carteiraB: carteiraB,
            patrimonioB: liquidoAposImposto(carteiraB, investidoB, p.imposto) - saldoB
        }];

        for (let m = 1; m <= meses; m++) {
            const jurosB = saldoB * rc;
            const pagB = Math.min(prestacao, saldoB + jurosB);
            saldoB = Math.max(0, saldoB + jurosB - pagB);
            carteiraB = carteiraB * (1 + rm) + p.mensal;
            investidoB += p.mensal;

            const jurosA = saldoA * rc;
            const pagA = Math.min(prestacao, saldoA + jurosA);
            saldoA = Math.max(0, saldoA + jurosA - pagA);
            const extra = Math.min(p.mensal, saldoA);
            saldoA -= extra;
            const libertado = (prestacao - pagA) + (p.mensal - extra);
            carteiraA = carteiraA * (1 + rm) + libertado;
            investidoA += libertado;

            serie.push({
                mes: m, saldoA: saldoA, carteiraA: carteiraA,
                patrimonioA: liquidoAposImposto(carteiraA, investidoA, p.imposto) - saldoA,
                saldoB: saldoB, carteiraB: carteiraB,
                patrimonioB: liquidoAposImposto(carteiraB, investidoB, p.imposto) - saldoB
            });
        }
        const fim = serie[serie.length - 1];
        return {
            serie: serie, prestacao: prestacao,
            patrimonioAmortizar: fim.patrimonioA, patrimonioInvestir: fim.patrimonioB,
            diferenca: fim.patrimonioB - fim.patrimonioA,
            melhor: fim.patrimonioB > fim.patrimonioA ? 'investir' : 'amortizar',
            mesesCreditoAmortizar: serie.findIndex(function (s) { return s.saldoA <= 0.005; })
        };
    }

    // Rendimento anual do investimento para o qual investir e amortizar empatam.
    function rendimentoEquilibrio(p) {
        const dif = function (r) {
            const x = investirVsAmortizar(Object.assign({}, p, { rendimento: r }));
            return x.diferenca;
        };
        if (dif(0) >= 0) return 0;
        if (dif(40) < 0) return null;
        let lo = 0, hi = 40;
        for (let i = 0; i < 60; i++) {
            const mid = (lo + hi) / 2;
            if (dif(mid) < 0) lo = mid; else hi = mid;
        }
        return (lo + hi) / 2;
    }

    // ---------- Reforma ----------
    function reforma(p) {
        const n1 = Math.round((p.idadeReforma - p.idade) * 12);
        const n2 = Math.round((p.esperanca - p.idadeReforma) * 12);
        const rm = taxaMensalEfetiva(p.rendimento);
        const rr = taxaMensalEfetiva(p.rendimentoReforma);
        const im = taxaMensalEfetiva(p.inflacao);
        const inflAnual = 1 + p.inflacao / 100;

        const acumular = function (contrib, poupanca, guardarSerie) {
            let v = poupanca;
            const pontos = [v];
            for (let m = 1; m <= n1; m++) {
                const c = p.indexar ? contrib * Math.pow(inflAnual, Math.floor((m - 1) / 12)) : contrib;
                v = v * (1 + rm) + c;
                if (guardarSerie && m % 12 === 0) pontos.push(v);
            }
            return { valor: v, pontos: pontos };
        };

        const base = acumular(0, p.poupanca, false).valor;
        const fatorContrib = acumular(1, 0, false).valor;
        const real = acumular(p.contribuicao, p.poupanca, true);
        const capital = real.valor;

        const gastoInicial = Math.max(0, p.desejado - p.pensao) * Math.pow(1 + im, n1);
        let fator = 0;
        for (let m = 0; m < n2; m++) fator += Math.pow((1 + im) / (1 + rr), m);
        const capitalNecessario = gastoInicial * fator;

        // Evolução do capital durante a reforma, com o gasto desejado.
        let v = capital;
        let mesEsgota = null;
        const levantamentos = [capital];
        for (let m = 0; m < n2; m++) {
            v -= gastoInicial * Math.pow(1 + im, m);
            if (v < 0 && mesEsgota === null) { mesEsgota = m; v = 0; }
            v *= (1 + rr);
            if ((m + 1) % 12 === 0) levantamentos.push(v);
        }

        const deflacionar = function (valor, anos) { return valor / Math.pow(inflAnual, anos); };
        const serie = [];
        real.pontos.forEach(function (valor, i) {
            serie.push({ idade: p.idade + i, capitalReal: deflacionar(valor, i) });
        });
        levantamentos.slice(1).forEach(function (valor, i) {
            serie.push({ idade: p.idadeReforma + i + 1, capitalReal: deflacionar(valor, n1 / 12 + i + 1) });
        });

        const rendaSustentavelNominal = fator > 0 ? capital / fator : 0;
        return {
            capital: capital,
            capitalReal: deflacionar(capital, n1 / 12),
            capitalNecessario: capitalNecessario,
            capitalNecessarioReal: deflacionar(capitalNecessario, n1 / 12),
            rendaSustentavel: deflacionar(rendaSustentavelNominal, n1 / 12) + p.pensao,
            contribuicaoNecessaria: Math.max(0, (capitalNecessario - base) / fatorContrib),
            idadeEsgota: mesEsgota === null ? null : p.idadeReforma + mesEsgota / 12,
            diferenca: capital - capitalNecessario,
            serie: serie
        };
    }

    // ---------- Fundo de emergência ----------
    function fundoEmergencia(p) {
        const meta = p.despesas * p.meses;
        const rm = taxaMensalEfetiva(p.rendimento);
        let v = p.atual;
        let mesMeta = v >= meta ? 0 : null;
        const serie = [v];
        for (let m = 1; m <= 1200; m++) {
            v = v * (1 + rm) + p.mensal;
            serie.push(v);
            if (mesMeta === null && v >= meta) mesMeta = m;
            if (mesMeta !== null && m >= mesMeta + 6) break;
            if (mesMeta === null && m >= 600) break;
        }
        return {
            meta: meta,
            falta: Math.max(0, meta - p.atual),
            progresso: meta > 0 ? Math.min(1, p.atual / meta) : 1,
            coberturaAtual: p.despesas > 0 ? p.atual / p.despesas : 0,
            mesesAteMeta: mesMeta,
            serie: serie
        };
    }

    return {
        periodosPorAno: periodosPorAno, taxaMensalEfetiva: taxaMensalEfetiva, pmt: pmt, valorReal: valorReal,
        jurosCompostos: jurosCompostos, contribuicaoObjetivo: contribuicaoObjetivo, simularObjetivo: simularObjetivo,
        taxaVariavel: taxaVariavel, calendarioCredito: calendarioCredito, calendarioComExtra: calendarioComExtra,
        agregarAnual: agregarAnual, simularAmortizacao: simularAmortizacao, taeg: taeg,
        creditoHabitacao: creditoHabitacao, investirVsAmortizar: investirVsAmortizar,
        rendimentoEquilibrio: rendimentoEquilibrio, reforma: reforma, fundoEmergencia: fundoEmergencia
    };
});
