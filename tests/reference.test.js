// Validação independente: fórmulas fechadas e simulações de referência escritas à parte do motor.
const test = require('node:test');
const assert = require('node:assert/strict');
const F = require('../js/finance.js');

const perto = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} não está perto de ${b}`);
const prestacao = (capital, tanPct, meses) => {
    const r = tanPct / 1200;
    return r === 0 ? capital / meses : capital * r / (1 - Math.pow(1 + r, -meses));
};

test('prestação: valores de tabela conhecidos', () => {
    perto(prestacao(100000, 5, 240), 659.96);
    perto(prestacao(200000, 3.5, 360), 898.09);
    perto(F.pmt(200000, 0.035 / 12, 360), 898.09);
});

test('crédito habitação (fixa): prestação, juros e TAEG pela fórmula fechada', () => {
    const r = F.creditoHabitacao({
        valorImovel: 250000, entradaPct: 20, prazoAnos: 30, tipo: 'fixa', taxaFixa: 3.5, euribor: 2, spread: 1,
        revisaoMeses: 12, variacaoAnual: 0, choque: 2, seguros: 0, comissoes: 0
    });
    const pm = prestacao(200000, 3.5, 360);
    perto(r.prestacaoInicial, pm);
    perto(r.totalJuros, pm * 360 - 200000);
    perto(r.taeg, (Math.pow(1 + 0.035 / 12, 12) - 1) * 100, 1e-6);
    perto(r.prestacaoStressInicial, pm);
});

test('crédito habitação (variável): simulação independente com revisão anual', () => {
    const p = {
        valorImovel: 250000, entradaPct: 20, prazoAnos: 30, tipo: 'variavel', taxaFixa: 3.5, euribor: 2.2, spread: 1,
        revisaoMeses: 12, variacaoAnual: 0.1, choque: 2, seguros: 40, comissoes: 600
    };
    const r = F.creditoHabitacao(p);
    let saldo = 200000, juros = 0, primeira = 0, ultima = 0;
    for (let m = 1; m <= 360; m++) {
        const taxa = (3.2 + 0.1 * Math.floor((m - 1) / 12)) / 1200;
        const pm = (m - 1) % 12 === 0 ? saldo * taxa / (1 - Math.pow(1 + taxa, -(360 - m + 1))) : ultima;
        ultima = pm;
        if (m === 1) primeira = pm;
        const j = saldo * taxa;
        juros += j;
        saldo -= pm - j;
    }
    perto(saldo, 0, 1e-4);
    perto(r.prestacaoInicial, primeira + 40);
    perto(r.totalJuros, juros);
    perto(r.totalPago, 200000 + juros + 40 * 360 + 600);
    const euribor2 = F.creditoHabitacao({ ...p, choque: 2 });
    assert.ok(euribor2.prestacaoStressInicial > r.prestacaoInicial);
});

test('TAEG: caso analítico e valor atual dos fluxos igual ao capital líquido', () => {
    perto(F.taeg(1000, [1100]), (Math.pow(1.1, 12) - 1) * 100, 1e-4);
    const pm = prestacao(100000, 4, 240) + 30;
    const pagamentos = Array(240).fill(pm);
    const t = F.taeg(100000 - 500, pagamentos);
    const r = Math.pow(1 + t / 100, 1 / 12) - 1;
    let vp = 0;
    pagamentos.forEach((x, i) => { vp += x / Math.pow(1 + r, i + 1); });
    perto(vp, 99500, 0.01);
});

test('amortização: poupança coerente com simulação independente', () => {
    const r = F.simularAmortizacao({ capital: 150000, taxaAnual: 3.5, prazoAnos: 30, tipoTaxa: 'fixa', extraValor: 2000, cadenciaMeses: 12 });
    const pm = prestacao(150000, 3.5, 360);
    const i = 3.5 / 1200;
    let saldo = 150000, pago = 0, meses = 0;
    while (saldo > 0.005 && meses < 360) {
        meses++;
        const j = saldo * i;
        const p = Math.min(pm, saldo + j);
        saldo -= p - j; pago += p;
        if (meses % 12 === 0) { const e = Math.min(2000, saldo); saldo -= e; pago += e; }
    }
    assert.equal(r.mesesComExtra, meses);
    perto(r.totalPagoExtra, pago);
    perto(r.totalPagoBase, pm * 360);
    perto(r.poupanca, pm * 360 - pago);
});

test('juros compostos: anuidade com contribuição no fim do período e valor real', () => {
    const r = F.jurosCompostos({ montanteInicial: 0, contribuicao: 100, frequenciaContribuicao: 'mensal', frequenciaComposicao: 'mensal', taxaAnual: 6, anos: 10, inflacao: 2 });
    const i = 0.06 / 12;
    const fv = 100 * (Math.pow(1 + i, 120) - 1) / i;
    perto(r.montanteFinal, fv, 0.5);
    perto(r.montanteFinalReal, fv / Math.pow(1.02, 10), 0.5);
});

test('fundo de emergência: nº de meses pela fórmula do logaritmo', () => {
    const p = { despesas: 1200, meses: 6, atual: 3000, mensal: 200, rendimento: 1.5 };
    const r = F.fundoEmergencia(p);
    const i = Math.pow(1.015, 1 / 12) - 1;
    const meta = 7200;
    const n = Math.log((meta * i + 200) / (3000 * i + 200)) / Math.log(1 + i);
    assert.equal(r.mesesAteMeta, Math.ceil(n));
    perto(r.coberturaAtual, 2.5, 1e-9);
});

test('reforma: casos sem rendimentos e anuidade antecipada', () => {
    const base = { idade: 30, idadeReforma: 65, esperanca: 85, poupanca: 10000, contribuicao: 300, rendimento: 0, rendimentoReforma: 0, inflacao: 0, desejado: 1500, pensao: 500, indexar: false };
    const r = F.reforma(base);
    perto(r.capital, 10000 + 300 * 35 * 12);
    perto(r.capitalNecessario, 1000 * 20 * 12);
    perto(r.contribuicaoNecessaria, Math.max(0, (240000 - 10000) / 420));

    const c = F.reforma({ ...base, rendimentoReforma: 3 });
    const i = Math.pow(1.03, 1 / 12) - 1;
    perto(c.capitalNecessario, 1000 * (1 - Math.pow(1 + i, -240)) / i * (1 + i), 0.01);
});

test('investir vs. amortizar: sem rendimento nem impostos, a diferença é a poupança em juros', () => {
    const p = { divida: 100000, taxaCredito: 4, prazoAnos: 20, unico: 20000, mensal: 0, rendimento: 0, imposto: 0 };
    const r = F.investirVsAmortizar(p);
    const i = 0.04 / 12, pm = prestacao(100000, 4, 240);
    const jurosB = pm * 240 - 100000;
    let saldo = 80000, jurosA = 0;
    for (let m = 0; m < 240 && saldo > 0.005; m++) {
        const j = saldo * i;
        jurosA += j;
        saldo -= Math.min(pm, saldo + j) - j;
    }
    perto(r.patrimonioAmortizar - r.patrimonioInvestir, jurosB - jurosA, 0.5);
});
