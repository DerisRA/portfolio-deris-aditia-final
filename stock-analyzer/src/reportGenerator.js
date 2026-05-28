// ============================================
// REPORT GENERATOR
// ============================================
// Membuat laporan lengkap dalam format:
// 1. Teks untuk Telegram
// 2. HTML untuk PDF

import { formatFundamentalReport } from './fundamentalAnalysis.js';
import { formatSentimentReport } from './sentimentAnalysis.js';
import { formatRiskReport } from './riskManagement.js';
import { formatTradingViewReport, getTradingViewLink } from './tradingviewConnector.js';

// ============================================
// FORMAT LAPORAN TEKNIKAL UNTUK TELEGRAM
// ============================================
function formatTechnicalReport(technical, symbol) {
  if (!technical || technical.error) {
    return `❌ Data teknikal tidak tersedia`;
  }
  
  const { rsi, macd, bollingerBands: bb, movingAverages: ma, stochastic, atr, volume, supportResistance: sr, trend, score, recommendation } = technical;
  
  const recEmoji = {
    'STRONG BUY': '🟢🟢',
    'BUY': '🟢',
    'HOLD': '⚪',
    'SELL': '🔴',
    'STRONG SELL': '🔴🔴',
  }[recommendation] || '⚪';
  
  let report = `
📊 *ANALISA TEKNIKAL: ${symbol}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 *Harga: $${technical.currentPrice?.toFixed(2)}*

`;
  
  // RSI
  if (rsi) {
    report += `📉 *RSI (14): ${rsi.value?.toFixed(2)}*
└ ${rsi.interpretation}

`;
  }
  
  // MACD
  if (macd) {
    report += `📈 *MACD*
├ MACD: ${macd.macd?.toFixed(4)}
├ Signal: ${macd.signal?.toFixed(4)}
├ Histogram: ${macd.histogram?.toFixed(4)}
└ ${macd.interpretation}

`;
  }
  
  // Bollinger Bands
  if (bb) {
    report += `📊 *BOLLINGER BANDS*
├ Upper: $${bb.upper?.toFixed(2)}
├ Middle: $${bb.middle?.toFixed(2)}
├ Lower: $${bb.lower?.toFixed(2)}
└ ${bb.interpretation}

`;
  }
  
  // Moving Averages
  if (ma) {
    report += `📈 *MOVING AVERAGES*
├ MA20: $${ma.ma20?.toFixed(2) || 'N/A'} ${ma.priceVsMA.aboveMA20 ? '✅' : '❌'}
├ MA50: $${ma.ma50?.toFixed(2) || 'N/A'} ${ma.priceVsMA.aboveMA50 ? '✅' : '❌'}
├ MA200: $${ma.ma200?.toFixed(2) || 'N/A'} ${ma.priceVsMA.aboveMA200 ? '✅' : '❌'}
└ ${ma.interpretation}

`;
  }
  
  // Stochastic
  if (stochastic) {
    report += `🔄 *STOCHASTIC*
├ %K: ${stochastic.k?.toFixed(2)} | %D: ${stochastic.d?.toFixed(2)}
└ ${stochastic.interpretation}

`;
  }
  
  // ATR & Volatilitas
  if (atr) {
    report += `⚡ *VOLATILITAS (ATR)*
├ ATR: $${atr.value?.toFixed(2)} (${atr.percentage}%)
└ Level: ${atr.volatility}

`;
  }
  
  // Volume
  if (volume) {
    report += `📊 *VOLUME*
├ Volume Hari Ini: ${volume.current?.toLocaleString()}
├ Rata-rata 20 hari: ${volume.average20?.toLocaleString()}
├ Rasio: ${volume.ratio}x
└ ${volume.interpretation}

`;
  }
  
  // Support & Resistance
  if (sr) {
    report += `🎯 *SUPPORT & RESISTANCE*
├ Resistance: $${sr.resistance?.toFixed(2)} (${sr.distanceToResistance}% dari harga)
├ Support: $${sr.support?.toFixed(2)} (${sr.distanceToSupport}% dari harga)
├ Pivot: $${sr.pivot?.toFixed(2)}
├ R1: $${sr.r1?.toFixed(2)} | R2: $${sr.r2?.toFixed(2)}
└ S1: $${sr.s1?.toFixed(2)} | S2: $${sr.s2?.toFixed(2)}

`;
  }
  
  // Trend
  if (trend) {
    report += `📈 *TREND ANALYSIS*
└ ${trend.interpretation}

`;
  }
  
  report += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 *SKOR TEKNIKAL: ${score}/100*
${recEmoji} *REKOMENDASI: ${recommendation}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  
  return report;
}

