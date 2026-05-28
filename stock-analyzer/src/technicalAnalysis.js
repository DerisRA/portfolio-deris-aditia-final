// ============================================
// ANALISA TEKNIKAL
// ============================================
// Menghitung semua indikator teknikal:
// RSI, MACD, Bollinger Bands, Moving Average,
// Stochastic, ATR, Volume Analysis, dll

// ============================================
// HELPER: Hitung rata-rata (Simple Moving Average)
// ============================================
function calculateSMA(data, period) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const avg = slice.reduce((sum, val) => sum + val, 0) / period;
      result.push(avg);
    }
  }
  return result;
}

// ============================================
// HELPER: Hitung Exponential Moving Average
// ============================================
function calculateEMA(data, period) {
  const result = [];
  const multiplier = 2 / (period + 1);
  
  // Mulai dengan SMA untuk nilai pertama
  let ema = data.slice(0, period).reduce((sum, val) => sum + val, 0) / period;
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(null);
    } else if (i === period - 1) {
      result.push(ema);
    } else {
      ema = (data[i] - ema) * multiplier + ema;
      result.push(ema);
    }
  }
  return result;
}

// ============================================
// RSI - Relative Strength Index
// ============================================
export function calculateRSI(closes, period = 14) {
  if (closes.length < period + 1) return null;
  
  const changes = [];
  for (let i = 1; i < closes.length; i++) {
    changes.push(closes[i] - closes[i - 1]);
  }
  
  let gains = 0, losses = 0;
  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) gains += changes[i];
    else losses += Math.abs(changes[i]);
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  const rsiValues = [];
  
  for (let i = period; i < changes.length; i++) {
    const change = changes[i];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? Math.abs(change) : 0;
    
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    rsiValues.push(rsi);
  }
  
  const currentRSI = rsiValues[rsiValues.length - 1];
  const previousRSI = rsiValues[rsiValues.length - 2];
  
  let signal = 'NEUTRAL';
  let strength = 'NORMAL';
  
  if (currentRSI < 30) {
    signal = 'BUY';
    strength = currentRSI < 20 ? 'STRONG' : 'MODERATE';
  } else if (currentRSI > 70) {
    signal = 'SELL';
    strength = currentRSI > 80 ? 'STRONG' : 'MODERATE';
  }
  
  // Divergence check (RSI naik tapi harga turun = bullish divergence)
  const trend = currentRSI > previousRSI ? 'RISING' : 'FALLING';
  
  return {
    value: currentRSI,
    previous: previousRSI,
    signal,
    strength,
    trend,
    interpretation: getRSIInterpretation(currentRSI),
    history: rsiValues.slice(-20), // 20 nilai terakhir
  };
}

function getRSIInterpretation(rsi) {
  if (rsi < 20) return '🔥 Sangat Oversold - Potensi rebound kuat';
  if (rsi < 30) return '📉 Oversold - Sinyal beli potensial';
  if (rsi < 40) return '⬇️ Mendekati oversold - Perhatikan';
  if (rsi < 60) return '➡️ Netral - Tidak ada sinyal jelas';
  if (rsi < 70) return '⬆️ Mendekati overbought - Hati-hati';
  if (rsi < 80) return '📈 Overbought - Sinyal jual potensial';
  return '🚨 Sangat Overbought - Risiko koreksi tinggi';
}

