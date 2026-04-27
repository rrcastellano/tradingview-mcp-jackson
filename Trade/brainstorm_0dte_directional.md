# 🧠 Brainstorm: Sistema de Direção + Timing para 0DTE Directional Debit Spreads

## Contexto

O trader opera SPX 0DTE com **Debit Spreads direcionais** (Bull Call / Bear Put) de 5 pontos, buscando custo de entrada < $2.00/contrato. A relação risco/retorno observada nos últimos dois trades é assimétrica e favorável:

| Trade | Estratégia | Entrada | Saída | Resultado |
|:---|:---|:---|:---|:---|
| 24/04 (Acerto) | Bull Call 7135/7140 | 1.75 | 4.85 | **+3.10** (+177%) |
| 27/04 (Erro) | Bear Put 7160/7155 | 1.35 | 0.60 | **-0.75** (-56%) |

**Edge real do trader:** Mesmo errando 50% dos trades, o P&L seria positivo (+2.35 líquido em 2 trades). O problema não é o sistema de execução — é a **taxa de acerto na direção e o timing de entrada**, que são os dois pontos fracos declarados.

**Ferramentas disponíveis:** TradingView Desktop com MCP (81 tools), indicadores Pine Script já implantados (0DTE Entry Decision v3.0, CumTICK Delta Table, Bollinger, RSI, MACD), acesso a dados macro pré-abertura (VIX, Gap %).

---

## Option A: "Morning Verdict" — Score de Direção Pré-Abertura Automatizado

### Conceito
Criar um **sistema de pontuação (score) pré-abertura** que agrega múltiplas variáveis macro e técnicas para gerar um viés direcional antes da abertura do mercado (10h30 BRT). Automatizar essa coleta via script que roda junto com o `morning_brief` do MCP.

### Como Funciona
Um script Python (ou extensão do `morning_brief`) coleta e pontua:

| Variável | Peso | Lógica |
|:---|:---|:---|
| **VIX Δ (hoje vs ontem)** | 20% | VIX caindo = bullish (+2), estável (0), subindo = bearish (-2) |
| **Gap % do SPX** | 20% | Gap > +0.3% = bull (+2), Gap < -0.3% = bear (-2), between = neutral (0) |
| **Futures ES pré-abertura** | 15% | Tendência dos últimos 30 min antes da abertura |
| **Sentimento de Notícias** | 15% | Macro headlines (tariffs, Fed, geopolítica) — input manual ou scraping |
| **CumTICK nos primeiros 5 min** | 15% | Esperar o "Initial Pulse" — se > +500 = bull, < -500 = bear |
| **Posição vs VWAP (primeiros 15 min)** | 15% | Preço sustentado acima = bull, abaixo = bear |

**Score final:** -10 a +10. Acima de +4 = Bull Call. Abaixo de -4 = Bear Put. Entre -4 e +4 = **Sem operação (WAIT)**.

### O que resolve
- **Direção:** Substitui o "gut feeling" por um checklist quantitativo.
- **Timing:** Força o trader a esperar os primeiros 15 minutos (evita Bull Traps de abertura como o de 24/04).
- **Disciplina:** Se o score diz "WAIT", não opera. Elimina trades forçados.

✅ **Pros:**
- Formaliza o processo que o trader já faz mentalmente (VIX, notícias, indicadores)
- Automatizável via MCP + `morning_brief` — pode rodar com um comando
- Cria um histórico de scores vs resultados para calibrar os pesos ao longo do tempo
- Baixo custo de implementação (extensão do que já existe)

❌ **Cons:**
- Não resolve o timing intraday (apenas o viés de abertura)
- O score pode dar "certo" na direção mas o mercado pode não se mover o suficiente (lateralização)
- Depende de calibração inicial dos pesos (pode levar 20-30 trades para ajustar)

📊 **Effort:** Medium (2-3 dias de desenvolvimento + 2 semanas de calibração)

---

## Option B: "Trigger Sniper" — Gatilho de Entrada Baseado em Confluência de Indicadores

