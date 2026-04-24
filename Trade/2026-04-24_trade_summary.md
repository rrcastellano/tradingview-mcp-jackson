# 🏁 Resumo de Trade: 24/04/2026 — SPX 0DTE

Documentação de um Bull Call Spread executado com paciência cirúrgica, navegando Bull Trap de abertura, problema de liquidez Deep ITM e convergência de Theta para capturar +177% de retorno.

## 📋 Configuração da Operação
| Parâmetro | Valor |
|:---|:---|
| **Tipo** | Debit Spread (Bull Call) |
| **Estrutura** | Long 7135 C / Short 7140 C |
| **Contratos** | 2 |
| **Custo de Entrada** | 1,75 pts ($175/contrato) |
| **Investimento Total** | $350 |
| **Breakeven** | 7136,75 |
| **Lucro Máximo Teórico** | 3,25 pts ($325/contrato) |
| **Horário de Entrada** | 10:54 (Brasília) |
| **Horário de Saída** | 16:05 (Brasília) |

## 🏆 Resultado Final
| Parâmetro | Valor |
|:---|:---|
| **Preço de Saída** | 4,85 pts |
| **Lucro por Contrato** | 3,10 pts ($310) |
| **Lucro Total (2 contratos)** | **$620** |
| **Retorno sobre Risco** | **+177%** 🟢 |
| **SPX no Momento da Saída** | ~7160 |
| **Duração da Operação** | 5h11min |

## 🚀 O Desafio
Notícia de negociações EUA-Irã provocou gap de alta na abertura (+0,40%). A decisão foi entrar com um **Bull Call Spread 7135/7140** a débito, apostando na continuidade do momentum altista. O mercado abriu em 7136 (exatamente no breakeven) e **rejeitou imediatamente**, caindo 15 pontos nos primeiros 30 minutos.

## 📉 Momentos Críticos e Gestão Emocional
Após a abertura, o SPX despencou para **7112,82**, colocando a operação 23 pontos OTM. O suporte crítico de 7118 foi violado.

> [!WARNING]
> **Momento de Pressão:** Com o SPX abaixo do VWAP e do suporte, a operação parecia condenada. Porém, a estrutura manteve valor (1,85 vs custo de 1,75) graças à expansão de IV pela notícia.

**A decisão de manter a posição baseou-se em:**
1. **Resiliência do Prêmio:** Mesmo OTM, a estrutura valia mais do que o custo — Vega compensando Delta.
2. **Notícia como Catalisador:** Expectativa de que o mercado "digerisse" a notícia e retomasse a alta.
3. **VWAP como Bússola:** O VWAP subindo consistentemente sinalizava acumulação institucional.

## ⏱️ Cronologia do Trade

### 10:30 — Abertura do Mercado
- SPX abre em **7136,48** (gap de alta pela notícia EUA-Irã)
- Preço atinge rapidamente 7137 (acima do breakeven) mas **rejeita imediatamente**
- Queda para 7122 nos primeiros 30 minutos — Bull Trap de abertura
- Volume explosivo: **130M** no primeiro minuto, seguido de queda abrupta

### 10:54 — Entrada na Operação
- SPX em **7117,58** — operação 17 pontos OTM do strike inferior
- Short Call 7135: pago -8,26
- Long Call 7140: vendido 6,51
- **Saldo líquido: -1,75 × 2 contratos = -$350**
- Strikes, breakeven (7136,75) e suporte crítico (7118) marcados no gráfico

### 11:05 — Sinal de Resiliência
- Apesar do SPX em queda, estrutura valendo **1,85** (+5,7%)
- Diagnóstico: expansão de IV (Vega) compensando a perda de Delta
- Decisão do trader: **aguardar até 12h**

### 11:06 — Suporte Testado
- SPX toca a mínima do dia em **7112,82**
- Suporte de 7118 violado temporariamente
- RSI (1m) em zona de sobrevenda, indicando possível repique

### 12:45 — Explosão de Alta
- SPX dispara para **7153** (+28 pontos desde a mínima)
- Notícia de negociações EUA-Irã confirmada pelo mercado
- Estrutura totalmente ITM — valor intrínseco de 5,00
- Ordem de saída colocada a 4,50, depois ajustada para 4,80