// ============================================
// MACD - Moving Average Convergence Divergence
// ============================================
export function calculateMACD(closes, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  if (closes.length < slowPeriod + signalPeriod) return null;
  
  const fastEMA = calculateEMA(closes, fastPeriod);
  const slowEMA = calculateEMA(closes, slowPeriod);
  
  // MACD Line = Fast EMA - Slow EMA
  const macdLine = fastEMA.map((fast, i) => {
    if (fast === null || slowEMA[i] === null) return null;
    return fast - slowEMA[i];
  });
  
  // Filter null values untuk signal line
  const validMacd = macdLine.filter(v => v !== null);
  const signalEMA = calculateEMA(validMacd, signalPeriod);
  
  // Align signal dengan macd
  const nullCount = macdLine.filter(v => v === null).length;
  const fullSignal = [...Array(nullCount).fill(null), ...signalEMA];
  
  // Histogram = MACD - Signal
  const histogram = macdLine.map((macd, i) => {
    if (macd === null || fullSignal[i] === null) return null;
    return macd - fullSignal[i];
  });
  
  const currentMACD = validMacd[validMacd.length - 1];
  const currentSignal = signalEMA[signalEMA.length - 1];
  const currentHistogram = currentMACD - currentSignal;
  const previousHistogram = validMacd[validMacd.length - 2] - signalEMA[signalEMA.length - 2];
  
  // Deteksi crossover
  const prevMACD = validMacd[validMacd.length - 2];
  const prevSignal = signalEMA[signalEMA.length - 2];
  
  let signal = 'NEUTRAL';
  let crossover = null;
  
  if (prevMACD < prevSignal && currentMACD > currentSignal) {
    signal = 'BUY';
    crossover = 'BULLISH_CROSSOVER'; // MACD cross di atas Signal
  } else if (prevMACD > prevSignal && currentMACD < currentSignal) {
    signal = 'SELL';
    crossover = 'BEARISH_CROSSOVER'; // MACD cross di bawah Signal
  } else if (currentMACD > currentSignal) {
    signal = 'BULLISH';
  } else {
    signal = 'BEARISH';
  }
  
  // Momentum: histogram makin besar = momentum kuat
  const momentum = currentHistogram > previousHistogram ? 'INCREASING' : 'DECREASING';
  
  return {
    macd: currentMACD,
    signal: currentSignal,
    histogram: currentHistogram,
    crossover,
    trend: signal,
    momentum,
    aboveZero: currentMACD > 0,
    interpretation: getMACDInterpretation(signal, crossover, currentMACD),
  };
}

function getMACDInterpretation(signal, crossover, macd) {
  if (crossover === 'BULLISH_CROSSOVER') return '🟢 MACD Golden Cross - Sinyal beli kuat!';
  if (crossover === 'BEARISH_CROSSOVER') return '🔴 MACD Death Cross - Sinyal jual kuat!';
  if (signal === 'BULLISH') return macd > 0 ? '📈 Trend bullish kuat (di atas zero)' : '⬆️ Momentum bullish (di bawah zero)';
  return macd < 0 ? '📉 Trend bearish kuat (di bawah zero)' : '⬇️ Momentum bearish (di atas zero)';
}

// ============================================
// BOLLINGER BANDS
// ============================================
export function calculateBollingerBands(closes, period = 20, stdDev = 2) {
  if (closes.length < period) return null;
  
  const sma = calculateSMA(closes, period);
  const validSMA = sma.filter(v => v !== null);
  
  const bands = [];
  for (let i = period - 1; i < closes.length; i++) {
    const slice = closes.slice(i - period + 1, i + 1);
    const mean = sma[i];
    const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
    const std = Math.sqrt(variance);
    
    bands.push({
      upper: mean + stdDev * std,
      middle: mean,
      lower: mean - stdDev * std,
      bandwidth: ((mean + stdDev * std) - (mean - stdDev * std)) / mean * 100,
      percentB: (closes[i] - (mean - stdDev * std)) / ((mean + stdDev * std) - (mean - stdDev * std)),
    });
  }
  
  const current = bands[bands.length - 1];
  const currentPrice = closes[closes.length - 1];
  
  let signal = 'NEUTRAL';
  let position = 'MIDDLE';
  
  if (currentPrice <= current.lower) {
    signal = 'BUY';
    position = 'LOWER_BAND';
  } else if (currentPrice >= current.upper) {
    signal = 'SELL';
    position = 'UPPER_BAND';
  } else if (currentPrice < current.middle) {
    position = 'BELOW_MIDDLE';
  } else {
    position = 'ABOVE_MIDDLE';
  }
  
  // Squeeze: bandwidth kecil = volatilitas rendah, siap breakout
  const prevBandwidth = bands[bands.length - 5]?.bandwidth || current.bandwidth;
  const squeeze = current.bandwidth < prevBandwidth * 0.8;
  
  return {
    upper: current.upper,
    middle: current.middle,
    lower: current.lower,
    bandwidth: current.bandwidth,
    percentB: current.percentB,
    signal,
    position,
    squeeze,
    currentPrice,
    distanceFromUpper: ((current.upper - currentPrice) / currentPrice * 100).toFixed(2),
    distanceFromLower: ((currentPrice - current.lower) / currentPrice * 100).toFixed(2),
    interpretation: getBBInterpretation(signal, position, squeeze),
  };
}

