# Hamurabi - Ferramentas Financeiras

Simuladores financeiros em HTML, CSS e JavaScript puros (sem registo, sem servidor). Todos os cálculos acontecem no navegador.

Site: https://rubenaraujo.github.io/project_hamurabi/

## Ferramentas

| Ferramenta | O que faz |
| --- | --- |
| Crédito habitação | Prestação, total de juros, TAEG e teste de stress da Euribor (taxa fixa ou variável) |
| Amortização de crédito | Poupança em juros e prazo com amortizações regulares; Euribor variável |
| Investir ou amortizar | Compara o património final nas duas opções e calcula o rendimento de equilíbrio |
| Juros compostos | Crescimento com contribuições, inflação (valor real) e comparação de cenários |
| Objetivos financeiros | Contribuição necessária, com objetivo ajustado à inflação |
| Poupança para a reforma | Capital na reforma vs. capital necessário, em euros de hoje |
| Fundo de emergência | Meta, cobertura atual e tempo até atingir |

## Funcionalidades

- Resultados em tempo real, com sliders e tabelas anuais/mensais
- Partilha por ligação (valores na URL), simulações guardadas (localStorage)
- Exportação CSV e impressão / PDF
- Tema claro e escuro; português e inglês
- PWA (funciona offline) e SEO (Open Graph, JSON-LD)
- Acessibilidade: ligação "saltar para o conteúdo", `aria-live`, navegação por teclado

## Estrutura

```
index.html, legal.html, manifest.webmanifest, sw.js
css/styles.css
js/finance.js      motor de cálculo (funções puras, testado)
js/i18n.js         traduções PT/EN e formatação
js/shell.js        tema e idioma
js/core.js         gráficos, tabelas, CSV
js/calculator.js   amortização, juros compostos, objetivos
js/tools.js        habitação, investir vs amortizar, reforma, fundo
js/features.js     sliders, partilha, guardar, imprimir
tests/             testes (node:test)
```

## Desenvolvimento

```
npm test                     # testes do motor e das traduções
python3 -m http.server 8000  # servir localmente
```

## Fórmulas

- Prestação: `PMT = P · r / (1 − (1 + r)^−n)` (r = taxa mensal efetiva, n = meses). Com taxa variável a prestação é recalculada a cada revisão.
- Juros compostos: `FV = P · (1 + r/m)^(m·t) + PMT · [(1 + r/m)^(m·t) − 1] / (r/m)`.
- Valor real: `valor / (1 + inflação)^anos`.
- TAEG: taxa interna de rentabilidade mensal dos fluxos (capital menos comissões vs. prestações e seguros), anualizada. Não inclui imposto do selo.
- Investir vs. amortizar: nos dois cenários gasta o mesmo por mês; o património é a carteira (líquida de imposto sobre os ganhos) menos a dívida.
- Reforma: capital necessário = valor presente dos levantamentos crescentes com a inflação.

## Deploy

O workflow `.github/workflows/ci.yml` corre os testes e publica no GitHub Pages. Em Settings → Pages, defina a origem como **GitHub Actions**.

As simulações são indicativas e não constituem aconselhamento financeiro.
