// ============================================
// MANAJEMEN RISIKO & PSIKOLOGI TRADING
// ============================================
// Menghitung:
// - Stop Loss & Take Profit
// - Position Sizing
// - Risk/Reward Ratio
// - Saran Psikologi Trading

import { config } from './config.js';

// ============================================
// HITUNG STOP LOSS
// ============================================
export function calculateStopLoss(currentPrice, atr, supportLevel, method = 'ATR') {
  const stopLossLevels = {};
  
  // Method 1: ATR-based (paling umum digunakan)
  if (atr) {
    stopLossLevels.atrBased = {
      price: currentPrice - (2 * atr.value),
      percentage: ((2 * atr.value) / currentPrice * 100).toFixed(2),
      method: 'ATR x2',
      description: 'Stop loss berdasarkan volatilitas (ATR)',
    };
    
    stopLossLevels.atrConservative = {
      price: currentPrice - (1.5 * atr.value),
      percentage: ((1.5 * atr.value) / currentPrice * 100).toFixed(2),
      method: 'ATR x1.5',
      description: 'Stop loss konservatif',
    };
  }
  
  // Method 2: Percentage-based
  stopLossLevels.percent5 = {
    price: currentPrice * 0.95,
    percentage: '5.00',
    method: '5%',
    description: 'Stop loss 5% dari harga beli',
  };
  
  stopLossLevels.percent8 = {
    price: currentPrice * 0.92,
    percentage: '8.00',
    method: '8%',
    description: 'Stop loss 8% dari harga beli',
  };
  
  // Method 3: Support-based
  if (supportLevel) {
    const supportStop = supportLevel * 0.99; // 1% di bawah support
    stopLossLevels.supportBased = {
      price: supportStop,
      percentage: ((currentPrice - supportStop) / currentPrice * 100).toFixed(2),
      method: 'Support Level',
      description: 'Stop loss di bawah level support',
    };
  }
  
  // Rekomendasi stop loss (gunakan ATR jika tersedia, jika tidak gunakan 5%)
  const recommended = stopLossLevels.atrBased || stopLossLevels.percent5;
  
  return {
    levels: stopLossLevels,
    recommended,
    currentPrice,
  };
}

// ============================================
// HITUNG TAKE PROFIT
// ============================================
export function calculateTakeProfit(currentPrice, stopLoss, resistanceLevel, riskRewardRatio = 2) {
  const stopLossDistance = currentPrice - stopLoss;
  const takeProfitLevels = {};
  
  // Method 1: Risk/Reward Ratio
  takeProfitLevels.rr2 = {
    price: currentPrice + (stopLossDistance * 2),
    percentage: ((stopLossDistance * 2) / currentPrice * 100).toFixed(2),
    riskReward: '1:2',
    description: 'Target 2x dari risiko (minimum)',
  };
  
  takeProfitLevels.rr3 = {
    price: currentPrice + (stopLossDistance * 3),
    percentage: ((stopLossDistance * 3) / currentPrice * 100).toFixed(2),
    riskReward: '1:3',
    description: 'Target 3x dari risiko (ideal)',
  };
  
  takeProfitLevels.rr5 = {
    price: currentPrice + (stopLossDistance * 5),
    percentage: ((stopLossDistance * 5) / currentPrice * 100).toFixed(2),
    riskReward: '1:5',
    description: 'Target 5x dari risiko (agresif)',
  };
  
  // Method 2: Resistance-based
  if (resistanceLevel && resistanceLevel > currentPrice) {
    takeProfitLevels.resistanceBased = {
      price: resistanceLevel * 0.99, // 1% di bawah resistance
      percentage: ((resistanceLevel * 0.99 - currentPrice) / currentPrice * 100).toFixed(2),
      riskReward: `1:${((resistanceLevel * 0.99 - currentPrice) / stopLossDistance).toFixed(1)}`,
      description: 'Target di level resistance',
    };
  }
  
  // Rekomendasi: gunakan R:R 2 sebagai minimum, 3 sebagai ideal
  const recommended = takeProfitLevels.rr3;
  
  return {
    levels: takeProfitLevels,
    recommended,
    currentPrice,
    stopLoss,
    riskAmount: stopLossDistance,
    riskPercent: (stopLossDistance / currentPrice * 100).toFixed(2),
  };
}