function getBBInterpretation(signal, position, squeeze) {
  if (squeeze) return '⚡ Bollinger Squeeze - Siap breakout besar!';
  if (position === 'LOWER_BAND') return '📉 Harga di lower band - Potensi rebound';
  if (position === 'UPPER_BAND') return '📈 Harga di upper band - Potensi koreksi';
  if (position === 'BELOW_MIDDLE') return '⬇️ Harga di bawah middle band';
  return '⬆️ Harga di atas middle band';
}

// ============================================
// MOVING AVERAGES
// ============================================
export function calculateMovingAverages(closes) {
  if (closes.length < 200) {
    console.log('⚠️ Data kurang dari 200 hari, beberapa MA tidak tersedia');
  }
  
  const currentPrice = closes[closes.length - 1];
  
  const ma20 = calculateSMA(closes, 20);
  const ma50 = calculateSMA(closes, 50);
  const ma100 = calculateSMA(closes, 100);
  const ma200 = calculateSMA(closes, 200);
  const ema9 = calculateEMA(closes, 9);
  const ema21 = calculateEMA(closes, 21);
  
  const currentMA20 = ma20[ma20.length - 1];
  const currentMA50 = ma50[ma50.length - 1];
  const currentMA100 = ma100[ma100.length - 1];
  const currentMA200 = ma200[ma200.length - 1];
  const currentEMA9 = ema9[ema9.length - 1];
  const currentEMA21 = ema21[ema21.length - 1];
  
  // Golden Cross / Death Cross (MA50 vs MA200)
  const prevMA50 = ma50[ma50.length - 2];
  const prevMA200 = ma200[ma200.length - 2];
  
  let goldenCross = false;
  let deathCross = false;
  
  if (currentMA50 && currentMA200 && prevMA50 && prevMA200) {
    if (prevMA50 < prevMA200 && currentMA50 > currentMA200) goldenCross = true;
    if (prevMA50 > prevMA200 && currentMA50 < currentMA200) deathCross = true;
  }
  
  // Trend berdasarkan posisi harga vs MA
  const bullishSignals = [
    currentPrice > currentMA20,
    currentPrice > currentMA50,
    currentPrice > currentMA200,
    currentMA50 > currentMA200, // Uptrend
  ].filter(Boolean).length;
  
  const trend = bullishSignals >= 3 ? 'BULLISH' : bullishSignals <= 1 ? 'BEARISH' : 'NEUTRAL';
  
  return {
    ma20: currentMA20,
    ma50: currentMA50,
    ma100: currentMA100,
    ma200: currentMA200,
    ema9: currentEMA9,
    ema21: currentEMA21,
    currentPrice,
    goldenCross,
    deathCross,
    trend,
    priceVsMA: {
      aboveMA20: currentPrice > currentMA20,
      aboveMA50: currentPrice > currentMA50,
      aboveMA100: currentPrice > currentMA100,
      aboveMA200: currentPrice > currentMA200,
    },
    distanceFromMA200: currentMA200 ? ((currentPrice - currentMA200) / currentMA200 * 100).toFixed(2) : null,
    interpretation: getMAInterpretation(trend, goldenCross, deathCross),
  };
}

function getMAInterpretation(trend, goldenCross, deathCross) {
  if (goldenCross) return '🌟 Golden Cross! MA50 cross MA200 ke atas - Sinyal bullish jangka panjang!';
  if (deathCross) return '💀 Death Cross! MA50 cross MA200 ke bawah - Sinyal bearish jangka panjang!';
  if (trend === 'BULLISH') return '📈 Trend bullish - Harga di atas semua MA utama';
  if (trend === 'BEARISH') return '📉 Trend bearish - Harga di bawah MA utama';
  return '➡️ Trend sideways/mixed - Tidak ada arah jelas';
}

