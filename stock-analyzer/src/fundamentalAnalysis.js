// ============================================
// ANALISA FUNDAMENTAL
// ============================================
// Menganalisa kesehatan keuangan perusahaan:
// Valuasi, Profitabilitas, Pertumbuhan, Hutang

import { formatLargeNumber, formatPercent, formatNumber } from './dataFetcher.js';

// ============================================
// SCORING SISTEM FUNDAMENTAL
// ============================================

function scoreValuation(valuation) {
  let score = 50;
  const signals = [];
  
  // P/E Ratio
  if (valuation.peRatio !== null) {
    if (valuation.peRatio < 0) {
      score -= 10; signals.push('P/E negatif (rugi)');
    } else if (valuation.peRatio < 10) {
      score += 15; signals.push(`P/E ${valuation.peRatio.toFixed(1)} - Sangat murah`);
    } else if (valuation.peRatio < 20) {
      score += 10; signals.push(`P/E ${valuation.peRatio.toFixed(1)} - Wajar`);
    } else if (valuation.peRatio < 30) {
      score += 0; signals.push(`P/E ${valuation.peRatio.toFixed(1)} - Agak mahal`);
    } else if (valuation.peRatio < 50) {
      score -= 5; signals.push(`P/E ${valuation.peRatio.toFixed(1)} - Mahal`);
    } else {
      score -= 15; signals.push(`P/E ${valuation.peRatio.toFixed(1)} - Sangat mahal`);
    }
  }
  
  // Forward P/E vs Trailing P/E
  if (valuation.forwardPE && valuation.peRatio) {
    if (valuation.forwardPE < valuation.peRatio) {
      score += 5; signals.push('Forward P/E lebih rendah - Ekspektasi pertumbuhan positif');
    }
  }
  
  // PEG Ratio (P/E dibagi growth rate)
  if (valuation.pegRatio !== null) {
    if (valuation.pegRatio < 1) {
      score += 10; signals.push(`PEG ${valuation.pegRatio.toFixed(2)} - Undervalued relatif growth`);
    } else if (valuation.pegRatio > 2) {
      score -= 5; signals.push(`PEG ${valuation.pegRatio.toFixed(2)} - Overvalued relatif growth`);
    }
  }
  
  // Price to Book
  if (valuation.priceToBook !== null) {
    if (valuation.priceToBook < 1) {
      score += 10; signals.push(`P/B ${valuation.priceToBook.toFixed(2)} - Di bawah nilai buku`);
    } else if (valuation.priceToBook > 5) {
      score -= 5; signals.push(`P/B ${valuation.priceToBook.toFixed(2)} - Premium tinggi`);
    }
  }
  
  return { score: Math.max(0, Math.min(100, score)), signals };
}

function scoreProfitability(profitability) {
  let score = 50;
  const signals = [];
  
  // Profit Margin
  if (profitability.profitMargin !== null) {
    const margin = profitability.profitMargin * 100;
    if (margin > 20) { score += 15; signals.push(`Profit margin ${margin.toFixed(1)}% - Sangat baik`); }
    else if (margin > 10) { score += 10; signals.push(`Profit margin ${margin.toFixed(1)}% - Baik`); }
    else if (margin > 5) { score += 5; signals.push(`Profit margin ${margin.toFixed(1)}% - Cukup`); }
    else if (margin > 0) { score -= 5; signals.push(`Profit margin ${margin.toFixed(1)}% - Tipis`); }
    else { score -= 15; signals.push(`Profit margin ${margin.toFixed(1)}% - Rugi!`); }
  }
  
  // Return on Equity
  if (profitability.returnOnEquity !== null) {
    const roe = profitability.returnOnEquity * 100;
    if (roe > 20) { score += 15; signals.push(`ROE ${roe.toFixed(1)}% - Sangat efisien`); }
    else if (roe > 15) { score += 10; signals.push(`ROE ${roe.toFixed(1)}% - Baik`); }
    else if (roe > 10) { score += 5; signals.push(`ROE ${roe.toFixed(1)}% - Cukup`); }
    else if (roe > 0) { score -= 5; signals.push(`ROE ${roe.toFixed(1)}% - Rendah`); }
    else { score -= 15; signals.push(`ROE ${roe.toFixed(1)}% - Negatif!`); }
  }
  
  // Operating Margin
  if (profitability.operatingMargin !== null) {
    const opMargin = profitability.operatingMargin * 100;
    if (opMargin > 15) { score += 10; signals.push(`Operating margin ${opMargin.toFixed(1)}% - Efisien`); }
    else if (opMargin < 0) { score -= 10; signals.push(`Operating margin ${opMargin.toFixed(1)}% - Rugi operasional`); }
  }
  
  return { score: Math.max(0, Math.min(100, score)), signals };
}

