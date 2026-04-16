# 📚 Estratégias de Opções — Guia de Referência

---

> [!IMPORTANT]
> ## Regra de Ouro: Débito vs Crédito
>
> **DÉBITO**  = Você PAGA para entrar   → Lucra se o mercado SE MOVE na sua direção.
> **CRÉDITO** = Você RECEBE para entrar → Lucra se o mercado NÃO SE MOVE contra você (theta decay a seu favor).

| Tipo | Você... | Risco Max | Lucro Max | Precisa que o preço... |
|------|---------|-----------|-----------|----------------------|
| **Débito** | Paga upfront | O que pagou | Muito maior | **Se mova** |
| **Crédito** | Recebe upfront | Muito maior | O que recebeu | **Fique parado** |

---

## 🟢 ESTRATÉGIAS BULLISH (Aposta na ALTA)

### 1. Bull Call Spread (Débito) ⭐

```
COMPRAR Call strike menor  ← paga mais (ATM/ITM)
VENDER  Call strike maior  ← recebe menos (OTM)
════════════════════════
Saldo: DÉBITO (você paga)
```

| Campo | Valor |
|-------|-------|
| **Lucra se** | Preço SOBE acima do breakeven |
| **Perde se** | Preço fica ABAIXO do long strike |
| **Max Profit** | Largura do spread − débito |
| **Max Loss** | Débito pago |
| **Quando usar** | Viés bullish, quer limitar risco |

> [!TIP]
> **Dica:** COMPRAR o strike mais perto do preço atual (ATM/ITM), VENDER o strike mais longe (OTM).

---

### 2. Bull Put Spread (Crédito)

```
VENDER  Put strike maior   ← recebe mais (mais perto do preço)
COMPRAR Put strike menor   ← paga menos (mais longe, proteção)
════════════════════════
Saldo: CRÉDITO (você recebe)
```

| Campo | Valor |
|-------|-------|
| **Lucra se** | Preço fica ACIMA do short put |
| **Perde se** | Preço CAI abaixo do long put |
| **Max Profit** | Crédito recebido |
| **Max Loss** | Largura do spread − crédito |
| **Quando usar** | Viés bullish/neutro, coletar prêmio |

---

## 🔴 ESTRATÉGIAS BEARISH (Aposta na QUEDA)

### 3. Bear Put Spread (Débito)

```
COMPRAR Put strike maior   ← paga mais (ATM/ITM)
VENDER  Put strike menor   ← recebe menos (OTM)
════════════════════════
Saldo: DÉBITO (você paga)
```

| Campo | Valor |
|-------|-------|
| **Lucra se** | Preço CAI abaixo do breakeven |
| **Perde se** | Preço fica ACIMA do long put |
| **Max Profit** | Largura do spread − débito |
| **Max Loss** | Débito pago |

---

### 4. Bear Call Spread (Credit)

```
VENDER  Call strike menor   ← recebe mais (mais perto do preço)
COMPRAR Call strike maior   ← paga menos (mais longe, proteção)
════════════════════════
Saldo: CRÉDITO (você recebe)
```

> [!WARNING]
> **Erro comum:** Confundir com Bull Call. No Bear Call você VENDE o strike menor (mais perto). No Bull Call você COMPRA o strike menor. Se o mercado subir muito, esta estratégia tem prejuízo máximo alto.

---

## 🟡 ESTRATÉGIAS NEUTRAS (Aposta que NÃO se move)

### 5. Iron Condor (Crédito) ⭐

```
COMPRAR Put  strike A  (mais longe, proteção)
VENDER  Put  strike B  (mais perto)         ← Bull Put Spread
─────── preço atual ───────
VENDER  Call strike C  (mais perto)         ← Bear Call Spread  
COMPRAR Call strike D  (mais longe, proteção)
════════════════════════
Saldo: CRÉDITO (soma dos dois spreads)
```

| Campo | Valor |
|-------|-------|
| **Lucra se** | Preço fica ENTRE B e C |
| **Perde se** | Preço rompe A ou D |
| **Quando usar** | Mercado lateral, VIX alto |

---

## 📊 Tabela Resumo

| # | Estratégia | Tipo | Direção | Você quer que o preço... |
|---|-----------|------|---------|--------------------------|
| 1 | **Bull Call** | Débito | 🟢 Alta | **SUBA** |
| 2 | **Bull Put** | Crédito | 🟢 Alta/Neutro | **NÃO caia** |
| 3 | **Bear Put** | Débito | 🔴 Queda | **CAIA** |
| 4 | **Bear Call** | Crédito | 🔴 Queda/Neutro | **NÃO suba** |
| 5 | **Iron Condor** | Crédito | 🟡 Neutro | **FIQUE parado** |

---

> [!TIP]
> ## 🧠 Macete para Nunca Confundir
>
> 1. **"BULL"** = Aposta na ALTA | **"BEAR"** = Aposta na QUEDA
> 2. No spread de **DÉBITO** (Bull Call / Bear Put): Você **COMPRA** o strike mais perto do preço.
> 3. No spread de **CRÉDITO** (Bull Put / Bear Call): Você **VENDE** o strike mais perto do preço.
>
> **Resumo:** 
> - Viés de ALTA + quer movimento? → Bull Call (Compra o strike de baixo).
> - Viés de ALTA + quer prêmio? → Bull Put (Vende o strike de cima).
