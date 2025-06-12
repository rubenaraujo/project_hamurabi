# Hamurabi - Ferramentas Financeiras v2.0

Hamurabi é uma aplicação web que oferece ferramentas financeiras interativas para ajudar na tomada de decisões financeiras informadas.

## Funcionalidades

### 1. Calculadora de Amortização de Crédito

Esta calculadora permite simular o impacto de amortizações regulares num crédito, mostrando:

- **Poupança Total**: Quanto dinheiro poupa em juros ao fazer amortizações regulares
- **Redução do Prazo**: Quantos anos reduz do prazo do crédito
- **Tempo Poupado**: Exatamente quantos anos e meses economiza ao fazer amortizações regulares
- **Visualização Gráfica**: Comparação visual entre o cenário com e sem amortizações extras
- **Tabela Detalhada**: Evolução anual do capital em dívida, juros pagos e amortizações

#### Fórmula Utilizada

Para calcular a prestação mensal:
```
PMT = P × [r × (1 + r)^n] / [(1 + r)^n - 1]
```
Onde:
- PMT = Prestação mensal
- P = Montante inicial do empréstimo
- r = Taxa de juro mensal (taxa anual / 12 / 100)
- n = Número total de prestações (prazo em anos × 12)

### 2. Calculadora de Juros Compostos

Esta calculadora permite simular o crescimento de um investimento ao longo do tempo com juros compostos, mostrando:

- **Montante Final**: Valor total acumulado no final do período
- **Juros Ganhos**: Quanto dinheiro ganhou em juros
- **Visualização Gráfica**: Evolução do montante total, contribuições e juros ao longo do tempo
- **Tabela Detalhada**: Valores anuais de contribuições, juros e montante total
- **Frequência de Contribuição**: Escolha entre contribuições mensais, trimestrais, semestrais ou anuais
- **Frequência de Composição dos Juros**: Escolha entre capitalização mensal, trimestral, semestral ou anual

#### Fórmula Utilizada

A calculadora utiliza a fórmula matemática padrão para juros compostos com contribuições periódicas:

```
FV = P × (1 + r/m)^(m×t) + PMT × [(1 + r/m)^(m×t) - 1] / (r/m)
```

Onde:
- FV = Valor futuro (montante final)
- P = Montante inicial
- PMT = Contribuição regular
- r = Taxa de juro anual (em decimal)
- m = Número de períodos de composição por ano
- t = Tempo em anos

Esta fórmula garante que:
1. Quanto maior a frequência de composição (m), maior o montante final (FV)
2. A ordem correta de rendimento é: mensal > trimestral > semestral > anual


### 3. Calculadora de Objetivos Financeiros

Esta calculadora permite determinar quanto precisa poupar regularmente para atingir um objetivo financeiro específico, mostrando:

- **Contribuição Necessária**: Quanto precisa poupar regularmente para atingir o objetivo
- **Montante Total Poupado**: Valor total acumulado no final do período
- **Visualização Gráfica**: Evolução do montante acumulado em relação ao objetivo
- **Tabela Detalhada**: Valores anuais de contribuições, rendimentos e montante acumulado
- **Frequência de Contribuição**: Escolha entre contribuições mensais, trimestrais, semestrais ou anuais
- **Frequência de Composição dos Juros**: Escolha entre capitalização mensal, trimestral, semestral ou anual
- **Opção de Juros Compostos**: Possibilidade de alternar entre cálculos com juros simples ou compostos

#### Fórmula Utilizada

Para calcular a contribuição necessária com juros compostos, a calculadora utiliza um método iterativo que considera as diferentes frequências de contribuição e composição:

1. Estima uma contribuição inicial usando a fórmula aproximada:
   ```
   PMT = (FV - P × (1 + r/m)^(m×t)) / ((1 + r/m)^(m×t) - 1) × (r/m)
   ```

2. Refina esta estimativa através de simulações sucessivas até encontrar o valor exato que atinge o objetivo no prazo definido.

Onde:
- PMT = Contribuição regular necessária
- FV = Valor futuro (montante objetivo)
- P = Montante inicial
- r = Taxa de juro anual (em decimal)
- m = Número de períodos de composição por ano
- t = Tempo em anos

Para juros simples:
```
PMT = (FV - P - (P × r × t)) / (n)
```
Onde n é o número total de contribuições ao longo do período.

A implementação considera a sincronização precisa entre os momentos de contribuição e os momentos de composição dos juros, garantindo resultados exatos independentemente das combinações de frequências escolhidas.