function scoreGrowth(growth) {
  let score = 50;
  const signals = [];
  
  // Revenue Growth
  if (growth.revenueGrowth !== null) {
    const rg = growth.revenueGrowth * 100;
    if (rg > 20) { score += 15; signals.push(`Revenue growth ${rg.toFixed(1)}% - Sangat tinggi`); }
    else if (rg > 10) { score += 10; signals.push(`Revenue growth ${rg.toFixed(1)}% - Baik`); }
    else if (rg > 5) { score += 5; signals.push(`Revenue growth ${rg.toFixed(1)}% - Moderat`); }
    else if (rg > 0) { score += 0; signals.push(`Revenue growth ${rg.toFixed(1)}% - Lambat`); }
    else { score -= 10; signals.push(`Revenue growth ${rg.toFixed(1)}% - Menurun!`); }
  }
  
  // Earnings Growth
  if (growth.earningsGrowth !== null) {
    const eg = growth.earningsGrowth * 100;
    if (eg > 20) { score += 15; signals.push(`Earnings growth ${eg.toFixed(1)}% - Sangat baik`); }
    else if (eg > 10) { score += 10; signals.push(`Earnings growth ${eg.toFixed(1)}% - Baik`); }
    else if (eg < 0) { score -= 10; signals.push(`Earnings growth ${eg.toFixed(1)}% - Laba menurun!`); }
  }
  
  return { score: Math.max(0, Math.min(100, score)), signals };
}

function scoreFinancialHealth(financial) {
  let score = 50;
  const signals = [];
  
  // Debt to Equity
  if (financial.debtToEquity !== null) {
    const de = financial.debtToEquity;
    if (de < 0.3) { score += 15; signals.push(`D/E ${de.toFixed(2)} - Hutang sangat rendah`); }
    else if (de < 1) { score += 10; signals.push(`D/E ${de.toFixed(2)} - Hutang manageable`); }
    else if (de < 2) { score += 0; signals.push(`D/E ${de.toFixed(2)} - Hutang moderat`); }
    else if (de < 3) { score -= 10; signals.push(`D/E ${de.toFixed(2)} - Hutang tinggi`); }
    else { score -= 20; signals.push(`D/E ${de.toFixed(2)} - Hutang sangat tinggi!`); }
  }
  
  // Current Ratio (kemampuan bayar hutang jangka pendek)
  if (financial.currentRatio !== null) {
    const cr = financial.currentRatio;
    if (cr > 2) { score += 10; signals.push(`Current ratio ${cr.toFixed(2)} - Likuiditas sangat baik`); }
    else if (cr > 1.5) { score += 5; signals.push(`Current ratio ${cr.toFixed(2)} - Likuiditas baik`); }
    else if (cr > 1) { score += 0; signals.push(`Current ratio ${cr.toFixed(2)} - Likuiditas cukup`); }
    else { score -= 15; signals.push(`Current ratio ${cr.toFixed(2)} - Likuiditas bermasalah!`); }
  }
  
  // Free Cash Flow
  if (financial.freeCashflow !== null) {
    if (financial.freeCashflow > 0) {
      score += 10; signals.push(`Free cash flow positif: ${formatLargeNumber(financial.freeCashflow)}`);
    } else {
      score -= 10; signals.push(`Free cash flow negatif: ${formatLargeNumber(financial.freeCashflow)}`);
    }
  }
  
  return { score: Math.max(0, Math.min(100, score)), signals };
}

// ============================================
// ANALISA REKOMENDASI ANALIS
// ============================================
function analyzeAnalystRecommendation(rec) {
  if (!rec) return { score: 50, signals: [] };
  
  const total = rec.strongBuy + rec.buy + rec.hold + rec.sell + rec.strongSell;
  if (total === 0) return { score: 50, signals: [] };
  
  const bullishPct = ((rec.strongBuy + rec.buy) / total) * 100;
  const bearishPct = ((rec.sell + rec.strongSell) / total) * 100;
  
  let score = 50;
  const signals = [];
  
  if (bullishPct > 70) { score = 75; signals.push(`${bullishPct.toFixed(0)}% analis rekomendasikan BUY`); }
  else if (bullishPct > 50) { score = 65; signals.push(`${bullishPct.toFixed(0)}% analis rekomendasikan BUY`); }
  else if (bearishPct > 50) { score = 35; signals.push(`${bearishPct.toFixed(0)}% analis rekomendasikan SELL`); }
  
  // Target price
  if (rec.targetMeanPrice && rec.targetMeanPrice > 0) {
    signals.push(`Target harga analis: $${rec.targetMeanPrice.toFixed(2)}`);
  }
  
  return { score, signals };
}

