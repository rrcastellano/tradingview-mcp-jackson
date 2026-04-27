# Resumo de Operação SPX 0DTE - 27 de Abril de 2026

## 1. Visão Geral do Mercado e Anomalia da Manhã

O dia foi marcado por um fluxo direcional comprador no índice SPX, consolidado acima da VWAP. Destacou-se uma **anomalia extrema de liquidez às 11h36**, onde o mercado experimentou um "Gap Up" repentino de 8 pontos no gráfico de 1 minuto (de 7157.55 para 7165.58), cravando a máxima exatamente no _Initial Balance High_ (7167.71). Apesar da absorção inicial no topo, o SPX manteve a estrutura de alta ancorada na VWAP e na média de Bollinger.

## 2. Dados da Operação (Trade Log)

- **Ativo:** SPX (0DTE)
- **Estratégia:** Bear Put Debit Spread (Compra Put 7160 / Venda Put 7155)
- **Horário de Entrada:** 14h00 (Brasília)
- **Custo de Entrada:** -1.35
- **Gatilho Utilizado pelo Trader:** Fluxo institucional fortemente negativo (CumTICK Delta atingiu -7469).
- **Horário de Saída:** 14h58 (Brasília)
- **Preço de Saída:** 0.60
- **Resultado:** Prejuízo reduzido de -0.75 (Stop Técnico Acionado).

## 3. Análise da Estrutura e Execução

### A. O Cenário na Entrada (14h00)

A operação foi montada sob a premissa de que o forte fluxo vendedor (CumTICK afundando) arrastaria o preço para baixo. No entanto, às 14h00, o preço estava ignorando a agressão vendedora e **subindo** de 7165.40 para 7167.63.

### B. O Fenômeno da Absorção Passiva (Passive Absorption)

A divergência entre o fluxo negativo e o preço sustentado na região de 7170 revelou a presença de compradores passivos (ordens iceberg) que absorveram toda a oferta institucional. Apostar na ponta vendedora contra esse cenário ("operar o indicador ao invés do preço") resultou em uma entrada prematura contra um mercado ancorado.

### C. A Saída Disciplinada (14h58)

Com o SPX estacionado na região do 7170.63 e o fluxo do TICK revertendo, a decisão de liquidar a posição a 0.60 foi a mais profissional possível. Isso cortou o desgaste brutal do _Theta_ (que destruiria o prêmio na hora final) e evitou um _Short Squeeze_ gerado pela exaustão dos vendedores. Recuperou-se quase 50% do capital investido num _setup_ que havia falhado estruturalmente.

## 4. Lições Aprendidas (Post-Mortem / Ajustes Técnicos)

1. **Indicador de Fluxo x Ação do Preço:** Um _CumTICK_ negativo durante um candle verde de força (alta) indica absorção (smart money comprando passivamente). **Ajuste:** Nunca vender agressivamente contra o candle. O sinal real de venda seria aguardar o preço perder a mínima do candle anterior para confirmar que a absorção acabou.
2. **Seleção de Strike (Risco de Theta):** Comprar opções OTM (strike 7160 com mercado a 7167) na segunda metade do pregão 0DTE é uma aposta altíssima contra o decaimento temporal. **Ajuste:** Operações direcionais à tarde exigem proteção (ATM ou levemente ITM) para não depender exclusivamente de uma queda vertical para gerar lucro.
3. **Falta de Gatilho de Confirmação:** O _Bear Put_ foi montado para antecipar uma queda que rompesse a VWAP (7161). **Ajuste:** O trade correto exigiria paciência. O gatilho não é o _CumTICK_ caindo, mas sim o **preço fechando abaixo da VWAP (7161)** com o fluxo confirmando o rompimento. Entrar antes disso é tentar "adivinhar topo".

---

_Documento gerado automaticamente pelo assistente de IA integrado ao MCP do TradingView após avaliação pós-trade._
