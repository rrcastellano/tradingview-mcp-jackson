#!/usr/bin/env node
/**
 * Automatic 1-min OHLCV updater for SPX, VIX, and TICK.
 *
 * Reads the last timestamp from each CSV, connects to TradingView Desktop
 * via CDP, scrolls the chart to load history, and appends new bars.
 *
 * Prerequisites:
 *   - TradingView Desktop open with a chart (--remote-debugging-port=9222)
 *   - npm install chrome-remote-interface (already in tradingview-mcp)
 *
 * Usage:
 *   node scripts/update_historical.mjs                  # Update all symbols
 *   node scripts/update_historical.mjs --symbol SPX     # Single symbol
 *   node scripts/update_historical.mjs --dry-run        # Preview only
 *   node scripts/update_historical.mjs --end 2026-04-24 # Custom end date
 */

import CDP from 'chrome-remote-interface';
import fs from 'fs';
import path from 'path';

// ─── Config ──────────────────────────────────────────────────────────
const CDP_PORT = 9222;
const DATA_DIR = '/Users/ronaldo.ribeirocastellano/Github/alpaca/data';

const SYMBOLS = {
  SPX:  'SP:SPX',
  VIX:  'CBOE:VIX',
  TICK: 'USI:TICK',
  ES:   'ES1!',
};

const TV = 'window.TradingViewApi._activeChartWidgetWV.value()';
const BARS = `${TV}._chartWidget.model().mainSeries().bars()`;

// Scroll tuning
const DRAG_PX          = 1200;   // pixels per drag
const DRAG_STEPS       = 20;     // mouse move steps per drag
const WAIT_SYMBOL_MS   = 5000;   // wait after symbol change
const WAIT_TF_MS       = 5000;   // wait after timeframe change
const WAIT_SCROLL_MS   = 2000;   // wait after each scroll drag
const STALE_LIMIT      = 5;      // consecutive no-growth before reset
const MAX_ROUNDS       = 100;    // max scroll attempts per symbol

// ─── Helpers ─────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pad   = n  => String(n).padStart(2, '0');

function etOffset(utc) {
  const y = utc.getUTCFullYear();
  const mar1 = new Date(Date.UTC(y, 2, 1));
  const dstOn = new Date(Date.UTC(y, 2, 8 + (7 - mar1.getUTCDay()) % 7, 7));
  const nov1 = new Date(Date.UTC(y, 10, 1));
  const dstOff = new Date(Date.UTC(y, 10, 1 + (7 - nov1.getUTCDay()) % 7, 6));
  return utc >= dstOn && utc < dstOff ? -4 : -5;
}