// ============================================
// FUNGSI UTAMA: Jalankan semua analisa fundamental
// ============================================
export function runFundamentalAnalysis(fundamentalData) {
  if (!fundamentalData) {
    return { error: 'Data fundamental tidak tersedia' };
  }
  
  const valuationScore = scoreValuation(fundamentalData.valuation);
  const profitabilityScore = scoreProfitability(fundamentalData.profitability);
  const growthScore = scoreGrowth(fundamentalData.growth);
  const financialScore = scoreFinancialHealth(fundamentalData.financial);
  const analystScore = analyzeAnalystRecommendation(fundamentalData.analystRecommendation);
  
  // Weighted average score
  const totalScore = (
    valuationScore.score * 0.25 +
    profitabilityScore.score * 0.25 +
    growthScore.score * 0.25 +
    financialScore.score * 0.15 +
    analystScore.score * 0.10
  );
  
  // Semua sinyal
  const allSignals = [
    ...valuationScore.signals,
    ...profitabilityScore.signals,
    ...growthScore.signals,
    ...financialScore.signals,
    ...analystScore.signals,
  ];
  
  // Rekomendasi
  let recommendation = 'HOLD';
  if (totalScore >= 75) recommendation = 'STRONG BUY';
  else if (totalScore >= 62) recommendation = 'BUY';
  else if (totalScore >= 45) recommendation = 'HOLD';
  else if (totalScore >= 32) recommendation = 'SELL';
  else recommendation = 'STRONG SELL';
  
  // Format data untuk laporan
  const report = {
    company: fundamentalData.company,
    
    valuation: {
      score: valuationScore.score,
      signals: valuationScore.signals,
      data: {
        'Market Cap': formatLargeNumber(fundamentalData.valuation.marketCap),
        'P/E Ratio': formatNumber(fundamentalData.valuation.peRatio),
        'Forward P/E': formatNumber(fundamentalData.valuation.forwardPE),
        'PEG Ratio': formatNumber(fundamentalData.valuation.pegRatio),
        'Price/Book': formatNumber(fundamentalData.valuation.priceToBook),
        'Price/Sales': formatNumber(fundamentalData.valuation.priceToSales),
        'EV/EBITDA': formatNumber(fundamentalData.valuation.evToEbitda),
      },
    },
    
    profitability: {
      score: profitabilityScore.score,
      signals: profitabilityScore.signals,
      data: {
        'Gross Margin': formatPercent(fundamentalData.profitability.grossMargin),
        'Operating Margin': formatPercent(fundamentalData.profitability.operatingMargin),
        'Profit Margin': formatPercent(fundamentalData.profitability.profitMargin),
        'ROE': formatPercent(fundamentalData.profitability.returnOnEquity),
        'ROA': formatPercent(fundamentalData.profitability.returnOnAssets),
        'EBITDA': formatLargeNumber(fundamentalData.profitability.ebitda),
      },
    },
    
    growth: {
      score: growthScore.score,
      signals: growthScore.signals,
      data: {
        'Revenue Growth (YoY)': formatPercent(fundamentalData.growth.revenueGrowth),
        'Earnings Growth (YoY)': formatPercent(fundamentalData.growth.earningsGrowth),
        'EPS (Trailing)': `$${formatNumber(fundamentalData.eps.trailingEps)}`,
        'EPS (Forward)': `$${formatNumber(fundamentalData.eps.forwardEps)}`,
      },
    },
    
    financialHealth: {
      score: financialScore.score,
      signals: financialScore.signals,
      data: {
        'Total Cash': formatLargeNumber(fundamentalData.financial.totalCash),
        'Total Debt': formatLargeNumber(fundamentalData.financial.totalDebt),
        'Debt/Equity': formatNumber(fundamentalData.financial.debtToEquity),
        'Current Ratio': formatNumber(fundamentalData.financial.currentRatio),
        'Free Cash Flow': formatLargeNumber(fundamentalData.financial.freeCashflow),
      },
    },
    
    dividend: {
      data: {
        'Dividend Rate': fundamentalData.dividend.dividendRate ? `$${fundamentalData.dividend.dividendRate.toFixed(2)}` : 'N/A',
        'Dividend Yield': formatPercent(fundamentalData.dividend.dividendYield),
        'Payout Ratio': formatPercent(fundamentalData.dividend.payoutRatio),
        'Ex-Dividend Date': fundamentalData.dividend.exDividendDate || 'N/A',
      },
    },
    
    analystRecommendation: {
      score: analystScore.score,
      signals: analystScore.signals,
      data: fundamentalData.analystRecommendation,
    },
    
    priceInfo: {
      current: fundamentalData.currentPrice,
      fiftyTwoWeekHigh: fundamentalData.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: fundamentalData.fiftyTwoWeekLow,
      beta: fundamentalData.beta,
    },
    
    totalScore: Math.round(totalScore),
    recommendation,
    allSignals,
  };
  
  return report;
}