// ============================================
// STOCHASTIC OSCILLATOR
// ============================================
export function calculateStochastic(highs, lows, closes, kPeriod = 14, dPeriod = 3) {
  if (closes.length < kPeriod) return null;
  
  const kValues = [];
  
  for (let i = kPeriod - 1; i < closes.length; i++) {
    const highSlice = highs.slice(i - kPeriod + 1, i + 1);
    const lowSlice = lows.slice(i - kPeriod + 1, i + 1);
    const highestHigh = Math.max(...highSlice);
    const lowestLow = Math.min(...lowSlice);
    
    const k = highestHigh === lowestLow ? 50 : 
      ((closes[i] - lowestLow) / (highestHigh - lowestLow)) * 100;
    kValues.push(k);
  }
  
  // %D = SMA dari %K
  const dValues = calculateSMA(kValues, dPeriod);
  
  const currentK = kValues[kValues.length - 1];
  const currentD = dValues[dValues.length - 1];
  const prevK = kValues[kValues.length - 2];
  const prevD = dValues[dValues.length - 2];
  
  let signal = 'NEUTRAL';
  if (currentK < 20 && currentD < 20) signal = 'BUY';
  else if (currentK > 80 && currentD > 80) signal = 'SELL';
  else if (prevK < prevD && currentK > currentD) signal = 'BUY'; // Bullish crossover
  else if (prevK > prevD && currentK < currentD) signal = 'SELL'; // Bearish crossover
  
  return {
    k: currentK,
    d: currentD,
    signal,
    oversold: currentK < 20,
    overbought: currentK > 80,
    interpretation: currentK < 20 ? '📉 Stochastic Oversold - Potensi naik' :
                   currentK > 80 ? '📈 Stochastic Overbought - Potensi turun' :
                   '➡️ Stochastic Normal',
  };
}

// ============================================
// ATR - Average True Range (Volatilitas)
// ============================================
export function calculateATR(highs, lows, closes, period = 14) {
  if (closes.length < period + 1) return null;
  
  const trueRanges = [];
  for (let i = 1; i < closes.length; i++) {
    const tr = Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    );
    trueRanges.push(tr);
  }
  
  const atrValues = calculateSMA(trueRanges, period);
  const currentATR = atrValues[atrValues.length - 1];
  const currentPrice = closes[closes.length - 1];
  
  return {
    value: currentATR,
    percentage: (currentATR / currentPrice * 100).toFixed(2),
    volatility: currentATR / currentPrice > 0.03 ? 'HIGH' : 
                currentATR / currentPrice > 0.015 ? 'MEDIUM' : 'LOW',
    // Untuk stop loss: harga - 2*ATR
    suggestedStopLoss: currentPrice - (2 * currentATR),
    suggestedStopLossPercent: ((2 * currentATR) / currentPrice * 100).toFixed(2),
  };
}

// ============================================
// VOLUME ANALYSIS
// ============================================
export function analyzeVolume(volumes, closes) {
  if (volumes.length < 20) return null;
  
  const avgVolume20 = volumes.slice(-20).reduce((sum, v) => sum + v, 0) / 20;
  const avgVolume50 = volumes.length >= 50 ? 
    volumes.slice(-50).reduce((sum, v) => sum + v, 0) / 50 : avgVolume20;
  
  const currentVolume = volumes[volumes.length - 1];
  const volumeRatio = currentVolume / avgVolume20;
  
  // On-Balance Volume (OBV)
  let obv = 0;
  const obvValues = [0];
  for (let i = 1; i < closes.length; i++) {
    if (closes[i] > closes[i - 1]) obv += volumes[i];
    else if (closes[i] < closes[i - 1]) obv -= volumes[i];
    obvValues.push(obv);
  }
  
  const obvTrend = obvValues[obvValues.length - 1] > obvValues[obvValues.length - 10] ? 
    'RISING' : 'FALLING';
  
  // Volume trend
  const recentVolumes = volumes.slice(-5);
  const olderVolumes = volumes.slice(-10, -5);
  const recentAvg = recentVolumes.reduce((sum, v) => sum + v, 0) / 5;
  const olderAvg = olderVolumes.reduce((sum, v) => sum + v, 0) / 5;
  const volumeTrend = recentAvg > olderAvg ? 'INCREASING' : 'DECREASING';
  
  return {
    current: currentVolume,
    average20: Math.round(avgVolume20),
    average50: Math.round(avgVolume50),
    ratio: volumeRatio.toFixed(2),
    isHighVolume: volumeRatio > 1.5,
    isLowVolume: volumeRatio < 0.5,
    obvTrend,
    volumeTrend,
    interpretation: getVolumeInterpretation(volumeRatio, obvTrend, closes),
  };
}

