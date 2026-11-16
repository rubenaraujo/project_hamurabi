// Internacionalização (PT/EN) e formatação de números. Funciona no navegador e em Node (testes).
(function (root, factory) {
    if (typeof module === 'object' && module.exports) module.exports = factory(null);
    else root.i18n = factory(root);
})(typeof self !== 'undefined' ? self : this, function (win) {
    'use strict';

    // Formato: chave: [português, inglês]
    const D = {
        'meta.title': ['Hamurabi - Ferramentas Financeiras', 'Hamurabi - Financial Tools'],
        'meta.desc': ['Simule crédito habitação, amortizações, juros compostos, objetivos de poupança, reforma e fundo de emergência. Gratuito, sem registo, com resultados imediatos.', 'Simulate mortgages, loan prepayments, compound interest, savings goals, retirement and emergency funds. Free, no sign-up, instant results.'],
        'meta.ogdesc': ['Simule crédito habitação, amortizações, juros compostos, objetivos de poupança, reforma e fundo de emergência.', 'Simulate mortgages, loan prepayments, compound interest, savings goals, retirement and emergency funds.'],
        'a11y.skip': ['Saltar para o conteúdo', 'Skip to content'],
        'nav.label': ['Principal', 'Main'],
        'nav.credito': ['Crédito', 'Loans'],
        'nav.investimento': ['Investimento', 'Investing'],
        'nav.planeamento': ['Planeamento', 'Planning'],
        'nav.guia': ['Guia', 'Guide'],
        'sims.open': ['Simulações guardadas', 'Saved simulations'],
        'lang.switch': ['Mudar idioma', 'Change language'],
        'theme.toggle': ['Alternar tema', 'Toggle theme'],
        'hero.eyebrow': ['Ferramentas financeiras', 'Financial tools'],
        'hero.title1': ['Decida com números,', 'Decide with numbers,'],
        'hero.title2': ['não com palpites.', 'not with guesses.'],
        'hero.desc': ['Simule crédito, investimentos e planos de poupança. Resultados imediatos, sem registo e sem rodeios.', 'Simulate loans, investments and savings plans. Instant results, no sign-up, no fluff.'],
        'hero.cta': ['Começar a simular', 'Start simulating'],
        'hero.cta2': ['Como funciona', 'How it works'],
        'tool.hab': ['Crédito habitação', 'Mortgage'],
        'tool.hab.s': ['Prestação, TAEG e risco de subida de taxas', 'Payment, APRC and rate-rise risk'],
        'tool.amort': ['Amortização de crédito', 'Loan prepayment'],
        'tool.amort.s': ['Quanto poupa em juros e em anos', 'How much interest and time you save'],
        'tool.iva': ['Investir ou amortizar?', 'Invest or prepay?'],
        'tool.iva.s': ['Onde rende mais o seu dinheiro', 'Where your money works harder'],
        'tool.juros': ['Juros compostos', 'Compound interest'],
        'tool.juros.s': ['O crescimento do seu investimento', 'How your investment grows'],
        'tool.obj': ['Objetivos financeiros', 'Financial goals'],
        'tool.obj.s': ['Quanto poupar para chegar lá', 'How much to save to get there'],
        'tool.ref': ['Poupança para a reforma', 'Retirement savings'],
        'tool.ref.s': ['Quanto precisa e quanto terá', 'What you need and what you will have'],
        'tool.fun': ['Fundo de emergência', 'Emergency fund'],
        'tool.fun.s': ['Meses de despesas protegidos', 'Months of expenses covered'],
        'grp.credito': ['Crédito', 'Loans'],
        'grp.investimento': ['Investimento', 'Investing'],
        'grp.planeamento': ['Planeamento', 'Planning'],

        'hab.title': ['Simulador de Crédito Habitação', 'Mortgage Simulator'],
        'hab.desc': ['Veja a prestação, o custo total e a TAEG, e teste o que acontece se a Euribor subir.', 'See the payment, total cost and APRC, and test what happens if the Euribor rises.'],
        'hab.s.fixa': ['Taxa fixa', 'Fixed rate'],
        'hab.s.var': ['Taxa variável', 'Variable rate'],
        'hab.s.cenarios': ['Cenários da Euribor', 'Euribor scenarios'],
        'hab.s.enc': ['Encargos', 'Costs'],
        'amort.title': ['Calculadora de Amortização de Crédito', 'Loan Prepayment Calculator'],
        'amort.desc': ['Descubra quanto pode poupar ao fazer amortizações regulares no seu crédito.', 'Find out how much you can save by making regular extra payments on your loan.'],
        'iva.title': ['Investir ou Amortizar o Crédito?', 'Invest or Prepay the Loan?'],
        'iva.desc': ['Compare o património final se usar o dinheiro extra para reduzir a dívida ou para investir.', 'Compare your final net worth if you use spare money to reduce debt or to invest.'],
        'juros.title': ['Calculadora de Juros Compostos', 'Compound Interest Calculator'],
        'juros.desc': ['Calcule o crescimento do seu investimento ao longo do tempo, com a inflação em conta.', 'Calculate how your investment grows over time, with inflation taken into account.'],
        'obj.title': ['Calculadora de Objetivos Financeiros', 'Financial Goals Calculator'],
        'obj.desc': ['Descubra quanto precisa poupar regularmente para atingir o seu objetivo.', 'Find out how much you need to save regularly to reach your goal.'],
        'ref.title': ['Poupança para a Reforma', 'Retirement Savings'],
        'ref.desc': ['Veja se o que poupa chega para o rendimento que quer na reforma, em valores de hoje.', 'See whether what you save is enough for the income you want in retirement, in today\'s money.'],
        'fun.title': ['Fundo de Emergência', 'Emergency Fund'],
        'fun.desc': ['Quantos meses de despesas tem protegidos e quanto falta para a sua rede de segurança.', 'How many months of expenses you have covered and how far you are from your safety net.'],

        'btn.calc': ['Calcular', 'Calculate'],
        'btn.cancel': ['Cancelar', 'Cancel'],
        'btn.save': ['Guardar', 'Save'],
        'btn.close': ['Fechar', 'Close'],
        'save.title': ['Guardar simulação', 'Save simulation'],
        'save.name': ['Nome', 'Name'],
        'sims.title': ['Simulações guardadas', 'Saved simulations'],
        'sims.empty': ['Ainda não guardou nenhuma simulação.', 'You have not saved any simulation yet.'],
        'sims.load': ['Abrir', 'Open'],
        'sims.delete': ['Apagar', 'Delete'],
        'guide.eyebrow': ['Guia', 'Guide'],
        'guide.title': ['Como funciona', 'How it works'],
        'faq.title': ['Perguntas frequentes', 'Frequently asked questions'],
        'gloss.eyebrow': ['Glossário', 'Glossary'],
        'gloss.title': ['Termos essenciais', 'Key terms'],
        'footer.disclaimer': ['As simulações são meramente indicativas e não constituem aconselhamento financeiro. Os valores reais dependem das condições de cada instituição.', 'Simulations are indicative only and do not constitute financial advice. Actual figures depend on each institution\'s terms.'],
        'footer.legal': ['Aviso legal e privacidade', 'Legal notice and privacy'],

        'o.variavel': ['Variável', 'Variable'],
        'o.fixa': ['Fixa', 'Fixed'],
        'o.rev6': ['A cada 6 meses', 'Every 6 months'],
        'o.rev12': ['A cada 12 meses', 'Every 12 months'],
        'o.anual': ['Anual', 'Annual'],
        'o.semestral': ['Semestral', 'Semiannual'],
        'o.trimestral': ['Trimestral', 'Quarterly'],
        'o.mensal': ['Mensal', 'Monthly'],

        'l.habValor': ['Valor do imóvel (€)', 'Property value (€)'],
        'l.habEntrada': ['Entrada (%)', 'Down payment (%)'],
        'l.habPrazo': ['Prazo (anos)', 'Term (years)'],
        'l.habTipo': ['Tipo de taxa para os resultados', 'Rate type for the results'],
        'l.habTaxaFixa': ['TAN fixa (%)', 'Fixed nominal rate (%)'],
        'l.habEuribor': ['Euribor atual (%)', 'Current Euribor (%)'],
        'l.habSpread': ['Spread (%)', 'Spread (%)'],
        'l.habRevisao': ['Revisão da taxa', 'Rate reset'],
        'l.habVariacao': ['Variação esperada da Euribor (p.p./ano)', 'Expected Euribor change (pp/year)'],
        'l.habChoque': ['Teste de stress: subida da Euribor (p.p.)', 'Stress test: Euribor rise (pp)'],
        'l.habSeguros': ['Seguros (vida + multirriscos), €/mês', 'Insurance (life + home), €/month'],
        'l.habComissoes': ['Comissões iniciais (€)', 'Upfront fees (€)'],
        'l.montanteInicial': ['Montante em dívida (€)', 'Outstanding balance (€)'],
        'l.taxaJuro': ['Taxa de juro anual (%)', 'Annual interest rate (%)'],
        'l.prazoAnos': ['Prazo (anos)', 'Term (years)'],
        'l.tipoTaxaAmortizacao': ['Tipo de taxa', 'Rate type'],
        'l.variacaoTaxaAmortizacao': ['Variação esperada da taxa (p.p./ano)', 'Expected rate change (pp/year)'],
        'l.amortizacaoRegular': ['Amortização regular (€)', 'Regular extra payment (€)'],
        'l.frequenciaAmortizacao': ['Frequência de amortização', 'Extra payment frequency'],
        'l.ivaDivida': ['Capital em dívida (€)', 'Outstanding balance (€)'],
        'l.ivaTaxa': ['Taxa do crédito (%)', 'Loan rate (%)'],
        'l.ivaPrazo': ['Prazo restante (anos)', 'Remaining term (years)'],
        'l.ivaUnico': ['Montante único disponível (€)', 'Lump sum available (€)'],
        'l.ivaMensal': ['Valor extra por mês (€)', 'Extra amount per month (€)'],
        'l.ivaRend': ['Rendimento esperado do investimento (%/ano)', 'Expected investment return (%/year)'],
        'l.ivaImposto': ['Imposto sobre os ganhos (%)', 'Tax on gains (%)'],
        'l.montanteInicialJuros': ['Montante inicial (€)', 'Initial amount (€)'],
        'l.contribuicaoRegular': ['Contribuição regular (€)', 'Regular contribution (€)'],
        'l.frequenciaContribuicao': ['Frequência de contribuição', 'Contribution frequency'],
        'l.taxaJurosAnual': ['Taxa de juro anual (%)', 'Annual interest rate (%)'],
        'l.frequenciaComposicaoJuros': ['Frequência de composição dos juros', 'Compounding frequency'],
        'l.periodoAnos': ['Período (anos)', 'Period (years)'],
        'l.inflacaoJuros': ['Inflação anual (%)', 'Annual inflation (%)'],
        'l.compararJuros': ['Comparar com outro cenário', 'Compare with another scenario'],
        'l.taxaJurosB': ['Cenário B: taxa de juro anual (%)', 'Scenario B: annual interest rate (%)'],
        'l.contribuicaoRegularB': ['Cenário B: contribuição regular (€)', 'Scenario B: regular contribution (€)'],
        'l.montanteObjetivo': ['Montante objetivo (€)', 'Target amount (€)'],
        'l.montanteInicialObjetivo': ['Montante inicial (€)', 'Initial amount (€)'],
        'l.prazoObjetivo': ['Prazo (anos)', 'Term (years)'],
        'l.taxaJuroObjetivo': ['Taxa de rendimento anual (%)', 'Annual return (%)'],
        'l.inflacaoObjetivo': ['Inflação anual (%, 0 para ignorar)', 'Annual inflation (%, 0 to ignore)'],
        'l.jurosCompostosObjetivo': ['Aplicar juros compostos', 'Apply compound interest'],
        'l.refIdade': ['Idade atual', 'Current age'],
        'l.refIdadeReforma': ['Idade de reforma', 'Retirement age'],
        'l.refEsperanca': ['Planear até aos (anos)', 'Plan until age'],
        'l.refPoupanca': ['Poupança atual (€)', 'Current savings (€)'],
        'l.refContrib': ['Contribuição mensal (€)', 'Monthly contribution (€)'],
        'l.refIndexar': ['Contribuição acompanha a inflação', 'Contribution follows inflation'],
        'l.refRend': ['Rendimento antes da reforma (%/ano)', 'Return before retirement (%/year)'],
        'l.refRendReforma': ['Rendimento durante a reforma (%/ano)', 'Return during retirement (%/year)'],
        'l.refInflacao': ['Inflação anual (%)', 'Annual inflation (%)'],
        'l.refDesejado': ['Rendimento mensal desejado (€ de hoje)', 'Desired monthly income (today\'s €)'],
        'l.refPensao': ['Pensão pública estimada (€ de hoje/mês)', 'Estimated state pension (today\'s €/month)'],
        'l.funDespesas': ['Despesas essenciais por mês (€)', 'Essential expenses per month (€)'],
        'l.funMeses': ['Meses de cobertura pretendidos', 'Months of coverage wanted'],
        'l.funAtual': ['Poupança atual (€)', 'Current savings (€)'],
        'l.funMensal': ['Quanto consegue poupar por mês (€)', 'How much you can save per month (€)'],
        'l.funRend': ['Rendimento da conta poupança (%/ano)', 'Savings account return (%/year)'],

        'r.habPrestacao': ['Prestação mensal inicial', 'Initial monthly payment'],
        'r.habTotalJuros': ['Total de juros', 'Total interest'],
        'r.habTaeg': ['TAEG', 'APRC'],
        'r.habStress': ['Prestação em stress', 'Stressed payment'],
        'r.poupancaTotal': ['Poupança total', 'Total savings'],
        'r.reducaoPrazo': ['Redução do prazo', 'Term reduction'],
        'r.ivaVeredito': ['Melhor opção', 'Best option'],
        'r.ivaPatA': ['Património se amortizar', 'Net worth if you prepay'],
        'r.ivaPatB': ['Património se investir', 'Net worth if you invest'],
        'r.ivaBreakeven': ['Rendimento de equilíbrio', 'Break-even return'],
        'r.ivaBreakevenSub': ['Acima disto, investir compensa', 'Above this, investing pays off'],
        'r.montanteFinal': ['Montante final', 'Final amount'],
        'r.jurosGanhos': ['Juros ganhos', 'Interest earned'],
        'r.montanteFinalReal': ['Valor real', 'Real value'],
        'r.realSub': ['Em poder de compra de hoje', 'In today\'s purchasing power'],
        'r.montanteFinalB': ['Cenário B', 'Scenario B'],
        'r.contribuicaoNecessaria': ['Contribuição necessária', 'Required contribution'],
        'r.montanteTotalPoupado': ['Montante total poupado', 'Total saved'],
        'r.refCapital': ['Capital na reforma', 'Capital at retirement'],
        'r.refNecessario': ['Capital necessário', 'Capital needed'],
        'r.refRenda': ['Rendimento mensal sustentável', 'Sustainable monthly income'],
        'r.refRendaSub': ['Pensão incluída, valores de hoje', 'Pension included, today\'s money'],
        'r.refContribNec': ['Contribuição necessária', 'Required contribution'],
        'r.refContribNecSub': ['Por mês, para atingir o objetivo', 'Per month, to reach the goal'],
        'r.funMeta': ['Meta do fundo', 'Fund target'],
        'r.funFalta': ['Falta poupar', 'Left to save'],
        'r.funTempo': ['Tempo para atingir', 'Time to reach it'],
        'r.funCobertura': ['Cobertura atual', 'Current coverage'],
        'r.funProgresso': ['Progresso', 'Progress'],

        // Resultados dinâmicos
        'res.capital': ['Capital financiado: {v}', 'Amount financed: {v}'],
        'res.max': ['Máximo: {v}', 'Peak: {v}'],
        'res.fixa.stress': ['Taxa fixa: a prestação mantém-se durante todo o prazo.', 'Fixed rate: the payment stays the same for the entire term.'],
        'hab.insight': ['Custo total do crédito: {total} (capital, juros, seguros e comissões). Se a Euribor subir {choque} p.p., a prestação inicial passa de {atual} para {stress}.', 'Total cost of the loan: {total} (principal, interest, insurance and fees). If the Euribor rises {choque} pp, the initial payment goes from {atual} to {stress}.'],
        'hab.insight.fixa': ['Custo total do crédito: {total} (capital, juros, seguros e comissões). Com taxa fixa, a prestação de {atual} mantém-se durante todo o prazo.', 'Total cost of the loan: {total} (principal, interest, insurance and fees). With a fixed rate, the {atual} payment stays the same for the entire term.'],
        'amort.insight': ['Com estas amortizações, o crédito termina {dur} mais cedo. Total pago: {depois}, contra {antes} sem amortizar.', 'With these extra payments, the loan ends {dur} earlier. Total paid: {depois}, versus {antes} without them.'],
        'amort.none': ['Sem amortizações extra, o crédito dura {dur} e custa {antes} no total.', 'Without extra payments, the loan lasts {dur} and costs {antes} in total.'],
        'iva.amortizar': ['Amortizar', 'Prepay'],
        'iva.investir': ['Investir', 'Invest'],
        'iva.sub': ['Vantagem de {v}', 'Advantage of {v}'],
        'iva.insight': ['A prestação do crédito é {p}. Se amortizar, a dívida fica liquidada em {dur}. Valores líquidos de imposto sobre os ganhos, no fim do prazo.', 'The loan payment is {p}. If you prepay, the debt is cleared in {dur}. Figures are net of tax on gains, at the end of the term.'],
        'iva.nobe': ['n/d', 'n/a'],
        'juros.subB': ['{v} face ao cenário A', '{v} versus scenario A'],
        'obj.sub.anual': ['Por ano', 'Per year'],
        'obj.sub.semestral': ['Por semestre', 'Per half-year'],
        'obj.sub.trimestral': ['Por trimestre', 'Per quarter'],
        'obj.sub.mensal': ['Por mês', 'Per month'],
        'obj.insight': ['Para ter {real} em poder de compra de hoje daqui a {anos} anos, precisa de acumular {nominal} em euros futuros.', 'To have {real} in today\'s purchasing power in {anos} years, you need to accumulate {nominal} in future euros.'],
        'obj.insight.simple': ['Sem inflação, o objetivo de {real} é atingido com a contribuição indicada.', 'Ignoring inflation, the {real} goal is reached with the contribution shown.'],
        'ref.sub': ['{v} em euros de hoje', '{v} in today\'s euros'],
        'ref.insight.ok': ['O plano chega: sobram {d} (em euros de hoje) além do necessário para o rendimento desejado até aos {idade} anos.', 'The plan works: you have {d} (in today\'s euros) beyond what is needed for the desired income until age {idade}.'],
        'ref.insight.short': ['Faltam {d} (em euros de hoje). Com o rendimento desejado, o capital esgota-se aos {idade} anos.', 'You are {d} short (in today\'s euros). With the desired income, the capital runs out at age {idade}.'],
        'ref.insight.short2': ['Faltam {d} (em euros de hoje) para sustentar o rendimento desejado.', 'You are {d} short (in today\'s euros) of what is needed to sustain the desired income.'],
        'ref.pension': ['Pensão incluída, valores de hoje', 'Pension included, today\'s money'],
        'fun.done': ['Já atingido', 'Already reached'],
        'fun.never': ['Mais de 50 anos', 'More than 50 years'],
        'fun.months': ['{n} meses', '{n} months'],
        'fun.insight.done': ['O fundo de emergência já cobre {n} meses de despesas. A meta está atingida.', 'Your emergency fund already covers {n} months of expenses. The target is met.'],
        'fun.insight': ['Com {mensal} por mês, atinge a meta em {dur}. Até lá, está protegido durante {n} meses de despesas.', 'Saving {mensal} per month, you reach the target in {dur}. Until then, you are covered for {n} months of expenses.'],
        'fun.insight.never': ['Com a poupança mensal indicada não é possível atingir a meta. Aumente o valor poupado.', 'With the monthly saving entered, the target cannot be reached. Increase the amount saved.'],

        // Gráficos e tabelas
        'chart.year': ['Ano {n}', 'Year {n}'],
        'chart.age': ['{n} anos', 'Age {n}'],
        'chart.month': ['Mês {n}', 'Month {n}'],
        'ch.noExtra': ['Dívida sem amortizações', 'Balance without extra payments'],
        'ch.extra': ['Dívida com amortizações', 'Balance with extra payments'],
        'ch.contrib': ['Contribuições acumuladas', 'Accumulated contributions'],
        'ch.total': ['Montante total', 'Total amount'],
        'ch.real': ['Valor real', 'Real value'],
        'ch.scenarioB': ['Cenário B', 'Scenario B'],
        'ch.scenarioA': ['Cenário A', 'Scenario A'],
        'ch.target': ['Objetivo (valores futuros)', 'Target (future money)'],
        'ch.patA': ['Património: amortizar', 'Net worth: prepay'],
        'ch.patB': ['Património: investir', 'Net worth: invest'],
        'ch.capital': ['Capital (euros de hoje)', 'Capital (today\'s euros)'],
        'ch.fund': ['Fundo', 'Fund'],
        'ch.goal': ['Meta', 'Target'],
        'ch.fixed': ['Taxa fixa', 'Fixed rate'],
        'ch.variable': ['Taxa variável', 'Variable rate'],
        'ch.stress': ['Cenário de stress', 'Stress scenario'],
        'ch.payment': ['Prestação', 'Payment'],
        'aria.hab': ['Gráfico da prestação mensal ao longo do prazo', 'Chart of the monthly payment over the term'],
        'aria.amort': ['Gráfico da dívida com e sem amortizações', 'Chart of the balance with and without extra payments'],
        'aria.iva': ['Gráfico do património ao longo do tempo nas duas opções', 'Chart of net worth over time for both options'],
        'aria.juros': ['Gráfico do crescimento do investimento', 'Chart of investment growth'],
        'aria.obj': ['Gráfico da evolução da poupança até ao objetivo', 'Chart of savings progress toward the goal'],
        'aria.ref': ['Gráfico do capital de reforma ao longo da vida', 'Chart of retirement capital over a lifetime'],
        'aria.fun': ['Gráfico da evolução do fundo de emergência', 'Chart of emergency fund growth'],
        'tbl.show': ['Mostrar tabela detalhada', 'Show detailed table'],
        'tbl.hide': ['Ocultar tabela', 'Hide table'],
        'tbl.v.anual': ['Anual', 'Annual'],
        'tbl.v.mensal': ['Mensal', 'Monthly'],
        'c.year': ['Ano', 'Year'],
        'c.month': ['Mês', 'Month'],
        'c.age': ['Idade', 'Age'],
        'c.rate': ['Taxa (%)', 'Rate (%)'],
        'c.payment': ['Prestação', 'Payment'],
        'c.interest': ['Juros', 'Interest'],
        'c.principal': ['Capital amortizado', 'Principal paid'],
        'c.extra': ['Amortização extra', 'Extra payment'],
        'c.insurance': ['Seguros', 'Insurance'],
        'c.balance': ['Dívida', 'Balance'],
        'c.contribYear': ['Contribuições do ano', 'Contributions this year'],
        'c.contribAcc': ['Contribuições acumuladas', 'Accumulated contributions'],
        'c.interestYear': ['Juros do ano', 'Interest this year'],
        'c.total': ['Montante total', 'Total amount'],
        'c.real': ['Valor real', 'Real value'],
        'c.patA': ['Património (amortizar)', 'Net worth (prepay)'],
        'c.patB': ['Património (investir)', 'Net worth (invest)'],
        'c.debtA': ['Dívida (amortizar)', 'Debt (prepay)'],
        'c.debtB': ['Dívida (investir)', 'Debt (invest)'],
        'c.portA': ['Carteira (amortizar)', 'Portfolio (prepay)'],
        'c.portB': ['Carteira (investir)', 'Portfolio (invest)'],
        'c.capital': ['Capital (euros de hoje)', 'Capital (today\'s euros)'],
        'c.fund': ['Fundo', 'Fund'],

        // Unidades e mensagens
        'u.year': ['ano', 'year'],
        'u.years': ['anos', 'years'],
        'u.month': ['mês', 'month'],
        'u.months': ['meses', 'months'],
        'u.and': ['e', 'and'],
        'err.invalid': ['Verifique os valores introduzidos.', 'Please check the values entered.'],
        'err.ages': ['A idade atual deve ser menor que a idade de reforma, e esta menor que a idade até à qual planeia.', 'Current age must be lower than retirement age, which must be lower than the age you plan until.'],
        'err.noexport': ['Não há dados para exportar.', 'There is no data to export.'],
        'act.share': ['Partilhar', 'Share'],
        'act.save': ['Guardar', 'Save'],
        'act.csv': ['Exportar CSV', 'Export CSV'],
        'act.print': ['Imprimir / PDF', 'Print / PDF'],
        'toast.copied': ['Ligação copiada', 'Link copied'],
        'toast.saved': ['Simulação guardada', 'Simulation saved'],
        'toast.deleted': ['Simulação apagada', 'Simulation deleted'],
        'toast.restored': ['Simulação carregada', 'Simulation loaded'],
        'toast.shareFail': ['Não foi possível copiar. Copie a ligação do endereço do navegador.', 'Could not copy. Copy the link from the browser address bar.'],
        'print.heading': ['Simulação Hamurabi', 'Hamurabi simulation'],
        'print.inputs': ['Valores introduzidos', 'Inputs'],
        'print.results': ['Resultados', 'Results'],
        'yes': ['Sim', 'Yes'],
        'no': ['Não', 'No']
    };

    const sufixo = { pt: 0, en: 1 };

    function detetar() {
        try {
            const guardado = win && win.localStorage.getItem('hamurabi.lang');
            if (guardado === 'pt' || guardado === 'en') return guardado;
        } catch (e) { /* sem armazenamento */ }
        const nav = (win && win.navigator && win.navigator.language) || 'pt';
        return nav.toLowerCase().indexOf('pt') === 0 ? 'pt' : 'en';
    }

    const api = { lang: detetar(), dict: D };

    api.t = function (chave, vars) {
        const par = D[chave];
        if (!par) return chave;
        let s = par[sufixo[api.lang]];
        if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; });
        return s;
    };

    const locale = function () { return api.lang === 'pt' ? 'pt-PT' : 'en-IE'; };

    api.euro = function (v, casas) {
        if (!isFinite(v)) return '-';
        const c = casas === undefined ? 2 : casas;
        return new Intl.NumberFormat(locale(), {
            style: 'currency', currency: 'EUR', minimumFractionDigits: c, maximumFractionDigits: c, useGrouping: 'always'
        }).format(v);
    };

    api.num = function (v, casas) {
        const c = casas === undefined ? 1 : casas;
        return new Intl.NumberFormat(locale(), { minimumFractionDigits: c, maximumFractionDigits: c, useGrouping: 'always' }).format(v);
    };

    api.pct = function (v, casas) {
        return api.num(v, casas === undefined ? 2 : casas) + ' %';
    };

    // Duração em meses -> "8 anos e 9 meses"
    api.dur = function (meses) {
        const m = Math.round(meses);
        const anos = Math.floor(m / 12), resto = m % 12;
        const partes = [];
        if (anos > 0) partes.push(anos + ' ' + api.t(anos === 1 ? 'u.year' : 'u.years'));
        if (resto > 0 || anos === 0) partes.push(resto + ' ' + api.t(resto === 1 ? 'u.month' : 'u.months'));
        return partes.join(' ' + api.t('u.and') + ' ');
    };

    api.apply = function (root) {
        const doc = win.document;
        doc.documentElement.lang = api.lang;
        root.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = api.t(el.dataset.i18n); });
        root.querySelectorAll('[data-i18n-html]').forEach(function (el) { el.innerHTML = api.t(el.dataset.i18nHtml); });
        root.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
            el.dataset.i18nAttr.split(';').forEach(function (par) {
                const i = par.indexOf(':');
                el.setAttribute(par.slice(0, i), api.t(par.slice(i + 1)));
            });
        });
        const titulo = doc.querySelector('title[data-i18n]');
        if (titulo) doc.title = api.t(titulo.dataset.i18n);
    };

    // Guarda os valores dos campos e recarrega a página no outro idioma.
    api.setLang = function (lang) {
        try {
            win.localStorage.setItem('hamurabi.lang', lang);
            const valores = {};
            win.document.querySelectorAll('input[id], select[id]').forEach(function (el) {
                if (el.type === 'range') return;
                valores[el.id] = el.type === 'checkbox' ? el.checked : el.value;
            });
            win.sessionStorage.setItem('hamurabi.restore', JSON.stringify(valores));
        } catch (e) { /* sem armazenamento */ }
        win.location.reload();
    };

    return api;
});