// ============================================
// FORMAT LAPORAN FUNDAMENTAL UNTUK TELEGRAM
// ============================================
export function formatFundamentalReport(analysis, symbol) {
  if (analysis.error) return `❌ ${analysis.error}`;
  
  const { company, valuation, profitability, growth, financialHealth, dividend, analystRecommendation, priceInfo, totalScore, recommendation } = analysis;
  
  const recEmoji = {
    'STRONG BUY': '🟢🟢',
    'BUY': '🟢',
    'HOLD': '⚪',
    'SELL': '🔴',
    'STRONG SELL': '🔴🔴',
  }[recommendation] || '⚪';
  
  let report = `
🏢 *ANALISA FUNDAMENTAL: ${symbol}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 *${company.name}*
🏭 Sektor: ${company.sector}
🏗️ Industri: ${company.industry}

💰 *HARGA & VALUASI*
├ Harga Saat Ini: $${priceInfo.current?.toFixed(2) || 'N/A'}
├ 52W High: $${priceInfo.fiftyTwoWeekHigh?.toFixed(2) || 'N/A'}
├ 52W Low: $${priceInfo.fiftyTwoWeekLow?.toFixed(2) || 'N/A'}
├ Beta: ${priceInfo.beta?.toFixed(2) || 'N/A'}
`;

  // Valuasi
  report += `\n📈 *VALUASI* (Skor: ${valuation.score}/100)\n`;
  for (const [key, val] of Object.entries(valuation.data)) {
    report += `├ ${key}: ${val}\n`;
  }
  
  // Profitabilitas
  report += `\n💹 *PROFITABILITAS* (Skor: ${profitability.score}/100)\n`;
  for (const [key, val] of Object.entries(profitability.data)) {
    report += `├ ${key}: ${val}\n`;
  }
  
  // Pertumbuhan
  report += `\n🚀 *PERTUMBUHAN* (Skor: ${growth.score}/100)\n`;
  for (const [key, val] of Object.entries(growth.data)) {
    report += `├ ${key}: ${val}\n`;
  }
  
  // Kesehatan Keuangan
  report += `\n🏦 *KESEHATAN KEUANGAN* (Skor: ${financialHealth.score}/100)\n`;
  for (const [key, val] of Object.entries(financialHealth.data)) {
    report += `├ ${key}: ${val}\n`;
  }
  
  // Dividen
  report += `\n💵 *DIVIDEN*\n`;
  for (const [key, val] of Object.entries(dividend.data)) {
    report += `├ ${key}: ${val}\n`;
  }
  
  // Rekomendasi Analis
  const ar = analystRecommendation.data;
  if (ar) {
    const total = (ar.strongBuy || 0) + (ar.buy || 0) + (ar.hold || 0) + (ar.sell || 0) + (ar.strongSell || 0);
    report += `\n👨‍💼 *REKOMENDASI ANALIS* (${total} analis)\n`;
    report += `├ Strong Buy: ${ar.strongBuy || 0} | Buy: ${ar.buy || 0}\n`;
    report += `├ Hold: ${ar.hold || 0}\n`;
    report += `├ Sell: ${ar.sell || 0} | Strong Sell: ${ar.strongSell || 0}\n`;
    if (ar.targetMeanPrice) {
      report += `├ Target Harga: $${ar.targetMeanPrice.toFixed(2)}\n`;
      report += `├ Target High: $${ar.targetHighPrice?.toFixed(2) || 'N/A'}\n`;
      report += `└ Target Low: $${ar.targetLowPrice?.toFixed(2) || 'N/A'}\n`;
    }
  }
  
  report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 *SKOR FUNDAMENTAL: ${totalScore}/100*
${recEmoji} *REKOMENDASI: ${recommendation}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  
  return report;
}