### Conceito
Em vez de tentar prever a direção na abertura, **esperar o mercado revelar a direção e então otimizar o momento exato de entrada** para reduzir o custo do debit spread. A ideia central: o mercado dá a direção nos primeiros 30 minutos (Initial Balance). O trader entra **no pullback** dentro dessa direção, não no impulso.

### Como Funciona
**Fase 1 — Leitura de Direção (10:30–11:00 BRT):**
- Observar o *Initial Balance* (IB): range dos primeiros 30 minutos
- Se o preço romper o IB High → viés Bull
- Se o preço romper o IB Low → viés Bear
- Se ficar dentro do IB → **WAIT** (dia de chop)

**Fase 2 — Gatilho de Entrada (após rompimento do IB):**
O momento ideal para montar o Debit Spread é no **pullback ao IB** (reteste), não no rompimento. Confluência mínima de 3/4 gatilhos:

| Gatilho | Descrição |
|:---|:---|
| 1. **Preço retesta o IB boundary** | Após romper IB High, volta pra testar IB High como suporte |
| 2. **VWAP como suporte/resistência** | Preço toca a VWAP e respeita |
| 3. **RSI em zona de retração** | RSI entre 40-50 (bull pull) ou 50-60 (bear pull) |
| 4. **CumTICK confirma direção** | CumTICK alinhado com a direção do rompimento |

**Resultado:** A entrada no pullback naturalmente reduz o custo do spread (opções estão mais baratas no reteste do que no impulso).

### Exemplo Aplicado ao Trade de 24/04
- IB formou range 7113-7137 nos primeiros 30 min
- Às 12:45, SPX rompeu IB High (7137) com força → viés Bull
- **Gatilho ideal:** esperar o reteste do 7137 como suporte (que aconteceu por volta das 13:00-14:00 com SPX lateralizando em 7150-7157)
- Um Bull Call 7150/7155 montado no reteste teria custado ~1.20 e rendido ~3.80

### Exemplo Aplicado ao Trade de 27/04
- O IB formou range 7148-7168
- Às 14h00 o preço estava **dentro do IB**, sem rompimento claro para baixo
- **Resultado do filtro:** O gatilho diria **WAIT** — não montar a Bear Put sem rompimento do IB Low (7148)
- O trade de -0.75 **não teria existido**

✅ **Pros:**
- Resolve AMBOS os problemas (direção E timing) de forma integrada
- A lógica do IB já existe no seu Pine Script (0DTE Entry Decision v3.0 já calcula IB High/Low/Mid)
- Elimina trades contra a tendência (como o Bear Put de 27/04)
- O pullback reduz naturalmente o custo de montagem do spread

❌ **Cons:**
- Pode perder trades que "vão embora" sem pullback (dias de trend forte)
- Exige paciência extrema (pode significar não operar em 30-40% dos dias)
- O IB nem sempre é um predictor confiável (funciona melhor com VIX entre 15-25)

📊 **Effort:** Low-Medium (1-2 dias — ajustar o Pine Script + criar alertas no MCP)

---

## Option C: "Dual Engine" — Combinação A + B com Decisão em Cascata

### Conceito
Integrar os dois sistemas em uma **pipeline de decisão em cascata**: o Score de Direção (Option A) define o viés antes da abertura, e o Gatilho de Entrada (Option B) determina se/quando executar. Ambos precisam concordar para que o trade aconteça.

### Como Funciona

```
[Pré-Abertura]  Morning Score → Bull / Bear / WAIT
        ↓
[IB - 30 min]   IB Analysis → Confirma direção? → Sim / Não
        ↓
[Entrada]        Pullback ao IB + Confluência → Montar Spread / WAIT
        ↓
[Gestão]         Stop por Invalidação (preço perde VWAP ou volta pro IB)
```