// ============================================
// POSITION SIZING
// ============================================
export function calculatePositionSize(currentPrice, stopLossPrice, portfolioSize, riskPercent) {
  const portfolioValue = portfolioSize || config.portfolio.size;
  const maxRiskPercent = riskPercent || config.portfolio.maxRiskPerTrade;
  
  // Jumlah uang yang siap dirisiko
  const riskAmount = portfolioValue * (maxRiskPercent / 100);
  
  // Jarak stop loss per saham
  const stopLossDistance = currentPrice - stopLossPrice;
  const stopLossPercent = (stopLossDistance / currentPrice) * 100;
  
  // Jumlah saham yang bisa dibeli
  const shares = Math.floor(riskAmount / stopLossDistance);
  
  // Total investasi
  const totalInvestment = shares * currentPrice;
  const portfolioPercent = (totalInvestment / portfolioValue) * 100;
  
  // Cek apakah melebihi batas maksimal (20% dari portfolio)
  const maxPositionSize = portfolioValue * 0.20;
  const adjustedShares = totalInvestment > maxPositionSize ? 
    Math.floor(maxPositionSize / currentPrice) : shares;
  const adjustedInvestment = adjustedShares * currentPrice;
  
  return {
    portfolioSize: portfolioValue,
    maxRiskPercent,
    riskAmount: riskAmount.toFixed(2),
    stopLossDistance: stopLossDistance.toFixed(2),
    stopLossPercent: stopLossPercent.toFixed(2),
    
    // Kalkulasi posisi
    recommendedShares: adjustedShares,
    totalInvestment: adjustedInvestment.toFixed(2),
    portfolioPercent: (adjustedInvestment / portfolioValue * 100).toFixed(2),
    
    // Skenario profit/loss
    scenarios: {
      stopLoss: {
        price: stopLossPrice.toFixed(2),
        loss: (adjustedShares * stopLossDistance).toFixed(2),
        lossPercent: maxRiskPercent.toFixed(2),
      },
      target1: {
        price: (currentPrice + stopLossDistance * 2).toFixed(2),
        profit: (adjustedShares * stopLossDistance * 2).toFixed(2),
        profitPercent: (maxRiskPercent * 2).toFixed(2),
      },
      target2: {
        price: (currentPrice + stopLossDistance * 3).toFixed(2),
        profit: (adjustedShares * stopLossDistance * 3).toFixed(2),
        profitPercent: (maxRiskPercent * 3).toFixed(2),
      },
    },
    
    warning: totalInvestment > maxPositionSize ? 
      `⚠️ Posisi dikurangi dari ${shares} ke ${adjustedShares} saham (maks 20% portfolio)` : null,
  };
}

// ============================================
// ANALISA RISIKO KESELURUHAN
// ============================================
export function analyzeRisk(technicalScore, fundamentalScore, sentimentScore, beta, atr) {
  // Hitung risk score (0 = sangat berisiko, 100 = sangat aman)
  let riskScore = 50;
  const riskFactors = [];
  
  // Beta risk (volatilitas vs market)
  if (beta !== null && beta !== undefined) {
    if (beta < 0.5) { riskScore += 15; riskFactors.push(`Beta ${beta.toFixed(2)} - Volatilitas rendah`); }
    else if (beta < 1) { riskScore += 5; riskFactors.push(`Beta ${beta.toFixed(2)} - Lebih stabil dari market`); }
    else if (beta < 1.5) { riskScore -= 5; riskFactors.push(`Beta ${beta.toFixed(2)} - Lebih volatil dari market`); }
    else { riskScore -= 15; riskFactors.push(`Beta ${beta.toFixed(2)} - Sangat volatil!`); }
  }
  
  // ATR risk (volatilitas harian)
  if (atr) {
    if (atr.volatility === 'LOW') { riskScore += 10; riskFactors.push('Volatilitas harian rendah'); }
    else if (atr.volatility === 'HIGH') { riskScore -= 10; riskFactors.push('Volatilitas harian tinggi'); }
  }
  
  // Technical score risk
  if (technicalScore < 30 || technicalScore > 70) {
    riskScore -= 10;
    riskFactors.push('Sinyal teknikal ekstrem - Risiko reversal');
  }
  
  // Sentiment risk
  if (sentimentScore < 30) {
    riskScore -= 10;
    riskFactors.push('Sentimen sangat negatif');
  }
  
  riskScore = Math.max(0, Math.min(100, riskScore));
  
  let riskLevel = 'MEDIUM';
  if (riskScore >= 70) riskLevel = 'LOW';
  else if (riskScore >= 50) riskLevel = 'MEDIUM';
  else if (riskScore >= 30) riskLevel = 'HIGH';
  else riskLevel = 'VERY_HIGH';
  
  return {
    score: riskScore,
    level: riskLevel,
    factors: riskFactors,
    interpretation: getRiskInterpretation(riskLevel, riskScore),
    maxPositionRecommendation: getMaxPosition(riskLevel),
  };
}