### 13:22 — Teste de Paciência (Liquidez Deep ITM)
- Estrutura em **4,20** apesar do SPX em 7157
- Diagnóstico: problema de liquidez Deep ITM, não de preço
- Market Makers ofertando Bid baixo para lucrar no spread
- Decisão: manter ordem em 4,80

### 13:59 — VWAP Convergindo
- VWAP subiu para **7140,99** — velocidade de +0,08 pts/minuto
- Projeção de VWAP atingir 7150 por volta das 15:47
- Estrutura sobe para **4,40** com SPX estável

### 15:17 — Convergência do Theta
- Estrutura sobe para **4,50** com SPX estável em 7156
- Theta começa a trabalhar a favor — valor extrínseco evaporando
- Bollinger Bands comprimindo — volatilidade morrendo
- Ordem ajustada para **4,90**

### 15:51 — Quase lá
- Estrutura em **4,70**, RSI e MACD confirmando estabilidade
- SPX lateral entre 7155-7159 (range de apenas 3,8 pts)
- Projeção de execução entre 16:15-16:30

### 16:03 — Phantom Fill
- Mark price atinge 4,90 mas ordem **não executa**
- Diagnóstico: o Bid real era ~4,80, o Mark mostrado era a média entre Bid/Ask
- Decisão: baixar ordem para **4,85**

### 16:05 — Trade Encerrado ✅
- **Saída executada a 4,85**
- Lucro total: **$620 (+177%)**

## 💰 O Desfecho (Paciência Recompensada)
Às 12:45 BRT, o SPX disparou para **7153**, superando amplamente os dois strikes. A operação entrou totalmente ITM.

O desafio final foi a **liquidez Deep ITM**: o mercado cotava a estrutura a 4,20 quando o valor intrínseco era 5,00. A decisão foi aguardar a convergência do Theta, que forçou o preço a subir para 4,70 → 4,85 nas últimas horas.

Um "phantom fill" a 4,90 (Mark atingiu o preço mas o Bid real era menor) forçou o ajuste final da ordem para **4,85**, que executou às 16:05.

## 📊 Indicadores no Momento de Saída
| Indicador | Valor | Leitura |
|:---|:---|:---|
| **VWAP** | 7147,19 | Preço 13 pts acima — tendência forte |
| **RSI (1m)** | 62,72 | Zona saudável, sem sobrecompra |
| **MACD Hist** | +0,36 | Momentum positivo |
| **Bollinger Basis** | 7158,33 | Preço na média — consolidação |
| **Bollinger Range** | 7154,83 – 7161,82 | Bandas apertadas — volatilidade comprimida |

## 📸 Evidência Visual (Gráfico no Encerramento)
![Gráfico SPX Trade Encerrado](./2026-04-24_spx_chart.png)

## 🎓 Lições Aprendidas
1. **Paciência é Alpha.** A operação passou por 4 momentos de tentação de saída prematura (1,85 → 4,20 → 4,50 → 4,70). Manter a disciplina capturou quase o lucro máximo.
2. **Notícia como Catalisador.** A tese direcional estava correta, mas o timing de entrada (pré-abertura) exigiu convicção durante o pullback inicial. Gaps de notícia frequentemente sofrem "sell the news" nos primeiros 30 minutos — a oportunidade real surgiu após a digestão do mercado.
3. **Liquidez Deep ITM é Real.** Em 0DTE, o spread Bid/Ask de opções muito dentro do dinheiro pode representar 10-15% de desconto sobre o valor intrínseco. O Theta resolve isso nas últimas horas.
4. **Mark ≠ Bid.** O preço "Mark" exibido pela corretora é a média entre Bid e Ask. Para ordens limitadas, considerar sempre 0,05 abaixo do Mark para garantir execução.
5. **Theta é Aliado no Final.** A partir das 15h, o decaimento temporal forçou a convergência do preço da estrutura para o valor intrínseco. A "Power Hour" é quando os spreads Deep ITM convergem para o valor real.
6. **VWAP como Bússola.** O VWAP subindo consistentemente durante o dia sinalizava acumulação institucional e serviu como suporte dinâmico durante toda a operação.

---
*Relatório gerado por **Antigravity AI** em parceria com **Ronaldo**.*
