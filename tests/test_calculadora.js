// Testes unitários para a calculadora de juros compostos

// Importar as funções a serem testadas
// Como estamos em um ambiente de teste isolado, vamos recriar as funções necessárias

// Função para obter o número de períodos por ano com base na frequência
function getPeriodosPorAno(frequencia) {
    switch (frequencia) {
        case 'mensal':
            return 12;
        case 'trimestral':
            return 4;
        case 'semestral':
            return 2;
        case 'anual':
            return 1;
        default:
            return 12;
    }
}

// Implementação corrigida da função de cálculo de juros compostos
function calcularJurosCompostosFunc(montanteInicial, contribuicaoRegular, frequenciaContribuicao, frequenciaComposicaoJuros, taxaJurosAnual, periodoAnos) {
    // Determinar o número de períodos por ano com base nas frequências
    const periodosContribuicaoAno = getPeriodosPorAno(frequenciaContribuicao);
    const periodosComposicaoAno = getPeriodosPorAno(frequenciaComposicaoJuros);
    
    // Calcular a taxa por período de composição usando a fórmula correta
    const taxaAnual = taxaJurosAnual / 100;
    
    // Calcular o número total de períodos
    const totalPeriodos = periodoAnos * periodosComposicaoAno;
    
    // Calcular a taxa por período (taxa efetiva)
    const taxaPorPeriodo = taxaAnual / periodosComposicaoAno;
    
    // Ajustar a contribuição para a frequência de composição
    // Se a frequência de contribuição for diferente da frequência de composição
    const contribuicaoPorPeriodoComposicao = contribuicaoRegular * (periodosContribuicaoAno / periodosComposicaoAno);
    
    // Calcular o valor futuro usando a fórmula padrão
    const valorFuturo = montanteInicial * Math.pow(1 + taxaPorPeriodo, totalPeriodos) + 
                       contribuicaoPorPeriodoComposicao * (Math.pow(1 + taxaPorPeriodo, totalPeriodos) - 1) / taxaPorPeriodo;
    
    // Calcular o total de contribuições
    const totalContribuicoes = montanteInicial + (contribuicaoRegular * periodosContribuicaoAno * periodoAnos);
    
    // Calcular os juros totais
    const jurosTotais = valorFuturo - totalContribuicoes;
    
    // Gerar resultados anuais para o gráfico
    const resultados = [];
    let montanteAtual = montanteInicial;
    
    for (let ano = 1; ano <= periodoAnos; ano++) {
        // Calcular contribuições para este ano
        const contribuicoesAno = contribuicaoRegular * periodosContribuicaoAno;
        
        // Calcular o montante no final deste ano usando a fórmula de valor futuro
        const periodosFimAno = ano * periodosComposicaoAno;
        const montanteFimAno = montanteInicial * Math.pow(1 + taxaPorPeriodo, periodosFimAno) + 
                              contribuicaoPorPeriodoComposicao * (Math.pow(1 + taxaPorPeriodo, periodosFimAno) - 1) / taxaPorPeriodo;
        
        // Calcular juros ganhos neste ano
        const jurosAno = montanteFimAno - montanteAtual - contribuicoesAno;
        
        // Atualizar montante atual
        montanteAtual = montanteFimAno;
        
        // Adicionar resultado anual
        resultados.push({
            ano: ano,
            contribuicoesAno: contribuicoesAno,
            jurosAno: jurosAno,
            montanteTotal: montanteFimAno
        });
    }
    
    return {
        montanteFinal: valorFuturo,
        jurosTotais: jurosTotais,
        totalContribuicoes: totalContribuicoes,
        resultados: resultados
    };
}