function getVolumeInterpretation(ratio, obvTrend, closes) {
  const priceUp = closes[closes.length - 1] > closes[closes.length - 2];
  
  if (ratio > 2 && priceUp) return '🚀 Volume sangat tinggi + harga naik = Konfirmasi bullish kuat!';
  if (ratio > 2 && !priceUp) return '⚠️ Volume sangat tinggi + harga turun = Tekanan jual kuat!';
  if (ratio > 1.5 && priceUp) return '📈 Volume tinggi + harga naik = Sinyal bullish';
  if (ratio > 1.5 && !priceUp) return '📉 Volume tinggi + harga turun = Sinyal bearish';
  if (ratio < 0.5) return '😴 Volume sangat rendah - Pergerakan tidak meyakinkan';
  return '➡️ Volume normal';
}

// ============================================
// SUPPORT & RESISTANCE
// ============================================
export function findSupportResistance(highs, lows, closes, lookback = 20) {
  const recentHighs = highs.slice(-lookback);
  const recentLows = lows.slice(-lookback);
  const currentPrice = closes[closes.length - 1];
  
  // Cari level support dan resistance
  const resistance = Math.max(...recentHighs);
  const support = Math.min(...recentLows);
  
  // Pivot points (berdasarkan data terakhir)
  const lastHigh = highs[highs.length - 1];
  const lastLow = lows[lows.length - 1];
  const lastClose = closes[closes.length - 1];
  
  const pivot = (lastHigh + lastLow + lastClose) / 3;
  const r1 = 2 * pivot - lastLow;
  const r2 = pivot + (lastHigh - lastLow);
  const s1 = 2 * pivot - lastHigh;
  const s2 = pivot - (lastHigh - lastLow);
  
  return {
    resistance,
    support,
    pivot,
    r1, r2,
    s1, s2,
    currentPrice,
    distanceToResistance: ((resistance - currentPrice) / currentPrice * 100).toFixed(2),
    distanceToSupport: ((currentPrice - support) / currentPrice * 100).toFixed(2),
    nearResistance: (resistance - currentPrice) / currentPrice < 0.02,
    nearSupport: (currentPrice - support) / currentPrice < 0.02,
  };
}

// ============================================
// TREND ANALYSIS
// ============================================
export function analyzeTrend(closes, period = 20) {
  if (closes.length < period) return null;
  
  const recent = closes.slice(-period);
  const n = recent.length;
  
  // Linear regression untuk trend
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += recent[i];
    sumXY += i * recent[i];
    sumX2 += i * i;
  }
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  // Normalize slope
  const avgPrice = sumY / n;
  const normalizedSlope = (slope / avgPrice) * 100;
  
  let trendDirection = 'SIDEWAYS';
  let trendStrength = 'WEAK';
  
  if (normalizedSlope > 0.1) {
    trendDirection = 'UPTREND';
    trendStrength = normalizedSlope > 0.3 ? 'STRONG' : 'MODERATE';
  } else if (normalizedSlope < -0.1) {
    trendDirection = 'DOWNTREND';
    trendStrength = normalizedSlope < -0.3 ? 'STRONG' : 'MODERATE';
  }
  
  // Hitung perubahan harga
  const priceChange = ((closes[closes.length - 1] - closes[closes.length - period]) / closes[closes.length - period]) * 100;
  
  return {
    direction: trendDirection,
    strength: trendStrength,
    slope: normalizedSlope.toFixed(4),
    priceChange: priceChange.toFixed(2),
    interpretation: `${trendDirection} (${trendStrength}) - Perubahan ${priceChange.toFixed(2)}% dalam ${period} hari`,
  };
}

