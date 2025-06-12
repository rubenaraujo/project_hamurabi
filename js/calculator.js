// Calculadora de Amortização de Crédito
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da calculadora de amortização
    const montanteInicialAmortizacao = document.getElementById('montanteInicial');
    const taxaJuroAnualAmortizacao = document.getElementById('taxaJuro');
    const prazoAnosAmortizacao = document.getElementById('prazoAnos');
    const valorAmortizacaoRegular = document.getElementById('amortizacaoRegular');
    const frequenciaAmortizacao = document.getElementById('frequenciaAmortizacao');
    const calcularAmortizacaoBtn = document.getElementById('calcular');
    const resultadoPoupancaTotal = document.getElementById('poupancaTotal');
    const resultadoReducaoPrazo = document.getElementById('reducaoPrazo');
    const resultadoTextoAmortizacao = document.getElementById('tempoPoupado');
    const verTabelaAmortizacaoBtn = document.getElementById('toggleTable');
    const tabelaDetalhadaAmortizacao = document.getElementById('tableContainer');
    const tabelaDetalhadaAmortizacaoBody = document.getElementById('amortizacaoTable').querySelector('tbody');
    
    // Elementos da calculadora de juros compostos
    const montanteInicialJuros = document.getElementById('montanteInicialJuros');
    const contribuicaoRegular = document.getElementById('contribuicaoRegular');
    const frequenciaContribuicao = document.getElementById('frequenciaContribuicao');
    const taxaJuroAnualJuros = document.getElementById('taxaJurosAnual');
    const frequenciaComposicaoJuros = document.getElementById('frequenciaComposicaoJuros');
    const prazoAnosJuros = document.getElementById('periodoAnos');
    const calcularJurosBtn = document.getElementById('calcularJuros');
    const resultadoMontanteFinal = document.getElementById('montanteFinal');
    const resultadoJurosGanhos = document.getElementById('jurosGanhos');
    const verTabelaBtn = document.getElementById('toggleJurosTable');
    const tabelaDetalhada = document.getElementById('jurosTableContainer');
    const tabelaDetalhadaBody = document.getElementById('jurosCompostosTable').querySelector('tbody');
    
    // Elementos da calculadora de objetivos
    const montanteObjetivo = document.getElementById('montanteObjetivo');
    const montanteInicialObjetivo = document.getElementById('montanteInicialObjetivo');
    const prazoAnosObjetivo = document.getElementById('prazoObjetivo');
    const taxaJuroAnualObjetivo = document.getElementById('taxaJuroObjetivo');
    const frequenciaContribuicaoObjetivo = document.getElementById('frequenciaContribuicaoObjetivo');
    const frequenciaComposicaoObjetivo = document.getElementById('frequenciaComposicaoJurosObjetivo');
    const jurosCompostosCheckbox = document.getElementById('jurosCompostosObjetivo');
    const calcularObjetivoBtn = document.getElementById('calcularObjetivo');
    const resultadoContribuicaoNecessaria = document.getElementById('contribuicaoNecessaria');
    const resultadoMontanteTotalPoupado = document.getElementById('montanteTotalPoupado');
    
    // Gráficos
    let graficoJurosCompostos = null;
    let graficoAmortizacao = null;
    let graficoObjetivos = null;
    
    // Event listeners
    if (calcularAmortizacaoBtn) {
        calcularAmortizacaoBtn.addEventListener('click', calcularAmortizacao);
    }
    
    if (calcularJurosBtn) {
        calcularJurosBtn.addEventListener('click', calcularJurosCompostos);
    }
    
    if (verTabelaBtn) {
        verTabelaBtn.addEventListener('click', mostrarTabelaDetalhada);
    }
    
    if (verTabelaAmortizacaoBtn) {
        verTabelaAmortizacaoBtn.addEventListener('click', mostrarTabelaDetalhadaAmortizacao);
    }
    
    if (calcularObjetivoBtn) {
        calcularObjetivoBtn.addEventListener('click', calcularObjetivo);
    }
    
    // Adicionar event listener para scroll para destacar as tabs
    window.addEventListener('scroll', atualizarTabsAtivas);
    
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
    
    // Função para calcular juros compostos com frequências de contribuição e composição separadas
    function calcularJurosCompostosFunc(montanteInicial, contribuicaoRegular, frequenciaContribuicao, frequenciaComposicaoJuros, taxaJurosAnual, periodoAnos) {
        // Determinar o número de períodos por ano com base nas frequências
        const periodosContribuicaoAno = getPeriodosPorAno(frequenciaContribuicao);
        const periodosComposicaoAno = getPeriodosPorAno(frequenciaComposicaoJuros);
        
        // Calcular a taxa por período de composição usando a fórmula correta
        // Para juros compostos, a taxa periódica equivalente é (1+r)^(1/m)-1
        // onde r é a taxa anual e m é o número de períodos por ano
        const taxaAnual = taxaJurosAnual / 100;
        
        // Implementação correta da fórmula de juros compostos com diferentes frequências
        // Quando a frequência de composição aumenta, o rendimento deve aumentar
        
        // Fórmula para valor futuro com taxa periódica
        // FV = P(1+r)^n + PMT*((1+r)^n - 1)/r
        // Onde:
        // - FV = valor futuro
        // - P = principal (montante inicial)
        // - r = taxa por período
        // - n = número total de períodos
        // - PMT = contribuição periódica
        
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
    
    // Função auxiliar para calcular o mínimo comum múltiplo
    function mcm(a, b) {
        return (a * b) / mdc(a, b);
    }
    
    // Função auxiliar para calcular o máximo divisor comum (algoritmo de Euclides)
    function mdc(a, b) {
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    
    // Função para calcular a contribuição necessária para atingir um objetivo financeiro
    function calcularContribuicaoObjetivo(montanteObjetivo, montanteInicial, prazoAnos, taxaJuroAnual, frequenciaContribuicao, frequenciaComposicaoJuros, jurosCompostos) {
        // Se não estiver usando juros compostos, usar a fórmula simples
        if (!jurosCompostos) {
            const periodosContribuicaoAno = getPeriodosPorAno(frequenciaContribuicao);
            const totalPeriodosContribuicao = prazoAnos * periodosContribuicaoAno;
            
            // Calcular o montante a ser poupado
            const montanteAPoupar = montanteObjetivo - montanteInicial;
            
            // Calcular a contribuição necessária por período
            return montanteAPoupar / totalPeriodosContribuicao;
        }
        
        // Para juros compostos, usar método iterativo para encontrar a contribuição necessária
        const periodosContribuicaoAno = getPeriodosPorAno(frequenciaContribuicao);
        const periodosComposicaoAno = getPeriodosPorAno(frequenciaComposicaoJuros);
        
        // Calcular a taxa por período de composição
        const taxaAnual = taxaJuroAnual / 100;
        const taxaPorPeriodo = taxaAnual / periodosComposicaoAno;
        
        // Calcular o número total de períodos
        const totalPeriodos = prazoAnos * periodosComposicaoAno;
        
        // Ajustar a contribuição para a frequência de composição
        const fatorAjuste = periodosContribuicaoAno / periodosComposicaoAno;
        
        // Calcular o fator de crescimento do montante inicial
        const fatorCrescimentoInicial = Math.pow(1 + taxaPorPeriodo, totalPeriodos);
        
        // Calcular o montante que o investimento inicial crescerá
        const montanteInicialFinal = montanteInicial * fatorCrescimentoInicial;
        
        // Calcular o montante adicional necessário
        const montanteAdicionalNecessario = montanteObjetivo - montanteInicialFinal;
        
        // Se o montante inicial já é suficiente ou excede o objetivo
        if (montanteAdicionalNecessario <= 0) {
            return 0;
        }
        
        // Calcular o fator de acumulação para contribuições periódicas
        const fatorAcumulacao = (Math.pow(1 + taxaPorPeriodo, totalPeriodos) - 1) / taxaPorPeriodo;
        
        // Calcular a contribuição necessária por período de composição
        const contribuicaoPorPeriodoComposicao = montanteAdicionalNecessario / fatorAcumulacao;
        
        // Ajustar a contribuição para a frequência de contribuição
        return contribuicaoPorPeriodoComposicao / fatorAjuste;
    }
    
    // Função para simular a evolução da poupança para atingir o objetivo
    function simularEvolucaoPoupanca(montanteObjetivo, montanteInicial, contribuicaoNecessaria, prazoAnos, taxaJuroAnual, frequenciaContribuicao, frequenciaComposicaoJuros, jurosCompostos) {
        // Se não estiver usando juros compostos, usar cálculo simples
        if (!jurosCompostos) {
            const periodosContribuicaoAno = getPeriodosPorAno(frequenciaContribuicao);
            
            let montanteAtual = montanteInicial;
            let totalContribuicoes = 0;
            let totalRendimentos = 0;
            const resultados = [];
            
            for (let ano = 1; ano <= prazoAnos; ano++) {
                const contribuicoesAno = contribuicaoNecessaria * periodosContribuicaoAno;
                totalContribuicoes += contribuicoesAno;
                
                // Calcular rendimentos anuais com juros simples
                const rendimentosSimples = montanteInicial * taxaJuroAnual / 100;
                totalRendimentos += rendimentosSimples;
                
                montanteAtual = montanteInicial + totalContribuicoes + totalRendimentos;
                
                resultados.push({
                    ano: ano,
                    contribuicoesAno: contribuicoesAno,
                    rendimentosAno: rendimentosSimples,
                    montanteAcumulado: montanteAtual
                });
            }
            
            return {
                montanteFinal: montanteAtual,
                totalContribuicoes: totalContribuicoes,
                totalRendimentos: totalRendimentos,
                resultados: resultados
            };
        }
        
        // Para juros compostos, usar o mesmo método da calculadora de juros compostos
        return calcularJurosCompostosFunc(
            montanteInicial,
            contribuicaoNecessaria,
            frequenciaContribuicao,
            frequenciaComposicaoJuros,
            taxaJuroAnual,
            prazoAnos
        );
    }
    
    // Função para formatar o tempo poupado em anos e meses
    function formatarTempoPoupado(mesesNormal, mesesComExtra) {
        const mesesPoupados = mesesNormal - mesesComExtra;
        
        if (mesesPoupados <= 0) {
            return "0 meses";
        }
        
        const anosPoupados = Math.floor(mesesPoupados / 12);
        const mesesRestantes = mesesPoupados % 12;
        
        let resultado = "";
        
        if (anosPoupados > 0) {
            resultado += anosPoupados + (anosPoupados === 1 ? " ano" : " anos");
        }
        
        if (mesesRestantes > 0) {
            if (resultado.length > 0) {
                resultado += " e ";
            }
            resultado += mesesRestantes + (mesesRestantes === 1 ? " mês" : " meses");
        }
        
        return resultado;
    }
    
    // Função para mostrar a tabela detalhada de amortização
    function mostrarTabelaDetalhadaAmortizacao() {
        // Verificar se há resultados para mostrar
        if (!window.resultadosAmortizacao || window.resultadosAmortizacao.length === 0) {
            alert("Por favor, calcule a amortização primeiro.");
            return;
        }
        
        // Alternar visibilidade da tabela
        if (tabelaDetalhadaAmortizacao.classList.contains('hidden')) {
            // Limpar tabela
            tabelaDetalhadaAmortizacaoBody.innerHTML = '';
            
            // Preencher tabela com resultados
            for (const resultado of window.resultadosAmortizacao) {
                const row = document.createElement('tr');
                
                const anoCell = document.createElement('td');
                anoCell.textContent = resultado.ano;
                row.appendChild(anoCell);
                
                const prestacaoCell = document.createElement('td');
                prestacaoCell.textContent = resultado.prestacaoMensal.toFixed(2) + ' €';
                row.appendChild(prestacaoCell);
                
                const capitalCell = document.createElement('td');
                capitalCell.textContent = resultado.saldoDevedor.toFixed(2) + ' €';
                row.appendChild(capitalCell);
                
                const jurosCell = document.createElement('td');
                jurosCell.textContent = resultado.jurosPagos.toFixed(2) + ' €';
                row.appendChild(jurosCell);
                
                const amortizacaoCell = document.createElement('td');
                amortizacaoCell.textContent = resultado.amortizacaoTotal.toFixed(2) + ' €';
                row.appendChild(amortizacaoCell);
                
                tabelaDetalhadaAmortizacaoBody.appendChild(row);
            }
            
            // Mostrar tabela
            tabelaDetalhadaAmortizacao.classList.remove('hidden');
            verTabelaAmortizacaoBtn.textContent = 'Ocultar Tabela Detalhada';
        } else {
            // Ocultar tabela
            tabelaDetalhadaAmortizacao.classList.add('hidden');
            verTabelaAmortizacaoBtn.textContent = 'Ver Tabela Detalhada';
        }
    }
    
    // Função para calcular amortização
    function calcularAmortizacao() {
        // Obter valores dos inputs
        const montanteInicial = parseFloat(montanteInicialAmortizacao.value);
        const taxaJuroAnual = parseFloat(taxaJuroAnualAmortizacao.value);
        const prazoAnos = parseInt(prazoAnosAmortizacao.value);
        const valorAmortizacao = parseFloat(valorAmortizacaoRegular.value);
        const frequencia = frequenciaAmortizacao.value;
        
        // Validar inputs
        if (isNaN(montanteInicial) || isNaN(taxaJuroAnual) || isNaN(prazoAnos) || isNaN(valorAmortizacao)) {
            alert("Por favor, preencha todos os campos com valores numéricos.");
            return;
        }
        
        // Calcular prestação mensal normal (sem amortizações extra)
        const taxaMensal = taxaJuroAnual / 100 / 12;
        const prazoMeses = prazoAnos * 12;
        const prestacaoMensal = (montanteInicial * taxaMensal * Math.pow(1 + taxaMensal, prazoMeses)) / (Math.pow(1 + taxaMensal, prazoMeses) - 1);
        
        // Calcular o total pago sem amortizações extra
        const totalPagoNormal = prestacaoMensal * prazoMeses;
        
        // Simular amortizações extra
        let saldoDevedor = montanteInicial;
        let mesesComExtra = 0;
        let totalPagoComExtra = 0;
        
        // Determinar a frequência das amortizações
        let mesesPorAmortizacao = 12; // Anual por padrão
        if (frequencia === 'mensal') {
            mesesPorAmortizacao = 1;
        } else if (frequencia === 'trimestral') {
            mesesPorAmortizacao = 3;
        } else if (frequencia === 'semestral') {
            mesesPorAmortizacao = 6;
        }
        
        // Array para armazenar os resultados anuais para a tabela detalhada
        const resultadosAnuais = [];
        let jurosPagosAno = 0;
        let amortizacaoTotalAno = 0;
        let anoAtual = 1;
        let mesAtual = 1;
        
        while (saldoDevedor > 0) {
            mesesComExtra++;
            
            // Calcular juros do mês
            const jurosMes = saldoDevedor * taxaMensal;
            jurosPagosAno += jurosMes;
            
            // Calcular amortização normal (parte da prestação que abate ao capital)
            const amortizacaoNormal = prestacaoMensal - jurosMes;
            
            // Verificar se é mês de amortização extra
            let amortizacaoExtra = 0;
            if (mesesComExtra % mesesPorAmortizacao === 0) {
                amortizacaoExtra = valorAmortizacao;
            }
            
            amortizacaoTotalAno += (amortizacaoNormal + amortizacaoExtra);
            
            // Se completou um ano, registrar os resultados
            if (mesAtual === 12) {
                resultadosAnuais.push({
                    ano: anoAtual,
                    prestacaoMensal: prestacaoMensal,
                    saldoDevedor: saldoDevedor - (amortizacaoNormal + amortizacaoExtra),
                    jurosPagos: jurosPagosAno,
                    amortizacaoTotal: amortizacaoTotalAno
                });
                
                anoAtual++;
                mesAtual = 1;
                jurosPagosAno = 0;
                amortizacaoTotalAno = 0;
            } else {
                mesAtual++;
            }
            
            // Se o saldo devedor ficar negativo, ajustar
            if (saldoDevedor < amortizacaoNormal + amortizacaoExtra) {
                amortizacaoExtra = saldoDevedor - amortizacaoNormal;
                saldoDevedor = 0;
            } else {
                // Atualizar saldo devedor
                saldoDevedor -= (amortizacaoNormal + amortizacaoExtra);
            }
            
            // Atualizar total pago
            totalPagoComExtra += prestacaoMensal + amortizacaoExtra;
        }
        
        // Calcular poupança total
        const poupancaTotal = totalPagoNormal - totalPagoComExtra;
        
        // Calcular redução do prazo
        const reducaoPrazo = prazoMeses - mesesComExtra;
        
        // Atualizar resultados
        resultadoPoupancaTotal.textContent = poupancaTotal.toFixed(2) + " €";
        resultadoReducaoPrazo.textContent = Math.floor(reducaoPrazo / 12) + " anos e " + (reducaoPrazo % 12) + " meses";
        
        // Atualizar texto de tempo poupado
        const tempoPoupado = formatarTempoPoupado(prazoMeses, mesesComExtra);
        resultadoTextoAmortizacao.textContent = "Com amortizações regulares, termina o crédito " + tempoPoupado + " mais cedo e poupa " + poupancaTotal.toFixed(2) + " €.";
        
        // Preparar dados para o gráfico
        const anos = [];
        const saldoDevedorNormal = [];
        const saldoDevedorComExtra = [];
        
        // Calcular saldo devedor normal (sem amortizações extra) para cada ano
        let saldoNormal = montanteInicial;
        for (let ano = 0; ano <= prazoAnos; ano++) {
            anos.push("Ano " + ano);
            saldoDevedorNormal.push(saldoNormal);
            
            // Calcular saldo devedor no próximo ano
            if (ano < prazoAnos) {
                for (let mes = 0; mes < 12; mes++) {
                    const jurosMes = saldoNormal * taxaMensal;
                    const amortizacaoNormal = prestacaoMensal - jurosMes;
                    saldoNormal -= amortizacaoNormal;
                }
            }
        }
        
        // Calcular saldo devedor com amortizações extra para cada ano
        saldoDevedor = montanteInicial;
        mesesComExtra = 0;
        let anoAtualGrafico = 0;
        saldoDevedorComExtra.push(saldoDevedor); // Ano 0
        
        while (saldoDevedor > 0 && anoAtualGrafico < prazoAnos) {
            anoAtualGrafico++;
            
            for (let mes = 0; mes < 12 && saldoDevedor > 0; mes++) {
                mesesComExtra++;
                
                // Calcular juros do mês
                const jurosMes = saldoDevedor * taxaMensal;
                
                // Calcular amortização normal
                const amortizacaoNormal = prestacaoMensal - jurosMes;
                
                // Verificar se é mês de amortização extra
                let amortizacaoExtra = 0;
                if (mesesComExtra % mesesPorAmortizacao === 0) {
                    amortizacaoExtra = valorAmortizacao;
                }
                
                // Atualizar saldo devedor
                if (saldoDevedor < amortizacaoNormal + amortizacaoExtra) {
                    saldoDevedor = 0;
                } else {
                    saldoDevedor -= (amortizacaoNormal + amortizacaoExtra);
                }
            }
            
            saldoDevedorComExtra.push(saldoDevedor);
        }
        
        // Preencher o restante do array com zeros se o crédito terminar antes do prazo
        while (saldoDevedorComExtra.length <= prazoAnos) {
            saldoDevedorComExtra.push(0);
        }
        
        // Atualizar ou criar gráfico
        const ctx = document.getElementById('amortizacaoChart').getContext('2d');
        
        if (graficoAmortizacao) {
            graficoAmortizacao.data.labels = anos;
            graficoAmortizacao.data.datasets[0].data = saldoDevedorNormal;
            graficoAmortizacao.data.datasets[1].data = saldoDevedorComExtra;
            graficoAmortizacao.update();
        } else {
            graficoAmortizacao = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: anos,
                    datasets: [
                        {
                            label: 'Sem Amortizações Extra',
                            data: saldoDevedorNormal,
                            borderColor: '#ff6666',
                            backgroundColor: 'rgba(255, 102, 102, 0.1)',
                            borderWidth: 2,
                            fill: true
                        },
                        {
                            label: 'Com Amortizações Extra',
                            data: saldoDevedorComExtra,
                            borderColor: '#66cc66',
                            backgroundColor: 'rgba(102, 204, 102, 0.1)',
                            borderWidth: 2,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString() + ' €';
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' €';
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Guardar resultados para a tabela detalhada
        window.resultadosAmortizacao = resultadosAnuais;
    }
    
    // Função para calcular juros compostos
    function calcularJurosCompostos() {
        // Obter valores dos inputs
        const montanteInicial = parseFloat(montanteInicialJuros.value);
        const contribuicao = parseFloat(contribuicaoRegular.value);
        const frequenciaContrib = frequenciaContribuicao.value;
        const taxaJuroAnual = parseFloat(taxaJuroAnualJuros.value);
        const frequenciaJuros = frequenciaComposicaoJuros.value;
        const prazoAnos = parseInt(prazoAnosJuros.value);
        
        // Validar inputs
        if (isNaN(montanteInicial) || isNaN(contribuicao) || isNaN(taxaJuroAnual) || isNaN(prazoAnos)) {
            alert("Por favor, preencha todos os campos com valores numéricos.");
            return;
        }
        
        // Calcular juros compostos
        const resultado = calcularJurosCompostosFunc(
            montanteInicial,
            contribuicao,
            frequenciaContrib,
            frequenciaJuros,
            taxaJuroAnual,
            prazoAnos
        );
        
        // Atualizar resultados
        resultadoMontanteFinal.textContent = resultado.montanteFinal.toFixed(2) + " €";
        resultadoJurosGanhos.textContent = resultado.jurosTotais.toFixed(2) + " €";
        
        // Preparar dados para o gráfico
        const anos = resultado.resultados.map(r => "Ano " + r.ano);
        const montantes = resultado.resultados.map(r => r.montanteTotal);
        
        // Calcular contribuições acumuladas e juros acumulados
        const contribuicoesAcumuladas = [];
        const jurosAcumulados = [];
        
        let totalContribuicoes = montanteInicial;
        let totalJuros = 0;
        
        for (const r of resultado.resultados) {
            totalContribuicoes += r.contribuicoesAno;
            totalJuros += r.jurosAno;
            contribuicoesAcumuladas.push(totalContribuicoes);
            jurosAcumulados.push(totalJuros);
        }
        
        // Atualizar ou criar gráfico
        const ctx = document.getElementById('jurosCompostosChart').getContext('2d');
        
        if (graficoJurosCompostos) {
            graficoJurosCompostos.data.labels = anos;
            graficoJurosCompostos.data.datasets[0].data = montantes;
            graficoJurosCompostos.data.datasets[1].data = contribuicoesAcumuladas;
            graficoJurosCompostos.data.datasets[2].data = jurosAcumulados;
            graficoJurosCompostos.update();
        } else {
            graficoJurosCompostos = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: anos,
                    datasets: [
                        {
                            label: 'Montante Total',
                            data: montantes,
                            borderColor: '#e6b800',
                            backgroundColor: 'rgba(230, 184, 0, 0.1)',
                            borderWidth: 2,
                            fill: true
                        },
                        {
                            label: 'Contribuições',
                            data: contribuicoesAcumuladas,
                            borderColor: '#00b3b3',
                            backgroundColor: 'rgba(0, 179, 179, 0.1)',
                            borderWidth: 2,
                            fill: true
                        },
                        {
                            label: 'Rendimentos',
                            data: jurosAcumulados,
                            borderColor: '#6666ff',
                            backgroundColor: 'rgba(102, 102, 255, 0.1)',
                            borderWidth: 2,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString() + ' €';
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' €';
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Guardar resultados detalhados para a tabela
        window.resultadosDetalhados = resultado.resultados;
    }
    
    // Função para mostrar a tabela detalhada de juros compostos
    function mostrarTabelaDetalhada() {
        // Verificar se há resultados para mostrar
        if (!window.resultadosDetalhados || window.resultadosDetalhados.length === 0) {
            alert("Por favor, calcule os juros compostos primeiro.");
            return;
        }
        
        // Limpar tabela
        tabelaDetalhadaBody.innerHTML = '';
        
        // Calcular valores acumulados
        let contribuicoesAcumuladas = 0;
        
        // Preencher tabela com resultados
        for (const resultado of window.resultadosDetalhados) {
            const row = document.createElement('tr');
            
            const anoCell = document.createElement('td');
            anoCell.textContent = resultado.ano;
            row.appendChild(anoCell);
            
            // Acumular contribuições
            contribuicoesAcumuladas += resultado.contribuicoesAno;
            
            const contribuicoesCell = document.createElement('td');
            contribuicoesCell.textContent = contribuicoesAcumuladas.toFixed(2) + ' €';
            row.appendChild(contribuicoesCell);
            
            const jurosCell = document.createElement('td');
            jurosCell.textContent = resultado.jurosAno.toFixed(2) + ' €';
            row.appendChild(jurosCell);
            
            const montanteCell = document.createElement('td');
            montanteCell.textContent = resultado.montanteTotal.toFixed(2) + ' €';
            row.appendChild(montanteCell);
            
            tabelaDetalhadaBody.appendChild(row);
        }
        
        // Mostrar tabela
        tabelaDetalhada.classList.remove('hidden');
        verTabelaBtn.textContent = 'Ocultar Tabela Detalhada';
    }
    
    // Função para calcular objetivo financeiro
    function calcularObjetivo() {
        // Obter valores dos inputs
        const objetivo = parseFloat(montanteObjetivo.value);
        const montanteInicial = parseFloat(montanteInicialObjetivo.value);
        const prazoAnos = parseInt(prazoAnosObjetivo.value);
        const taxaJuroAnual = parseFloat(taxaJuroAnualObjetivo.value);
        const frequenciaContrib = frequenciaContribuicaoObjetivo.value;
        const frequenciaJuros = frequenciaComposicaoObjetivo.value;
        const jurosCompostos = jurosCompostosCheckbox ? jurosCompostosCheckbox.checked : true;
        
        // Validar inputs
        if (isNaN(objetivo) || isNaN(montanteInicial) || isNaN(prazoAnos) || isNaN(taxaJuroAnual)) {
            alert("Por favor, preencha todos os campos com valores numéricos.");
            return;
        }
        
        // Calcular contribuição necessária
        const contribuicaoNecessaria = calcularContribuicaoObjetivo(
            objetivo,
            montanteInicial,
            prazoAnos,
            taxaJuroAnual,
            frequenciaContrib,
            frequenciaJuros,
            jurosCompostos
        );
        
        // Simular evolução da poupança
        const simulacao = simularEvolucaoPoupanca(
            objetivo,
            montanteInicial,
            contribuicaoNecessaria,
            prazoAnos,
            taxaJuroAnual,
            frequenciaContrib,
            frequenciaJuros,
            jurosCompostos
        );
        
        // Atualizar resultados
        resultadoContribuicaoNecessaria.textContent = contribuicaoNecessaria.toFixed(2) + " €";
        resultadoMontanteTotalPoupado.textContent = simulacao.montanteFinal.toFixed(2) + " €";
        
        // Preparar dados para o gráfico
        const anos = simulacao.resultados.map(r => "Ano " + r.ano);
        const montantes = [];
        const contribuicoes = [];
        const rendimentos = [];
        
        let contribuicaoAcumulada = montanteInicial;
        let rendimentosAcumulados = 0;
        
        for (const r of simulacao.resultados) {
            contribuicaoAcumulada += r.contribuicoesAno;
            
            // Usar rendimentosAno para juros compostos ou juros simples
            if (r.jurosAno !== undefined) {
                rendimentosAcumulados += r.jurosAno;
            } else if (r.rendimentosAno !== undefined) {
                rendimentosAcumulados += r.rendimentosAno;
            }
            
            // Usar montanteTotal para juros compostos ou montanteAcumulado para juros simples
            if (r.montanteTotal !== undefined) {
                montantes.push(r.montanteTotal);
            } else if (r.montanteAcumulado !== undefined) {
                montantes.push(r.montanteAcumulado);
            }
            
            contribuicoes.push(contribuicaoAcumulada);
            rendimentos.push(rendimentosAcumulados);
        }
        
        // Linha horizontal para o objetivo
        const linhaObjetivo = Array(anos.length).fill(objetivo);
        
        // Atualizar ou criar gráfico
        const ctx = document.getElementById('objetivosChart').getContext('2d');
        
        if (graficoObjetivos) {
            graficoObjetivos.data.labels = anos;
            graficoObjetivos.data.datasets[0].data = montantes;
            graficoObjetivos.data.datasets[1].data = contribuicoes;
            graficoObjetivos.data.datasets[2].data = rendimentos;
            graficoObjetivos.data.datasets[3].data = linhaObjetivo;
            graficoObjetivos.update();
        } else {
            graficoObjetivos = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: anos,
                    datasets: [
                        {
                            label: 'Montante Total',
                            data: montantes,
                            borderColor: '#e6b800',
                            backgroundColor: 'rgba(230, 184, 0, 0.1)',
                            borderWidth: 2,
                            fill: true
                        },
                        {
                            label: 'Contribuições',
                            data: contribuicoes,
                            borderColor: '#00b3b3',
                            backgroundColor: 'rgba(0, 179, 179, 0.1)',
                            borderWidth: 2,
                            fill: true
                        },
                        {
                            label: 'Rendimentos',
                            data: rendimentos,
                            borderColor: '#6666ff',
                            backgroundColor: 'rgba(102, 102, 255, 0.1)',
                            borderWidth: 2,
                            fill: true
                        },
                        {
                            label: 'Objetivo',
                            data: linhaObjetivo,
                            borderColor: '#ff6666',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            fill: false,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString() + ' €';
                                }
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' €';
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Guardar resultados detalhados para a tabela
        window.resultadosDetalhados = simulacao.resultados;
    }

    // Função para atualizar as tabs ativas com base no scroll
    function atualizarTabsAtivas() {
        const sections = document.querySelectorAll('.calculator-section');
        const navLinks = document.querySelectorAll('nav ul li a');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= (sectionTop - 200)) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    // Executar cálculos automaticamente ao carregar a página
    function inicializarCalculadoras() {
        // Inicializar calculadora de amortização se os elementos existirem
        if (montanteInicialAmortizacao && taxaJuroAnualAmortizacao && prazoAnosAmortizacao && valorAmortizacaoRegular) {
            calcularAmortizacao();
        }
        
        // Inicializar calculadora de juros compostos se os elementos existirem
        if (montanteInicialJuros && contribuicaoRegular && taxaJuroAnualJuros && prazoAnosJuros) {
            calcularJurosCompostos();
        }
        
        // Inicializar calculadora de objetivos se os elementos existirem
        if (montanteObjetivo && montanteInicialObjetivo && prazoAnosObjetivo && taxaJuroAnualObjetivo) {
            calcularObjetivo();
        }
        
        // Inicializar as tabs ativas
        atualizarTabsAtivas();
    }
    
    // Executar inicialização após um pequeno atraso para garantir que todos os elementos estão carregados
    setTimeout(inicializarCalculadoras, 500);
});