function getRiskInterpretation(level, score) {
  switch (level) {
    case 'LOW': return `🟢 Risiko Rendah (${score}/100) - Aman untuk posisi normal`;
    case 'MEDIUM': return `🟡 Risiko Sedang (${score}/100) - Gunakan position sizing yang tepat`;
    case 'HIGH': return `🟠 Risiko Tinggi (${score}/100) - Kurangi ukuran posisi`;
    case 'VERY_HIGH': return `🔴 Risiko Sangat Tinggi (${score}/100) - Hindari atau posisi sangat kecil`;
    default: return `Risiko: ${score}/100`;
  }
}

function getMaxPosition(riskLevel) {
  switch (riskLevel) {
    case 'LOW': return '10-20% dari portfolio';
    case 'MEDIUM': return '5-10% dari portfolio';
    case 'HIGH': return '2-5% dari portfolio';
    case 'VERY_HIGH': return 'Maksimal 2% dari portfolio';
    default: return '5% dari portfolio';
  }
}

// ============================================
// PSIKOLOGI TRADING - SARAN BERDASARKAN KONDISI
// ============================================
export function getTradingPsychologyAdvice(recommendation, riskLevel, technicalScore, sentimentScore) {
  const advice = [];
  
  // Saran berdasarkan rekomendasi
  if (recommendation === 'STRONG BUY' || recommendation === 'BUY') {
    advice.push({
      type: 'ENTRY',
      title: '✅ Strategi Entry',
      content: [
        'Masuk secara bertahap (Dollar Cost Averaging), jangan sekaligus',
        'Beli 50% posisi sekarang, 50% lagi jika ada pullback',
        'Pastikan stop loss sudah dipasang sebelum masuk',
        'Jangan FOMO - jika sudah naik banyak, tunggu koreksi',
      ],
    });
  }
  
  if (recommendation === 'SELL' || recommendation === 'STRONG SELL') {
    advice.push({
      type: 'EXIT',
      title: '⚠️ Strategi Exit',
      content: [
        'Jual secara bertahap, jangan panik sell sekaligus',
        'Jika sudah profit, amankan sebagian keuntungan dulu',
        'Jangan average down pada saham yang fundamentalnya buruk',
        'Terima kerugian kecil daripada kerugian besar',
      ],
    });
  }
  
  if (recommendation === 'HOLD' || recommendation === 'WAIT') {
    advice.push({
      type: 'WAIT',
      title: '⏳ Strategi Wait & See',
      content: [
        'Sabar menunggu konfirmasi sinyal yang lebih jelas',
        'Jangan terburu-buru masuk tanpa konfirmasi',
        'Gunakan waktu ini untuk riset lebih dalam',
        'Set alert harga untuk level support/resistance kunci',
      ],
    });
  }
  
  // Saran berdasarkan risiko
  if (riskLevel === 'HIGH' || riskLevel === 'VERY_HIGH') {
    advice.push({
      type: 'RISK',
      title: '🛡️ Manajemen Risiko',
      content: [
        'Kurangi ukuran posisi dari biasanya',
        'Pastikan stop loss lebih ketat dari biasanya',
        'Jangan gunakan leverage/margin',
        'Diversifikasi - jangan taruh semua di satu saham',
      ],
    });
  }
  
  // Saran psikologi umum
  advice.push({
    type: 'PSYCHOLOGY',
    title: '🧠 Psikologi Trading',
    content: [
      'Jangan trading berdasarkan emosi (takut atau serakah)',
      'Patuhi rencana trading yang sudah dibuat',
      'Catat setiap trade dalam jurnal trading',
      'Evaluasi hasil trading secara berkala',
      'Ingat: Tidak ada analisa yang 100% benar',
      'Lindungi modal adalah prioritas utama',
    ],
  });
  
  // Saran berdasarkan sentimen
  if (sentimentScore < 35) {
    advice.push({
      type: 'SENTIMENT',
      title: '📰 Perhatian Sentimen',
      content: [
        'Sentimen pasar sangat negatif - ekstra hati-hati',
        'Tunggu sentimen membaik sebelum masuk',
        'Berita buruk bisa terus menekan harga',
        'Jika sudah punya posisi, pertimbangkan untuk reduce',
      ],
    });
  } else if (sentimentScore > 75) {
    advice.push({
      type: 'SENTIMENT',
      title: '⚠️ Perhatian Sentimen Terlalu Positif',
      content: [
        'Sentimen terlalu positif bisa jadi tanda puncak',
        'Jangan FOMO saat semua orang optimis',
        'Pertimbangkan untuk ambil profit sebagian',
        'Ingat: "Buy the rumor, sell the news"',
      ],
    });
  }
  
  return advice;
}

