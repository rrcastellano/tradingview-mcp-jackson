# 🏁 Resumo de Trade: 15/04/2026 — SPX 0DTE

Documentação da operação de Iron Condor em um dia de "Churn" e as lições sobre margem de segurança e leitura de fluxo.

## 🚀 O Desafio
O mercado apresentava deltas fracos e indicadores neutros (RSI em 50, MACD flat). Identificamos um cenário de **Consolidação/Squeeze**, ideal para a coleta de prêmio via **Iron Condor**. Montamos uma posição conservadora com strikes fora do range de 15 minutos.

- **Strikes:** PUT 6960/6920 | CALL 7020/7060
- **Estratégia:** Creditar a lateralidade e o decaimento de Theta (0DTE).

## 📉 Momentos Críticos e a "Caça de Liquidez"
Após um breve rompimento dos 7000, o mercado sofreu um recuo súbito para limpar mãos fracas.

> [!CAUTION]
> **O Erro do Stop Curto:** Configuramos um stop loss de "Perda 0" (Break-even), o que deixou a operação sem **Wiggle Room** (espaço para respirar). Às 13:47 BRT, o SPX tocou **6.984**, disparando o stop da perna de PUT devido à expansão da IV.

## 💰 O Desfecho (Gestão de Danos)
Após ser estopado na Put, houve uma preocupação com a retomada de alta, levando ao encerramento antecipado da perna de Call. 

> [!NOTE]
> **Perspectiva:** Perder apenas **-$50** em um dia que o SPX variou mais de 50 pontos (6967 a 7013) foi, na verdade, o **melhor cenário**. O trade "limpou" a volatilidade e o risco de um loss muito maior na perna de Call foi mitigado.

| Métrica | Resultado |
| :--- | :--- |
| **Entrada (Crédito)** | $2.75 |
| **Saída (Custo)** | $3.00 |
| **P&L Final** | **-$50.00** (2 contratos) 🔴 |

## 🎓 Lições e Insights Finais
* **Variabilidade e Ruído:** Em 0DTE, o mercado precisa de espaço. Um stop de "Break-even" total ignora a volatilidade intraday normal de 15-20 pontos. Na próxima, o Stop Loss deve ser aplicado à **Estrutura Completa** (Net Premium) para permitir o hedge natural entre as pernas.
* **Persistência do Delta:** O fluxo de compra mostrou-se resiliente (>200 Delta constante) mesmo com preço lateral (Absorção), sinalizando a explosão em direção aos 7000.
* **Churn vs. Tendência:** Identificamos a necessidade técnica de uma métrica para diferenciar dias de "Mastigação" (Churn) de dias de "Direção" (Trend). O uso de cruzamentos de VWAP e persistência de janelas de TICK será o foco da próxima atualização do script.
* **Sair no Susto vs. Sair no Plano:** Ter um plano de "Stop na Estrutura" teria evitado o encerramento da Put no fundo e da Call no repique (Whipsaw).

---
*Relatório gerado por **Antigravity AI** em parceria com **Ronaldo**.*