// ============================================
// FUNGSI UTAMA: Jalankan semua analisa teknikal
// ============================================
export function runTechnicalAnalysis(historicalData) {
  if (!historicalData || historicalData.length < 30) {
    return { error: 'Data tidak cukup untuk analisa teknikal' };
  }
  
  const closes = historicalData.map(d => d.close).filter(v => v !== null);
  const highs = historicalData.map(d => d.high).filter(v => v !== null);
  const lows = historicalData.map(d => d.low).filter(v => v !== null);
  const volumes = historicalData.map(d => d.volume).filter(v => v !== null);
  
  const rsi = calculateRSI(closes);
  const macd = calculateMACD(closes);
  const bb = calculateBollingerBands(closes);
  const ma = calculateMovingAverages(closes);
  const stoch = calculateStochastic(highs, lows, closes);
  const atr = calculateATR(highs, lows, closes);
  const volume = analyzeVolume(volumes, closes);
  const sr = findSupportResistance(highs, lows, closes);
  const trend = analyzeTrend(closes);
  
  // Hitung skor teknikal (0-100)
  let score = 50; // Mulai dari netral
  let signals = [];
  
  // RSI scoring
  if (rsi) {
    if (rsi.signal === 'BUY') { score += rsi.strength === 'STRONG' ? 15 : 10; signals.push('RSI: BUY'); }
    else if (rsi.signal === 'SELL') { score -= rsi.strength === 'STRONG' ? 15 : 10; signals.push('RSI: SELL'); }
  }
  
  // MACD scoring
  if (macd) {
    if (macd.crossover === 'BULLISH_CROSSOVER') { score += 15; signals.push('MACD: BULLISH CROSS'); }
    else if (macd.crossover === 'BEARISH_CROSSOVER') { score -= 15; signals.push('MACD: BEARISH CROSS'); }
    else if (macd.trend === 'BULLISH') { score += 5; }
    else if (macd.trend === 'BEARISH') { score -= 5; }
  }
  
  // Bollinger Bands scoring
  if (bb) {
    if (bb.signal === 'BUY') { score += 10; signals.push('BB: Oversold'); }
    else if (bb.signal === 'SELL') { score -= 10; signals.push('BB: Overbought'); }
  }
  
  // Moving Average scoring
  if (ma) {
    if (ma.goldenCross) { score += 20; signals.push('MA: GOLDEN CROSS!'); }
    else if (ma.deathCross) { score -= 20; signals.push('MA: DEATH CROSS!'); }
    else if (ma.trend === 'BULLISH') { score += 10; signals.push('MA: Bullish'); }
    else if (ma.trend === 'BEARISH') { score -= 10; signals.push('MA: Bearish'); }
  }
  
  // Volume scoring
  if (volume) {
    if (volume.isHighVolume && closes[closes.length - 1] > closes[closes.length - 2]) {
      score += 5; signals.push('Volume: Konfirmasi naik');
    } else if (volume.isHighVolume && closes[closes.length - 1] < closes[closes.length - 2]) {
      score -= 5; signals.push('Volume: Konfirmasi turun');
    }
  }
  
  // Clamp score 0-100
  score = Math.max(0, Math.min(100, score));
  
  // Tentukan rekomendasi
  let recommendation = 'HOLD';
  if (score >= 75) recommendation = 'STRONG BUY';
  else if (score >= 60) recommendation = 'BUY';
  else if (score >= 45) recommendation = 'HOLD';
  else if (score >= 30) recommendation = 'SELL';
  else recommendation = 'STRONG SELL';
  
  return {
    rsi,
    macd,
    bollingerBands: bb,
    movingAverages: ma,
    stochastic: stoch,
    atr,
    volume,
    supportResistance: sr,
    trend,
    score,
    recommendation,
    signals,
    currentPrice: closes[closes.length - 1],
    dataPoints: closes.length,
  };
}