// ============================================
// FUNGSI UTAMA: Jalankan semua analisa risiko
// ============================================
export function runRiskAnalysis(symbol, currentPrice, technicalAnalysis, fundamentalAnalysis, sentimentAnalysis) {
  const atr = technicalAnalysis?.atr;
  const supportResistance = technicalAnalysis?.supportResistance;
  const beta = fundamentalAnalysis?.priceInfo?.beta;
  
  const techScore = technicalAnalysis?.score || 50;
  const fundScore = fundamentalAnalysis?.totalScore || 50;
  const sentScore = sentimentAnalysis?.overallScore || 50;
  
  // Stop Loss
  const stopLossAnalysis = calculateStopLoss(
    currentPrice,
    atr,
    supportResistance?.support
  );
  
  const recommendedStopLoss = stopLossAnalysis.recommended?.price || currentPrice * 0.95;
  
  // Take Profit
  const takeProfitAnalysis = calculateTakeProfit(
    currentPrice,
    recommendedStopLoss,
    supportResistance?.resistance
  );
  
  // Position Sizing
  const positionSizing = calculatePositionSize(
    currentPrice,
    recommendedStopLoss,
    config.portfolio.size,
    config.portfolio.maxRiskPerTrade
  );
  
  // Risk Analysis
  const riskAnalysis = analyzeRisk(techScore, fundScore, sentScore, beta, atr);
  
  // Tentukan rekomendasi akhir
  const avgScore = (techScore * 0.4 + fundScore * 0.35 + sentScore * 0.25);
  
  let finalRecommendation = 'HOLD';
  if (avgScore >= 72) finalRecommendation = 'STRONG BUY';
  else if (avgScore >= 60) finalRecommendation = 'BUY';
  else if (avgScore >= 45) finalRecommendation = 'HOLD';
  else if (avgScore >= 33) finalRecommendation = 'SELL';
  else finalRecommendation = 'STRONG SELL';
  
  // Jika risiko sangat tinggi, turunkan rekomendasi
  if (riskAnalysis.level === 'VERY_HIGH' && finalRecommendation === 'STRONG BUY') {
    finalRecommendation = 'BUY';
  }
  
  // Psychology advice
  const psychologyAdvice = getTradingPsychologyAdvice(
    finalRecommendation,
    riskAnalysis.level,
    techScore,
    sentScore
  );
  
  return {
    symbol,
    currentPrice,
    finalRecommendation,
    scores: {
      technical: techScore,
      fundamental: fundScore,
      sentiment: sentScore,
      average: Math.round(avgScore),
    },
    stopLoss: stopLossAnalysis,
    takeProfit: takeProfitAnalysis,
    positionSizing,
    riskAnalysis,
    psychologyAdvice,
  };
}