### Regras Operacionais
1. **Morning Score ≥ +4:** Viés Bull. Procurar apenas Bull Call Spreads.
2. **Morning Score ≤ -4:** Viés Bear. Procurar apenas Bear Put Spreads.
3. **Score entre -4 e +4:** Sem operação direcional. Pode considerar IC se VIX > 20.
4. **IB confirma:** Se IB rompe na direção do score → buscar entrada no pullback.
5. **IB contradiz:** Se IB rompe CONTRA o score → **NÃO OPERAR** (conflito de sinais).
6. **Entrada:** Montar o spread quando 3/4 gatilhos de confluência estiverem alinhados.
7. **Time Stop:** Se nenhum gatilho disparar até 14h00 BRT → dia de observação.

### Aplicação Retroativa nos Trades Recentes

**24/04:**
- Morning Score: ~+6 (VIX normal, Gap +0.40% por notícia EUA-Irã, futures altistas)
- IB: 7113-7137, rompeu para cima às 12:45 → **CONFIRMADO** ✅
- Pullback: SPX retestou 7150 como suporte → **ENTRADA** ✅
- Resultado: +3.10/contrato

**27/04:**
- Morning Score: ~+1 (VIX normal, Gap -0.15% mild down, mixed signals)
- Score diz: **WAIT** (entre -4 e +4) ❌
- **Trade não teria sido executado.** Economia de -0.75/contrato.

### Implementação Técnica
1. **Script Python `morning_score.py`** — roda antes da abertura, puxa VIX via MCP, calcula score, grava em JSON
2. **Atualização do Pine Script** — adicionar label "ENTRY ZONE" quando IB rompe + pullback ocorre + RSI em zona de retração
3. **Alerta MCP** — configurar `alert_create` para notificar quando a confluência de gatilhos é atingida
4. **Trade Log Automático** — gravar score + gatilhos + resultado em JSON para calibração posterior

✅ **Pros:**
- Sistema completo de ponta a ponta (direção + timing + gestão + logging)
- Dois filtros independentes reduzem drasticamente falsos positivos
- Gera dados estruturados para backtesting e calibração contínua
- Aproveita 100% da infraestrutura existente (MCP + Pine Script + Trade folder)
- Elimina trades emocionais e forçados por design

❌ **Cons:**
- Complexidade maior de desenvolvimento e manutenção
- Pode ser "over-engineered" para começar — risco de paralisia por análise
- Taxa de operação cai significativamente (pode operar apenas 2-3 dias por semana)
- Requer disciplina para confiar no sistema e não fazer "overrides" manuais

📊 **Effort:** Medium-High (4-5 dias de desenvolvimento + 3-4 semanas de calibração)

---

## 💡 Recomendação

**Option B ("Trigger Sniper")** como ponto de partida, com evolução gradual para **Option C ("Dual Engine")**.

### Justificativa:

1. **Impacto imediato no seu ponto mais fraco.** A análise retroativa mostra que o filtro de IB + pullback teria **eliminado o trade perdedor de hoje** e **melhorado a entrada do trade vencedor de quinta**. Isso já resolve 80% do problema com esforço mínimo.

2. **Você já tem a infraestrutura.** O seu Pine Script "0DTE Entry Decision v3.0" já calcula IB High/Low/Mid. Adicionar o gatilho de pullback é uma extensão natural, não uma reescrita.

3. **Preserva seu edge.** O que funciona no seu sistema (spread de 5 pontos, custo < $2, disciplina de stop) não precisa mudar. Estamos apenas adicionando um **filtro de qualidade** na entrada.

4. **Caminho de evolução claro.** Depois de 2-3 semanas operando com o filtro de IB, você terá dados suficientes para calibrar o Morning Score (Option A) e montar o sistema cascata completo (Option C).

### Plano de Execução Sugerido:
- **Semana 1:** Ajustar o Pine Script para gerar um label visual "ENTRY ZONE" quando ocorrer pullback ao IB com confluência
- **Semana 2-3:** Operar com o filtro e registrar scores/resultados
- **Semana 4:** Implementar o Morning Score e integrar no pipeline

---

Qual direção gostaria de explorar?