// ============================================
// FORMAT LAPORAN RINGKAS (SUMMARY)
// ============================================
export function formatSummaryReport(symbol, realTimePrice, technical, fundamental, sentiment, risk, tvData) {
  const price = realTimePrice?.price || technical?.currentPrice;
  const change = realTimePrice?.change;
  const changePercent = realTimePrice?.changePercent;
  
  const changeEmoji = changePercent > 0 ? '📈' : changePercent < 0 ? '📉' : '➡️';
  const changeStr = changePercent ? `${changePercent > 0 ? '+' : ''}${changePercent.toFixed(2)}%` : 'N/A';
  
  const finalRec = risk?.finalRecommendation || 'N/A';
  const recEmoji = {
    'STRONG BUY': '🟢🟢',
    'BUY': '🟢',
    'HOLD': '⚪',
    'WAIT': '🟡',
    'SELL': '🔴',
    'STRONG SELL': '🔴🔴',
  }[finalRec] || '⚪';
  
  const now = new Date().toLocaleString('id-ID', { 
    timeZone: 'Asia/Jakarta',
    dateStyle: 'full',
    timeStyle: 'short'
  });
  
  let report = `
🔔 *LAPORAN ANALISA SAHAM*
📅 ${now} WIB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 *${symbol}* - ${fundamental?.company?.name || symbol}
🏭 ${fundamental?.company?.sector || 'N/A'} | ${fundamental?.company?.industry || 'N/A'}

💰 *HARGA: $${price?.toFixed(2) || 'N/A'}*
${changeEmoji} Perubahan: ${changeStr}
📊 Market: ${realTimePrice?.marketState || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 *RINGKASAN SKOR*
├ 📈 Teknikal: ${technical?.score || 'N/A'}/100 → ${technical?.recommendation || 'N/A'}
├ 🏢 Fundamental: ${fundamental?.totalScore || 'N/A'}/100 → ${fundamental?.recommendation || 'N/A'}
├ 🧠 Sentimen: ${sentiment?.overallScore || 'N/A'}/100 → ${sentiment?.overallSentiment || 'N/A'}
└ ⚠️ Risiko: ${risk?.riskAnalysis?.level || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${recEmoji} *REKOMENDASI AKHIR: ${finalRec}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🛑 Stop Loss: $${risk?.stopLoss?.recommended?.price?.toFixed(2) || 'N/A'} (-${risk?.stopLoss?.recommended?.percentage || 'N/A'}%)
🎯 Target 1: $${risk?.takeProfit?.levels?.rr2?.price?.toFixed(2) || 'N/A'} (+${risk?.takeProfit?.levels?.rr2?.percentage || 'N/A'}%)
🎯 Target 2: $${risk?.takeProfit?.levels?.rr3?.price?.toFixed(2) || 'N/A'} (+${risk?.takeProfit?.levels?.rr3?.percentage || 'N/A'}%)

💼 Posisi: ${risk?.positionSizing?.recommendedShares || 'N/A'} saham = $${risk?.positionSizing?.totalInvestment || 'N/A'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔑 *SINYAL KUNCI*
`;
  
  // Tambahkan sinyal teknikal
  if (technical?.signals && technical.signals.length > 0) {
    for (const signal of technical.signals.slice(0, 5)) {
      report += `• ${signal}\n`;
    }
  }
  
  // Tambahkan sinyal fundamental
  if (fundamental?.allSignals && fundamental.allSignals.length > 0) {
    for (const signal of fundamental.allSignals.slice(0, 3)) {
      report += `• ${signal}\n`;
    }
  }
  
  report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 TradingView: ${tvData?.recommendation?.overall || 'N/A'}
🔗 [Lihat Chart](${getTradingViewLink(symbol)})

⚠️ _Disclaimer: Bukan saran investasi resmi. DYOR!_
`;
  
  return report;
}

// ============================================
// BUAT LAPORAN HTML UNTUK PDF
// ============================================
export function generateHTMLReport(symbol, realTimePrice, technical, fundamental, sentiment, risk, tvData) {
  const price = realTimePrice?.price || technical?.currentPrice;
  const changePercent = realTimePrice?.changePercent;
  const finalRec = risk?.finalRecommendation || 'N/A';
  
  const recColor = {
    'STRONG BUY': '#00C851',
    'BUY': '#4CAF50',
    'HOLD': '#FF8800',
    'WAIT': '#FFD700',
    'SELL': '#FF4444',
    'STRONG SELL': '#CC0000',
  }[finalRec] || '#888888';
  
  const now = new Date().toLocaleString('id-ID', { 
    timeZone: 'Asia/Jakarta',
    dateStyle: 'full',
    timeStyle: 'short'
  });
  
  const html = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Analisa Saham ${symbol}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #0d1117; color: #e6edf3; }
    .container { max-width: 900px; margin: 0 auto; padding: 20px; }
    
    .header { 
      background: linear-gradient(135deg, #1a1f2e, #252d3d);
      border: 1px solid #30363d;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 20px;
      text-align: center;
    }
    .header h1 { font-size: 2.5em; color: #58a6ff; margin-bottom: 10px; }
    .header .subtitle { color: #8b949e; font-size: 1.1em; }
    .header .price { font-size: 3em; font-weight: bold; color: #e6edf3; margin: 15px 0; }
    .header .change { font-size: 1.3em; }
    .header .change.positive { color: #3fb950; }
    .header .change.negative { color: #f85149; }
    
    .recommendation-box {
      background: ${recColor}22;
      border: 2px solid ${recColor};
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      margin: 20px 0;
    }
    .recommendation-box h2 { color: ${recColor}; font-size: 2em; }
    .recommendation-box p { color: #8b949e; margin-top: 5px; }
    
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-bottom: 20px; }
    
    .card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 10px;
      padding: 20px;
    }
    .card h3 { 
      color: #58a6ff; 
      font-size: 1.1em; 
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #30363d;
    }
    
    .score-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5em;
      font-weight: bold;
      margin: 0 auto 10px;
    }
    .score-high { background: #3fb95022; border: 3px solid #3fb950; color: #3fb950; }
    .score-medium { background: #d2992222; border: 3px solid #d29922; color: #d29922; }
    .score-low { background: #f8514922; border: 3px solid #f85149; color: #f85149; }
    
    .data-row { 
      display: flex; 
      justify-content: space-between; 
      padding: 8px 0;
      border-bottom: 1px solid #21262d;
      font-size: 0.9em;
    }
    .data-row:last-child { border-bottom: none; }
    .data-label { color: #8b949e; }
    .data-value { color: #e6edf3; font-weight: 500; }
    .data-value.positive { color: #3fb950; }
    .data-value.negative { color: #f85149; }
    
    .signal-item {
      background: #21262d;
      border-radius: 6px;
      padding: 8px 12px;
      margin: 5px 0;
      font-size: 0.85em;
      color: #e6edf3;
    }
    
    .news-item {
      padding: 10px 0;
      border-bottom: 1px solid #21262d;
    }
    .news-item:last-child { border-bottom: none; }
    .news-title { color: #e6edf3; font-size: 0.9em; margin-bottom: 5px; }
    .news-meta { color: #8b949e; font-size: 0.8em; }
    .news-positive { border-left: 3px solid #3fb950; padding-left: 10px; }
    .news-negative { border-left: 3px solid #f85149; padding-left: 10px; }
    .news-neutral { border-left: 3px solid #8b949e; padding-left: 10px; }
    
    .risk-box {
      background: #21262d;
      border-radius: 8px;
      padding: 15px;
      margin: 10px 0;
    }
    
    .footer {
      text-align: center;
      color: #8b949e;
      font-size: 0.8em;
      margin-top: 30px;
      padding: 20px;
      border-top: 1px solid #30363d;
    }
    
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 0.8em;
      font-weight: bold;
    }
    .badge-buy { background: #3fb95022; color: #3fb950; border: 1px solid #3fb950; }
    .badge-sell { background: #f8514922; color: #f85149; border: 1px solid #f85149; }
    .badge-hold { background: #d2992222; color: #d29922; border: 1px solid #d29922; }
    
    @media print {
      body { background: white; color: black; }
      .card { border: 1px solid #ccc; }
    }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- HEADER -->
    <div class="header">
      <h1>📈 ${symbol}</h1>
      <div class="subtitle">${fundamental?.company?.name || symbol} | ${fundamental?.company?.sector || 'N/A'} | ${fundamental?.company?.industry || 'N/A'}</div>
      <div class="price">$${price?.toFixed(2) || 'N/A'}</div>
      <div class="change ${changePercent >= 0 ? 'positive' : 'negative'}">
        ${changePercent >= 0 ? '▲' : '▼'} ${Math.abs(changePercent || 0).toFixed(2)}%
      </div>
      <div style="color: #8b949e; margin-top: 10px; font-size: 0.9em;">
        📅 ${now} WIB | Market: ${realTimePrice?.marketState || 'N/A'}
      </div>
    </div>
    
    <!-- REKOMENDASI UTAMA -->
    <div class="recommendation-box">
      <h2>🎯 REKOMENDASI: ${finalRec}</h2>
      <p>Berdasarkan analisa teknikal, fundamental, sentimen, dan manajemen risiko</p>
    </div>
    
    <!-- SKOR RINGKASAN -->
    <div class="grid-3">
      <div class="card" style="text-align: center;">
        <h3>📊 Teknikal</h3>
        <div class="score-circle ${getScoreClass(technical?.score)}">
          ${technical?.score || 'N/A'}
        </div>
        <div style="color: #8b949e; font-size: 0.9em;">${technical?.recommendation || 'N/A'}</div>
      </div>
      <div class="card" style="text-align: center;">
        <h3>🏢 Fundamental</h3>
        <div class="score-circle ${getScoreClass(fundamental?.totalScore)}">
          ${fundamental?.totalScore || 'N/A'}
        </div>
        <div style="color: #8b949e; font-size: 0.9em;">${fundamental?.recommendation || 'N/A'}</div>
      </div>
      <div class="card" style="text-align: center;">
        <h3>🧠 Sentimen</h3>
        <div class="score-circle ${getScoreClass(sentiment?.overallScore)}">
          ${sentiment?.overallScore || 'N/A'}
        </div>
        <div style="color: #8b949e; font-size: 0.9em;">${sentiment?.overallSentiment || 'N/A'}</div>
      </div>
    </div>
    
    <!-- MANAJEMEN RISIKO -->
    <div class="card" style="margin-bottom: 20px;">
      <h3>🛡️ Manajemen Risiko</h3>
      <div class="grid">
        <div>
          <div class="data-row">
            <span class="data-label">🛑 Stop Loss</span>
            <span class="data-value negative">$${risk?.stopLoss?.recommended?.price?.toFixed(2) || 'N/A'} (-${risk?.stopLoss?.recommended?.percentage || 'N/A'}%)</span>
          </div>
          <div class="data-row">
            <span class="data-label">🎯 Target 1 (R:R 2:1)</span>
            <span class="data-value positive">$${risk?.takeProfit?.levels?.rr2?.price?.toFixed(2) || 'N/A'} (+${risk?.takeProfit?.levels?.rr2?.percentage || 'N/A'}%)</span>
          </div>
          <div class="data-row">
            <span class="data-label">🎯 Target 2 (R:R 3:1)</span>
            <span class="data-value positive">$${risk?.takeProfit?.levels?.rr3?.price?.toFixed(2) || 'N/A'} (+${risk?.takeProfit?.levels?.rr3?.percentage || 'N/A'}%)</span>
          </div>
          <div class="data-row">
            <span class="data-label">⚠️ Level Risiko</span>
            <span class="data-value">${risk?.riskAnalysis?.level || 'N/A'}</span>
          </div>
        </div>
        <div>
          <div class="data-row">
            <span class="data-label">💼 Jumlah Saham</span>
            <span class="data-value">${risk?.positionSizing?.recommendedShares || 'N/A'} lembar</span>
          </div>
          <div class="data-row">
            <span class="data-label">💰 Total Investasi</span>
            <span class="data-value">$${risk?.positionSizing?.totalInvestment || 'N/A'}</span>
          </div>
          <div class="data-row">
            <span class="data-label">📊 % Portfolio</span>
            <span class="data-value">${risk?.positionSizing?.portfolioPercent || 'N/A'}%</span>
          </div>
          <div class="data-row">
            <span class="data-label">💸 Risiko Maks</span>
            <span class="data-value negative">-$${risk?.positionSizing?.scenarios?.stopLoss?.loss || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- ANALISA TEKNIKAL & FUNDAMENTAL -->
    <div class="grid">
      <!-- Teknikal -->
      <div class="card">
        <h3>📊 Indikator Teknikal</h3>
        ${technical?.rsi ? `
        <div class="data-row">
          <span class="data-label">RSI (14)</span>
          <span class="data-value ${technical.rsi.value < 30 ? 'positive' : technical.rsi.value > 70 ? 'negative' : ''}">${technical.rsi.value?.toFixed(2)}</span>
        </div>` : ''}
        ${technical?.macd ? `
        <div class="data-row">
          <span class="data-label">MACD</span>
          <span class="data-value">${technical.macd.macd?.toFixed(4)}</span>
        </div>
        <div class="data-row">
          <span class="data-label">MACD Signal</span>
          <span class="data-value">${technical.macd.signal?.toFixed(4)}</span>
        </div>` : ''}
        ${technical?.bollingerBands ? `
        <div class="data-row">
          <span class="data-label">BB Upper</span>
          <span class="data-value">$${technical.bollingerBands.upper?.toFixed(2)}</span>
        </div>
        <div class="data-row">
          <span class="data-label">BB Lower</span>
          <span class="data-value">$${technical.bollingerBands.lower?.toFixed(2)}</span>
        </div>` : ''}
        ${technical?.movingAverages ? `
        <div class="data-row">
          <span class="data-label">MA 50</span>
          <span class="data-value ${technical.movingAverages.priceVsMA?.aboveMA50 ? 'positive' : 'negative'}">$${technical.movingAverages.ma50?.toFixed(2) || 'N/A'}</span>
        </div>
        <div class="data-row">
          <span class="data-label">MA 200</span>
          <span class="data-value ${technical.movingAverages.priceVsMA?.aboveMA200 ? 'positive' : 'negative'}">$${technical.movingAverages.ma200?.toFixed(2) || 'N/A'}</span>
        </div>` : ''}
        ${technical?.volume ? `
        <div class="data-row">
          <span class="data-label">Volume Ratio</span>
          <span class="data-value">${technical.volume.ratio}x avg</span>
        </div>` : ''}
        ${technical?.atr ? `
        <div class="data-row">
          <span class="data-label">ATR (Volatilitas)</span>
          <span class="data-value">$${technical.atr.value?.toFixed(2)} (${technical.atr.percentage}%)</span>
        </div>` : ''}
      </div>
      
      <!-- Fundamental -->
      <div class="card">
        <h3>🏢 Data Fundamental</h3>
        ${fundamental?.valuation?.data ? Object.entries(fundamental.valuation.data).slice(0, 4).map(([k, v]) => `
        <div class="data-row">
          <span class="data-label">${k}</span>
          <span class="data-value">${v}</span>
        </div>`).join('') : ''}
        ${fundamental?.profitability?.data ? Object.entries(fundamental.profitability.data).slice(0, 3).map(([k, v]) => `
        <div class="data-row">
          <span class="data-label">${k}</span>
          <span class="data-value">${v}</span>
        </div>`).join('') : ''}
        ${fundamental?.growth?.data ? Object.entries(fundamental.growth.data).slice(0, 2).map(([k, v]) => `
        <div class="data-row">
          <span class="data-label">${k}</span>
          <span class="data-value">${v}</span>
        </div>`).join('') : ''}
      </div>
    </div>
    
    <!-- SENTIMEN & BERITA -->
    ${sentiment?.news?.topNews?.length > 0 ? `
    <div class="card" style="margin-bottom: 20px;">
      <h3>📰 Berita & Sentimen</h3>
      <div style="margin-bottom: 15px;">
        <span>Fear & Greed: ${sentiment?.fearGreed?.score?.toFixed(0) || 'N/A'} (${sentiment?.fearGreed?.rating || 'N/A'})</span>
        &nbsp;|&nbsp;
        <span>Sentimen Berita: ${sentiment?.news?.positiveCount || 0} positif, ${sentiment?.news?.negativeCount || 0} negatif</span>
      </div>
      ${sentiment.news.topNews.slice(0, 5).map(news => `
      <div class="news-item news-${news.sentiment.toLowerCase()}">
        <div class="news-title">${news.title}</div>
        <div class="news-meta">${news.publisher} | ${new Date(news.publishedAt).toLocaleDateString('id-ID')}</div>
      </div>`).join('')}
    </div>` : ''}
    
    <!-- SINYAL KUNCI -->
    <div class="card" style="margin-bottom: 20px;">
      <h3>🔑 Sinyal Kunci</h3>
      ${[...(technical?.signals || []), ...(fundamental?.allSignals || [])].slice(0, 10).map(signal => `
      <div class="signal-item">• ${signal}</div>`).join('')}
    </div>
    
    <!-- TRADINGVIEW -->
    ${tvData ? `
    <div class="card" style="margin-bottom: 20px;">
      <h3>📡 TradingView Analysis</h3>
      <div class="data-row">
        <span class="data-label">Overall</span>
        <span class="data-value">${tvData.recommendation?.overall || 'N/A'}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Moving Averages</span>
        <span class="data-value">${tvData.recommendation?.movingAverages || 'N/A'}</span>
      </div>
      <div class="data-row">
        <span class="data-label">Oscillators</span>
        <span class="data-value">${tvData.recommendation?.oscillators || 'N/A'}</span>
      </div>
      <div style="margin-top: 15px;">
        <a href="${getTradingViewLink(symbol)}" style="color: #58a6ff;">🔗 Lihat Chart di TradingView →</a>
      </div>
    </div>` : ''}
    
    <!-- FOOTER -->
    <div class="footer">
      <p>⚠️ <strong>DISCLAIMER:</strong> Laporan ini hanya untuk tujuan edukasi dan referensi.</p>
      <p>Bukan merupakan saran investasi resmi. Selalu lakukan riset sendiri (DYOR).</p>
      <p>Investasi saham mengandung risiko. Konsultasikan dengan financial advisor berlisensi.</p>
      <p style="margin-top: 10px;">Generated by Stock Analyzer | ${now} WIB</p>
    </div>
    
  </div>
</body>
</html>
  `;
  
  return html;
}

function getScoreClass(score) {
  if (!score) return 'score-medium';
  if (score >= 60) return 'score-high';
  if (score >= 40) return 'score-medium';
  return 'score-low';
}

// ============================================
// BUAT SEMUA LAPORAN
// ============================================
export function generateAllReports(symbol, realTimePrice, technical, fundamental, sentiment, risk, tvData) {
  return {
    summary: formatSummaryReport(symbol, realTimePrice, technical, fundamental, sentiment, risk, tvData),
    technical: formatTechnicalReport(technical, symbol),
    fundamental: formatFundamentalReport(fundamental, symbol),
    sentiment: formatSentimentReport(sentiment),
    risk: formatRiskReport(risk),
    tradingview: formatTradingViewReport(tvData, symbol),
    html: generateHTMLReport(symbol, realTimePrice, technical, fundamental, sentiment, risk, tvData),
  };
}