function toCsvRow(ts, o, h, l, c, v) {
  const utc = new Date(ts * 1000);
  const off = etOffset(utc);
  const et  = new Date(utc.getTime() + off * 3_600_000);
  const u = d => `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}`;
  const t = d => `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
  return `${u(utc)},${t(utc)},UTC,${u(et)},${t(et)},ET,${o.toFixed(4)},${h.toFixed(4)},${l.toFixed(4)},${c.toFixed(4)},${v.toFixed(4)}`;
}

function readLastTs(csvPath) {
  const buf  = fs.readFileSync(csvPath);
  const text = buf.toString('utf-8');
  const lines = text.trimEnd().split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].replace(/\r/g, '');
    if (!line || line.startsWith('utc_date')) continue;
    const [date, time] = line.split(',');
    const ts = Math.floor(new Date(`${date}T${time}Z`).getTime() / 1000);
    if (!isNaN(ts)) return ts;
  }
  return 0;
}

// ─── CDP wrapper ─────────────────────────────────────────────────────
class TradingViewCDP {
  constructor(client) { this.client = client; }

  async eval(expr) {
    const { result, exceptionDetails } = await this.client.Runtime.evaluate({
      expression: expr, returnByValue: true, awaitPromise: false,
    });
    if (exceptionDetails) {
      throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
    }
    return result?.value;
  }

  async evalAsync(expr) {
    const { result, exceptionDetails } = await this.client.Runtime.evaluate({
      expression: expr, returnByValue: true, awaitPromise: true,
    });
    if (exceptionDetails) {
      throw new Error(exceptionDetails.exception?.description || exceptionDetails.text);
    }
    return result?.value;
  }

  async chartState() {
    return this.eval(`(function(){ var c=${TV}; return {symbol:c.symbol(),resolution:c.resolution()}; })()`);
  }

  async setSymbol(sym) {
    await this.evalAsync(`(function(){ return new Promise(r=>{ ${TV}.setSymbol('${sym}',{}); setTimeout(r,500); }); })()`);
    await sleep(WAIT_SYMBOL_MS);
    return this.eval(`${TV}.symbol()`);
  }

  async setTimeframe(tf) {
    await this.eval(`(function(){ ${TV}.setResolution('${tf}',{}); })()`);
    await sleep(WAIT_TF_MS);
    return this.eval(`${TV}.resolution()`);
  }

  async barsInfo() {
    return this.eval(`(function(){
      var b=${BARS}; if(!b) return null;
      var f=b.valueAt(b.firstIndex()), l=b.valueAt(b.lastIndex());
      return {size:b.size(), firstTs:f?f[0]:0, lastTs:l?l[0]:0,
              firstDate:f?new Date(f[0]*1000).toISOString():null,
              lastDate:l?new Date(l[0]*1000).toISOString():null};
    })()`);
  }

  async canvas() {
    return this.eval(`(function(){
      var best=null;
      document.querySelectorAll('canvas').forEach(c=>{
        var r=c.getBoundingClientRect();
        if(!best||(r.width*r.height)>(best.w*best.h))
          best={x:r.x,y:r.y,w:r.width,h:r.height};
      });
      return best;
    })()`);
  }

  async scrollLeft(canvas) {
    const cx = canvas.x + canvas.w * 0.3;
    const cy = canvas.y + canvas.h / 2;
    const step = DRAG_PX / DRAG_STEPS;

    await this.client.Input.dispatchMouseEvent({
      type: 'mousePressed', x: cx, y: cy, button: 'left', clickCount: 1,
    });
    for (let i = 1; i <= DRAG_STEPS; i++) {
      await this.client.Input.dispatchMouseEvent({
        type: 'mouseMoved', x: cx + i * step, y: cy, button: 'left',
      });
      await sleep(30);
    }
    await this.client.Input.dispatchMouseEvent({
      type: 'mouseReleased', x: cx + DRAG_PX, y: cy, button: 'left', clickCount: 1,
    });
  }

  async scrollToRealtime() {
    await this.eval(`(function(){ ${TV}._chartWidget.model().timeScale().scrollToRealtime(); })()`);
    await sleep(1000);
  }

  async extractBars(afterTs, beforeTs) {
    const startIdx = await this.eval(`${BARS}.firstIndex()`);
    const endIdx   = await this.eval(`${BARS}.lastIndex()`);
    let all = [];
    const chunk = 3000;

    for (let i = startIdx; i <= endIdx; i += chunk) {
      const end = Math.min(i + chunk - 1, endIdx);
      const rows = await this.eval(`(function(){
        var b=${BARS}, r=[];
        for(var j=${i};j<=${end};j++){
          var v=b.valueAt(j);
          if(v&&v[0]>${afterTs}&&v[0]<=${beforeTs})
            r.push([v[0],v[1],v[2],v[3],v[4],v[5]||0]);
        }
        return r;
      })()`);
      if (rows?.length) all = all.concat(rows);
    }

    // Sort + deduplicate
    all.sort((a, b) => a[0] - b[0]);
    const seen = new Set();
    return all.filter(b => { if (seen.has(b[0])) return false; seen.add(b[0]); return true; });
  }

  async close() { await this.client.close(); }
}

// ─── Connect ─────────────────────────────────────────────────────────
async function connect() {
  const resp = await fetch(`http://localhost:${CDP_PORT}/json/list`);
  const targets = await resp.json();
  const target = targets.find(t => t.type === 'page' && /tradingview\.com\/chart/i.test(t.url))
    || targets.find(t => t.type === 'page' && /tradingview/i.test(t.url));
  if (!target) throw new Error('TradingView Desktop not found on port 9222');

  console.log(`📡 Connecting to ${target.url.slice(0, 80)}...`);
  const client = await CDP({ host: 'localhost', port: CDP_PORT, target: target.id });
  await client.Runtime.enable();
  await client.Page.enable();
  return new TradingViewCDP(client);
}