// ============================================
// FORMAT LAPORAN RISIKO UNTUK TELEGRAM
// ============================================
export function formatRiskReport(riskData) {
  if (!riskData) return '❌ Data risiko tidak tersedia';
  
  const { symbol, currentPrice, finalRecommendation, scores, stopLoss, takeProfit, positionSizing, riskAnalysis, psychologyAdvice } = riskData;
  
  const recEmoji = {
    'STRONG BUY': '🟢🟢 STRONG BUY',
    'BUY': '🟢 BUY',
    'HOLD': '⚪ HOLD',
    'WAIT': '🟡 WAIT',
    'SELL': '🔴 SELL',
    'STRONG SELL': '🔴🔴 STRONG SELL',
  }[finalRecommendation] || finalRecommendation;
  
  const sl = stopLoss.recommended;
  const tp = takeProfit.recommended;
  const ps = positionSizing;
  
  let report = `
🛡️ *MANAJEMEN RISIKO: ${symbol}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 *Harga Saat Ini: $${currentPrice?.toFixed(2)}*

📊 *SKOR ANALISA*
├ Teknikal: ${scores.technical}/100
├ Fundamental: ${scores.fundamental}/100
├ Sentimen: ${scores.sentiment}/100
└ Rata-rata: ${scores.average}/100

🎯 *REKOMENDASI AKHIR: ${recEmoji}*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛑 *STOP LOSS*
├ Harga: $${sl?.price?.toFixed(2) || 'N/A'}
├ Jarak: ${sl?.percentage || 'N/A'}% dari harga beli
└ Metode: ${sl?.method || 'N/A'}

🎯 *TAKE PROFIT*
├ Target 1 (R:R 2:1): $${takeProfit.levels.rr2?.price?.toFixed(2) || 'N/A'} (+${takeProfit.levels.rr2?.percentage || 'N/A'}%)
├ Target 2 (R:R 3:1): $${takeProfit.levels.rr3?.price?.toFixed(2) || 'N/A'} (+${takeProfit.levels.rr3?.percentage || 'N/A'}%)
└ Target 3 (R:R 5:1): $${takeProfit.levels.rr5?.price?.toFixed(2) || 'N/A'} (+${takeProfit.levels.rr5?.percentage || 'N/A'}%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 *POSITION SIZING*
├ Modal Portfolio: $${ps.portfolioSize.toLocaleString()}
├ Risiko per Trade: ${ps.maxRiskPercent}% = $${ps.riskAmount}
├ Jumlah Saham: ${ps.recommendedShares} lembar
├ Total Investasi: $${ps.totalInvestment} (${ps.portfolioPercent}% portfolio)
│
├ 📉 Jika Stop Loss: -$${ps.scenarios.stopLoss.loss} (-${ps.scenarios.stopLoss.lossPercent}%)
├ 📈 Target 1: +$${ps.scenarios.target1.profit} (+${ps.scenarios.target1.profitPercent}%)
└ 📈 Target 2: +$${ps.scenarios.target2.profit} (+${ps.scenarios.target2.profitPercent}%)
`;

  if (ps.warning) report += `\n⚠️ ${ps.warning}\n`;
  
  report += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ *LEVEL RISIKO: ${riskAnalysis.level}*
${riskAnalysis.interpretation}
📌 Maksimal posisi: ${riskAnalysis.maxPositionRecommendation}
`;
  
  // Psychology advice (ringkas)
  if (psychologyAdvice.length > 0) {
    report += `\n🧠 *SARAN TRADING:*\n`;
    const mainAdvice = psychologyAdvice[0];
    report += `${mainAdvice.title}\n`;
    for (const tip of mainAdvice.content.slice(0, 3)) {
      report += `• ${tip}\n`;
    }
  }
  
  return report;
}