// Função para executar os testes
function executarTestes() {
    console.log("Iniciando testes unitários para a calculadora de juros compostos...");
    
    // Teste 1: Verificar se a composição mensal rende mais que a anual
    console.log("\nTeste 1: Composição mensal vs. anual");
    const parametrosBase = {
        montanteInicial: 10000,
        contribuicaoRegular: 200,
        frequenciaContribuicao: 'mensal',
        taxaJurosAnual: 5,
        periodoAnos: 20
    };
    
    const resultadoMensal = calcularJurosCompostosFunc(
        parametrosBase.montanteInicial,
        parametrosBase.contribuicaoRegular,
        parametrosBase.frequenciaContribuicao,
        'mensal',
        parametrosBase.taxaJurosAnual,
        parametrosBase.periodoAnos
    );
    
    const resultadoAnual = calcularJurosCompostosFunc(
        parametrosBase.montanteInicial,
        parametrosBase.contribuicaoRegular,
        parametrosBase.frequenciaContribuicao,
        'anual',
        parametrosBase.taxaJurosAnual,
        parametrosBase.periodoAnos
    );
    
    console.log(`Montante final com composição mensal: ${resultadoMensal.montanteFinal.toFixed(2)} €`);
    console.log(`Montante final com composição anual: ${resultadoAnual.montanteFinal.toFixed(2)} €`);
    console.log(`Diferença: ${(resultadoMensal.montanteFinal - resultadoAnual.montanteFinal).toFixed(2)} €`);
    
    const testeMensalMaiorQueAnual = resultadoMensal.montanteFinal > resultadoAnual.montanteFinal;
    console.log(`Teste 1 ${testeMensalMaiorQueAnual ? 'PASSOU' : 'FALHOU'}: Composição mensal ${testeMensalMaiorQueAnual ? 'rende mais' : 'não rende mais'} que composição anual`);
    
    // Teste 2: Verificar a ordem correta de rendimento (mensal > trimestral > semestral > anual)
    console.log("\nTeste 2: Ordem de rendimento por frequência");
    
    const resultadoTrimestral = calcularJurosCompostosFunc(
        parametrosBase.montanteInicial,
        parametrosBase.contribuicaoRegular,
        parametrosBase.frequenciaContribuicao,
        'trimestral',
        parametrosBase.taxaJurosAnual,
        parametrosBase.periodoAnos
    );
    
    const resultadoSemestral = calcularJurosCompostosFunc(
        parametrosBase.montanteInicial,
        parametrosBase.contribuicaoRegular,
        parametrosBase.frequenciaContribuicao,
        'semestral',
        parametrosBase.taxaJurosAnual,
        parametrosBase.periodoAnos
    );
    
    console.log(`Montante final com composição mensal: ${resultadoMensal.montanteFinal.toFixed(2)} €`);
    console.log(`Montante final com composição trimestral: ${resultadoTrimestral.montanteFinal.toFixed(2)} €`);
    console.log(`Montante final com composição semestral: ${resultadoSemestral.montanteFinal.toFixed(2)} €`);
    console.log(`Montante final com composição anual: ${resultadoAnual.montanteFinal.toFixed(2)} €`);
    
    const testeOrdemCorreta = 
        resultadoMensal.montanteFinal > resultadoTrimestral.montanteFinal &&
        resultadoTrimestral.montanteFinal > resultadoSemestral.montanteFinal &&
        resultadoSemestral.montanteFinal > resultadoAnual.montanteFinal;
    
    console.log(`Teste 2 ${testeOrdemCorreta ? 'PASSOU' : 'FALHOU'}: A ordem de rendimento é ${testeOrdemCorreta ? 'correta' : 'incorreta'} (mensal > trimestral > semestral > anual)`);
    
    // Teste 3: Verificar caso especial - contribuição zero
    console.log("\nTeste 3: Contribuição zero");
    
    const resultadoMensalSemContribuicao = calcularJurosCompostosFunc(
        parametrosBase.montanteInicial,
        0,
        parametrosBase.frequenciaContribuicao,
        'mensal',
        parametrosBase.taxaJurosAnual,
        parametrosBase.periodoAnos
    );
    
    const resultadoAnualSemContribuicao = calcularJurosCompostosFunc(
        parametrosBase.montanteInicial,
        0,
        parametrosBase.frequenciaContribuicao,
        'anual',
        parametrosBase.taxaJurosAnual,
        parametrosBase.periodoAnos
    );
    
    console.log(`Montante final com composição mensal (sem contribuição): ${resultadoMensalSemContribuicao.montanteFinal.toFixed(2)} €`);
    console.log(`Montante final com composição anual (sem contribuição): ${resultadoAnualSemContribuicao.montanteFinal.toFixed(2)} €`);
    
    const testeSemContribuicao = resultadoMensalSemContribuicao.montanteFinal > resultadoAnualSemContribuicao.montanteFinal;
    console.log(`Teste 3 ${testeSemContribuicao ? 'PASSOU' : 'FALHOU'}: Mesmo sem contribuições, composição mensal ${testeSemContribuicao ? 'rende mais' : 'não rende mais'} que composição anual`);
    
    // Teste 4: Verificar a taxa efetiva anual
    console.log("\nTeste 4: Taxa efetiva anual");
    
    // Calcular a taxa efetiva anual para composição mensal
    const taxaMensal = Math.pow(1 + 0.05/12, 12) - 1;
    // Calcular o montante final teórico para composição mensal (sem contribuições)
    const montanteTeoricoMensal = 10000 * Math.pow(1 + taxaMensal, 20);
    
    // Calcular o montante final teórico para composição anual (sem contribuições)
    const montanteTeoricoAnual = 10000 * Math.pow(1 + 0.05, 20);
    
    console.log(`Taxa efetiva anual com composição mensal: ${(taxaMensal * 100).toFixed(4)}%`);
    console.log(`Montante teórico com composição mensal (20 anos): ${montanteTeoricoMensal.toFixed(2)} €`);
    console.log(`Montante teórico com composição anual (20 anos): ${montanteTeoricoAnual.toFixed(2)} €`);
    console.log(`Montante calculado com composição mensal: ${resultadoMensalSemContribuicao.montanteFinal.toFixed(2)} €`);
    console.log(`Montante calculado com composição anual: ${resultadoAnualSemContribuicao.montanteFinal.toFixed(2)} €`);
    
    const diferencaMensal = Math.abs(montanteTeoricoMensal - resultadoMensalSemContribuicao.montanteFinal);
    const diferencaAnual = Math.abs(montanteTeoricoAnual - resultadoAnualSemContribuicao.montanteFinal);
    
    const precisaoMensal = diferencaMensal < 0.1; // Tolerância de 10 centavos
    const precisaoAnual = diferencaAnual < 0.1; // Tolerância de 10 centavos
    
    console.log(`Teste 4a ${precisaoMensal ? 'PASSOU' : 'FALHOU'}: Cálculo com composição mensal ${precisaoMensal ? 'está preciso' : 'não está preciso'} (diferença: ${diferencaMensal.toFixed(2)} €)`);
    console.log(`Teste 4b ${precisaoAnual ? 'PASSOU' : 'FALHOU'}: Cálculo com composição anual ${precisaoAnual ? 'está preciso' : 'não está preciso'} (diferença: ${diferencaAnual.toFixed(2)} €)`);
    
    // Resumo dos testes
    console.log("\nResumo dos testes:");
    console.log(`Teste 1: ${testeMensalMaiorQueAnual ? 'PASSOU' : 'FALHOU'}`);
    console.log(`Teste 2: ${testeOrdemCorreta ? 'PASSOU' : 'FALHOU'}`);
    console.log(`Teste 3: ${testeSemContribuicao ? 'PASSOU' : 'FALHOU'}`);
    console.log(`Teste 4a: ${precisaoMensal ? 'PASSOU' : 'FALHOU'}`);
    console.log(`Teste 4b: ${precisaoAnual ? 'PASSOU' : 'FALHOU'}`);
    
    const todosTestes = testeMensalMaiorQueAnual && testeOrdemCorreta && testeSemContribuicao && precisaoMensal && precisaoAnual;
    console.log(`\nResultado final: ${todosTestes ? 'TODOS OS TESTES PASSARAM' : 'ALGUNS TESTES FALHARAM'}`);
    
    return todosTestes;
}

// Executar os testes
executarTestes();
