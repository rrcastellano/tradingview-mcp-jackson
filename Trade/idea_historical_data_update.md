# 📊 Atualização de Dados Históricos — Status

> Executado em: 2026-04-27 16:30 ET

## Resultados

| Símbolo | Barras Extraídas | Range Novo | Gap Restante |
|---------|-----------------|------------|--------------|
| **SPX** | ✅ 9.455 barras | 2026-03-23 09:30 → 2026-04-24 16:02 ET | Nenhum! ✅ |
| **VIX** | ⚠️ 10.612 barras | 2026-04-06 03:15 → 2026-04-24 16:15 ET | 2026-03-20 → 2026-04-06 |
| **TICK** | ⚠️ 840 barras | 2026-04-22 15:00 → 2026-04-24 15:59 ET | 2026-03-20 → 2026-04-22 |

## Observações

### SPX — Cobertura Completa ✅
- O TradingView carregou dados 1-min de até ~25 dias úteis para trás
- Formato idêntico ao existente, sem gaps nem overlaps
- Volume agora tem valores reais (antes era 0 nos dados antigos do Alpaca)

### VIX — Gap Parcial ⚠️
- TradingView limitou o histórico 1-min a ~14 dias úteis para o VIX
- O VIX no TV inclui dados **fora de horário de mercado** (pre/after market)
- Existe um gap de **2026-03-20 a 2026-04-06** que precisará de outra fonte

### TICK — Gap Significativo ⚠️
- O TICK (USI:TICK) tem histórico 1-min muito limitado no TradingView (~3 dias)
- Existe um gap de **2026-03-20 a 2026-04-22**
- Alternativa: usar dados do Yahoo Finance ou solicitar via Alpaca API

## Totais Atuais dos Arquivos

| Arquivo | Linhas Totais |
|---------|--------------|
| SPX.csv | 521.404 |
| VIX.csv | 790.613 |
| TICK.csv | 493.481 |

## Script Utilizado

`/Users/ronaldo.ribeirocastellano/Github/tradingview-mcp/scripts/update_historical.mjs`

Técnica: Mouse-drag simulation via CDP (Chrome DevTools Protocol) para forçar o TradingView Desktop a carregar dados históricos 1-min.

## Próximos Passos

1. **VIX**: Avaliar se o gap de 2 semanas impacta as análises; considerar dados 5-min como alternativa
2. **TICK**: Buscar fonte alternativa (Yahoo Finance?) para preencher o gap de 1 mês
3. **Automação**: O script pode ser re-executado periodicamente para manter os dados atualizados