// ─── Update one symbol ──────────────────────────────────────────────
async function updateSymbol(tv, sym, tvSym, csvPath, endTs, dryRun) {
  const lastTs = readLastTs(csvPath);
  const lastDate = new Date(lastTs * 1000).toISOString();

  console.log(`\n${'━'.repeat(60)}`);
  console.log(`📊 ${sym}  (${tvSym})`);
  console.log(`   Last recorded: ${lastDate}`);

  if (lastTs >= endTs) {
    console.log('   ✅ Already up to date');
    return { sym, added: 0, status: 'up-to-date' };
  }

  // Set symbol + 1-min
  const actualSym = await tv.setSymbol(tvSym);
  console.log(`   Symbol:     ${actualSym}`);
  const actualTf = await tv.setTimeframe('1');
  console.log(`   Timeframe:  ${actualTf}`);

  // Reset to realtime, then scroll left to load history
  await tv.scrollToRealtime();
  const canvas = await tv.canvas();
  if (!canvas) throw new Error('No chart canvas found');

  let info = await tv.barsInfo();
  console.log(`   Loaded:     ${info.size} bars (${info.firstDate})`);

  const needTs = lastTs - 60;
  let stale = 0, prevSize = info.size;

  if (info.firstTs > needTs) {
    console.log(`   ⏪ Scrolling to load history...`);

    for (let r = 1; r <= MAX_ROUNDS && info.firstTs > needTs; r++) {
      await tv.scrollLeft(canvas);
      await sleep(WAIT_SCROLL_MS);

      info = await tv.barsInfo();
      process.stdout.write(`\r   Round ${r}: ${info.size} bars → ${info.firstDate}   `);

      if (info.size === prevSize) {
        if (++stale >= STALE_LIMIT) {
          await tv.scrollToRealtime();
          await sleep(2000);
          stale = 0;
          if (r > 20) { console.log(`\n   ⚠️  Hit TradingView history limit`); break; }
        }
      } else {
        stale = 0;
      }
      prevSize = info.size;
    }
    console.log();
  }

  // Extract new bars
  const bars = await tv.extractBars(lastTs, endTs);

  if (!bars.length) {
    console.log('   ⚠️  No new bars extracted');
    await tv.scrollToRealtime();
    return { sym, added: 0, status: 'no-data' };
  }

  const first = bars[0], last = bars[bars.length - 1];
  console.log(`   ✓ ${bars.length} new bars`);
  console.log(`     ${new Date(first[0]*1000).toISOString()}  →  ${new Date(last[0]*1000).toISOString()}`);

  const csvLines = bars.map(b => toCsvRow(b[0], b[1], b[2], b[3], b[4], b[5]));

  if (dryRun) {
    console.log(`   🔍 [DRY RUN] Would append ${csvLines.length} rows`);
  } else {
    fs.appendFileSync(csvPath, csvLines.map(l => l + '\r\n').join(''));
    console.log(`   💾 Appended ${csvLines.length} rows to ${path.basename(csvPath)}`);
  }

  await tv.scrollToRealtime();
  await sleep(1500);
  return { sym, added: bars.length, status: 'updated' };
}

// ─── Main ────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const symFlag = args.indexOf('--symbol');
  const single = symFlag >= 0 ? args[symFlag + 1]?.toUpperCase() : null;
  const endFlag = args.indexOf('--end');
  const endDate = endFlag >= 0 ? args[endFlag + 1] : null;

  // End timestamp: custom date or now
  const endTs = endDate
    ? Math.floor(new Date(`${endDate}T21:10:00Z`).getTime() / 1000)
    : Math.floor(Date.now() / 1000);
  const endLabel = endDate || new Date(endTs * 1000).toISOString().slice(0, 10);

  const syms = single ? [single] : Object.keys(SYMBOLS);

  console.log('┌────────────────────────────────────────────────────┐');
  console.log('│   TradingView → CSV  (1-min OHLCV auto-updater)   │');
  console.log('└────────────────────────────────────────────────────┘');
  console.log(`  Symbols:  ${syms.join(', ')}`);
  console.log(`  End:      ${endLabel}`);
  console.log(`  Dry run:  ${dryRun}`);

  const tv = await connect();

  try {
    const state = await tv.chartState();
    console.log(`  Chart:    ${state.symbol} @ ${state.resolution}`);

    const results = [];
    for (const sym of syms) {
      const tvSym = SYMBOLS[sym];
      if (!tvSym) { console.log(`\n⚠️  Unknown symbol: ${sym}`); continue; }
      const csvPath = path.join(DATA_DIR, `${sym}.csv`);
      if (!fs.existsSync(csvPath)) { console.log(`\n⚠️  ${csvPath} not found`); continue; }
      results.push(await updateSymbol(tv, sym, tvSym, csvPath, endTs, dryRun));
    }

    // Summary
    console.log(`\n${'━'.repeat(60)}`);
    console.log('📋 Summary:');
    for (const r of results) {
      const icon = r.status === 'updated' ? '✅' : r.status === 'up-to-date' ? '☑️ ' : '⚠️ ';
      console.log(`   ${icon} ${r.sym}: ${r.added > 0 ? `+${r.added} bars` : r.status}`);
    }

  } finally {
    await tv.close();
    console.log('\n✓ Done');
  }
}

main().catch(err => {
  console.error(`\n✘ Fatal: ${err.message}`);
  process.exit(1);
});
