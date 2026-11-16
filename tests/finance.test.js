const test = require('node:test');
const assert = require('node:assert/strict');
const F = require('../js/finance.js');

const perto = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} não está perto de ${b}`);

test('juros compostos: valores de referência e ordem das frequências de composição', () => {
    const base = { montanteInicial: 10000, contribuicao: 200, frequenciaContribuicao: 'mensal', taxaAnual: 5, anos: 20 };
    const f = (c) => F.jurosCompostos({ ...base, frequenciaComposicao: c }).montanteFinal;
    perto(f('mensal'), 109333.14);
    assert.ok(f('mensal') > f('trimestral') && f('trimestral') > f('semestral') && f('semestral') > f('anual'));
});

test('juros compostos: sem contribuições e taxa 0', () => {
    const semContrib = F.jurosCompostos({ montanteInicial: 10000, contribuicao: 0, frequenciaContribuicao: 'mensal', frequenciaComposicao: 'anual', taxaAnual: 5, anos: 20 });
    perto(semContrib.montanteFinal, 10000 * Math.pow(1.05, 20));
    const zero = F.jurosCompostos({ montanteInicial: 1000, contribuicao: 100, frequenciaContribuicao: 'mensal', frequenciaComposicao: 'mensal', taxaAnual: 0, anos: 2 });
    perto(zero.montanteFinal, 3400);
    assert.equal(zero.jurosTotais, 0);
});

test('juros compostos: valor real deflaciona pela inflação', () => {
    const r = F.jurosCompostos({ montanteInicial: 1000, contribuicao: 0, frequenciaContribuicao: 'anual', frequenciaComposicao: 'anual', taxaAnual: 0, anos: 10, inflacao: 2 });
    perto(r.montanteFinalReal, 1000 / Math.pow(1.02, 10));
});

test('objetivos: a contribuição calculada atinge o objetivo', () => {
    const p = { objetivo: 100000, montanteInicial: 10000, anos: 10, taxaAnual: 4, frequenciaContribuicao: 'mensal', frequenciaComposicao: 'mensal', compostos: true };
    const contribuicao = F.contribuicaoObjetivo(p);
    perto(contribuicao, 577.87);
    perto(F.simularObjetivo({ ...p, contribuicao }).montanteFinal, 100000);
    const simples = F.contribuicaoObjetivo({ ...p, compostos: false });
    perto(F.simularObjetivo({ ...p, compostos: false, contribuicao: simples }).montanteFinal, 100000 + p.montanteInicial * 0.04 * 10);
});

test('amortização: resultados de referência (taxa fixa)', () => {
    const base = { capital: 150000, taxaAnual: 3.5, prazoAnos: 30, tipoTaxa: 'fixa' };
    const anual = F.simularAmortizacao({ ...base, extraValor: 2000, cadenciaMeses: 12 });
    perto(anual.poupanca, 29327.63);
    assert.equal(anual.mesesPoupados, 8 * 12 + 9);
    const mensal = F.simularAmortizacao({ ...base, extraValor: 200, cadenciaMeses: 1 });
    perto(mensal.poupanca, 34085.18);
    assert.equal(mensal.mesesPoupados, 10 * 12 + 1);
});

test('calendário: o capital amortizado soma o empréstimo e o saldo final é zero', () => {
    const linhas = F.calendarioCredito(200000, 360, F.taxaVariavel(3, 0.5, 12), 0);
    perto(linhas.reduce((s, l) => s + l.capital, 0), 200000, 0.001);
    assert.equal(linhas[linhas.length - 1].saldo, 0);
    assert.ok(linhas[12].pagamento > linhas[0].pagamento, 'a prestação sobe quando a taxa sobe');
});

test('amortização com taxa variável: subida de taxa aumenta o custo total', () => {
    const p = { capital: 150000, taxaAnual: 3, prazoAnos: 30, extraValor: 0, cadenciaMeses: 12 };
    const fixa = F.simularAmortizacao({ ...p, tipoTaxa: 'fixa' });
    const variavel = F.simularAmortizacao({ ...p, tipoTaxa: 'variavel', variacaoAnual: 0.25 });
    assert.ok(variavel.totalPagoBase > fixa.totalPagoBase);
});

test('TAEG: igual à taxa efetiva sem encargos e superior com encargos', () => {
    const linhas = F.calendarioCredito(100000, 240, () => 3.6, 0);
    const pagamentos = linhas.map((l) => l.prestacao);
    perto(F.taeg(100000, pagamentos), (Math.pow(1 + 0.036 / 12, 12) - 1) * 100, 0.001);
    assert.ok(F.taeg(99000, pagamentos.map((p) => p + 30)) > F.taeg(100000, pagamentos));
});

test('crédito habitação: capital, stress test e comparação fixa/variável', () => {
    const r = F.creditoHabitacao({
        valorImovel: 250000, entradaPct: 20, prazoAnos: 30, tipo: 'variavel', taxaFixa: 3.5,
        euribor: 2.5, spread: 1, variacaoAnual: 0, revisaoMeses: 12, choque: 2, seguros: 40, comissoes: 600
    });
    assert.equal(r.capital, 200000);
    assert.ok(r.prestacaoStressInicial > r.prestacaoInicial);
    assert.ok(r.taeg > 3.5);
    perto(r.fixa[0].pagamento, F.pmt(200000, 0.035 / 12, 360), 0.001);
});

test('investir vs. amortizar: sem impostos, empata quando o rendimento iguala a taxa do crédito', () => {
    const p = { divida: 100000, taxaCredito: 4, prazoAnos: 20, unico: 10000, mensal: 200, imposto: 0 };
    const empate = F.investirVsAmortizar({ ...p, rendimento: (Math.pow(1 + 0.04 / 12, 12) - 1) * 100 });
    perto(empate.diferenca / empate.patrimonioAmortizar, 0, 0.001);
    assert.equal(F.investirVsAmortizar({ ...p, rendimento: 10 }).melhor, 'investir');
    assert.equal(F.investirVsAmortizar({ ...p, rendimento: 1 }).melhor, 'amortizar');
});

test('investir vs. amortizar: o rendimento de equilíbrio sobe com o imposto', () => {
    const p = { divida: 100000, taxaCredito: 4, prazoAnos: 20, unico: 10000, mensal: 200 };
    const semImposto = F.rendimentoEquilibrio({ ...p, imposto: 0 });
    const comImposto = F.rendimentoEquilibrio({ ...p, imposto: 28 });
    assert.ok(comImposto > semImposto);
    const verif = F.investirVsAmortizar({ ...p, imposto: 28, rendimento: comImposto });
    perto(verif.diferenca, 0, 1);
});

test('investir vs. amortizar: montante único superior à dívida liquida o crédito', () => {
    const r = F.investirVsAmortizar({ divida: 5000, taxaCredito: 4, prazoAnos: 5, unico: 8000, mensal: 0, rendimento: 3, imposto: 0 });
    assert.equal(r.serie[0].saldoA, 0);
    assert.equal(r.mesesCreditoAmortizar, 0);
});

test('reforma: com a contribuição necessária o capital cobre o necessário', () => {
    const p = {
        idade: 30, idadeReforma: 67, esperanca: 90, poupanca: 5000, contribuicao: 100, rendimento: 5,
        rendimentoReforma: 3, inflacao: 2, desejado: 1500, pensao: 700, indexar: true
    };
    const r = F.reforma(p);
    assert.ok(r.contribuicaoNecessaria > 0);
    const ajustado = F.reforma({ ...p, contribuicao: r.contribuicaoNecessaria });
    perto(ajustado.diferenca / ajustado.capitalNecessario, 0, 1e-6);
    assert.equal(ajustado.idadeEsgota, null);
    perto(ajustado.rendaSustentavel, p.desejado, 0.01);
    assert.ok(F.reforma(p).idadeEsgota === null || F.reforma(p).idadeEsgota < 90);
});

test('reforma: sem necessidade de capital quando a pensão cobre o desejado', () => {
    const r = F.reforma({
        idade: 40, idadeReforma: 67, esperanca: 90, poupanca: 0, contribuicao: 0, rendimento: 4,
        rendimentoReforma: 3, inflacao: 2, desejado: 800, pensao: 1000, indexar: false
    });
    assert.equal(r.capitalNecessario, 0);
    assert.equal(r.contribuicaoNecessaria, 0);
});

test('fundo de emergência: meta, prazo e caso inatingível', () => {
    const r = F.fundoEmergencia({ despesas: 1000, meses: 6, atual: 2000, mensal: 500, rendimento: 0 });
    assert.equal(r.meta, 6000);
    assert.equal(r.falta, 4000);
    assert.equal(r.mesesAteMeta, 8);
    perto(r.progresso, 1 / 3, 1e-9);
    assert.equal(F.fundoEmergencia({ despesas: 1000, meses: 6, atual: 6500, mensal: 0, rendimento: 0 }).mesesAteMeta, 0);
    assert.equal(F.fundoEmergencia({ despesas: 1000, meses: 6, atual: 100, mensal: 0, rendimento: 0 }).mesesAteMeta, null);
});
