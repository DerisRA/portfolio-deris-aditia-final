// ============================================
// TRADINGVIEW CONNECTOR
// ============================================
// Menghubungkan ke TradingView untuk:
// 1. Mendapatkan data real-time via WebSocket
// 2. Mengambil technical indicators dari TradingView
// 3. Mendapatkan rekomendasi TradingView
//
// Berdasarkan: https://github.com/Mathieu2301/Tradingview-API

import axios from 'axios';
import crypto from 'crypto';

// ============================================
// TRADINGVIEW TECHNICAL ANALYSIS API
// (Tidak perlu login untuk data publik)
// ============================================

const TV_SCAN_URL = 'https://scanner.tradingview.com/america/scan';

// Mapping interval
const INTERVAL_MAP = {
  '1m': '1',
  '5m': '5',
  '15m': '15',
  '30m': '30',
  '1h': '60',
  '2h': '120',
  '4h': '240',
  '1d': '1D',
  '1w': '1W',
  '1M': '1M',
};

// ============================================
// AMBIL REKOMENDASI TEKNIKAL DARI TRADINGVIEW
// ============================================
export async function getTradingViewRecommendation(symbol, interval = '1d') {
  try {
    console.log(`📡 Mengambil rekomendasi TradingView untuk ${symbol}...`);
    
    const tvInterval = INTERVAL_MAP[interval] || '1D';
    
    // TradingView Scanner API
    const payload = {
      symbols: {
        tickers: [`NASDAQ:${symbol}`, `NYSE:${symbol}`, `AMEX:${symbol}`],
        query: { types: [] },
      },
      columns: [
        'Recommend.All',
        'Recommend.MA',
        'Recommend.Other',
        'RSI',
        'RSI[1]',
        'MACD.macd',
        'MACD.signal',
        'Mom',
        'Mom[1]',
        'BB.upper',
        'BB.lower',
        'BB.basis',
        'EMA10',
        'EMA20',
        'EMA30',
        'EMA50',
        'EMA100',
        'EMA200',
        'SMA10',
        'SMA20',
        'SMA30',
        'SMA50',
        'SMA100',
        'SMA200',
        'Stoch.K',
        'Stoch.D',
        'ADX',
        'ADX+DI',
        'ADX-DI',
        'AO',
        'CCI20',
        'volume',
        'change',
        'close',
        'open',
        'high',
        'low',
      ],
    };
    
    // Coba beberapa exchange
    const exchanges = ['NASDAQ', 'NYSE', 'AMEX'];
    let data = null;
    
    for (const exchange of exchanges) {
      try {
        const scanUrl = `https://scanner.tradingview.com/america/scan`;
        const singlePayload = {
          symbols: {
            tickers: [`${exchange}:${symbol}`],
            query: { types: [] },
          },
          columns: payload.columns,
        };
        
        const response = await axios.post(scanUrl, singlePayload, {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Origin': 'https://www.tradingview.com',
            'Referer': 'https://www.tradingview.com/',
          },
          timeout: 15000,
        });
        
        if (response.data?.data?.[0]?.d) {
          data = response.data.data[0].d;
          console.log(`✅ Data TradingView ditemukan di ${exchange}:${symbol}`);
          break;
        }
      } catch (e) {
        // Coba exchange berikutnya
      }
    }
    
    if (!data) {
      console.log(`⚠️ Data TradingView tidak ditemukan untuk ${symbol}`);
      return null;
    }
    
    const columns = payload.columns;
    const result = {};
    columns.forEach((col, i) => {
      result[col] = data[i];
    });
    
    // Parse rekomendasi
    const recommendAll = result['Recommend.All'];
    const recommendMA = result['Recommend.MA'];
    const recommendOther = result['Recommend.Other'];
    
    const parseRecommend = (val) => {
      if (val === null || val === undefined) return 'NEUTRAL';
      if (val >= 0.5) return 'STRONG_BUY';
      if (val >= 0.1) return 'BUY';
      if (val > -0.1) return 'NEUTRAL';
      if (val > -0.5) return 'SELL';
      return 'STRONG_SELL';
    };
    
    return {
      symbol,
      exchange: 'US',
      interval,
      
      // Rekomendasi keseluruhan
      recommendation: {
        overall: parseRecommend(recommendAll),
        movingAverages: parseRecommend(recommendMA),
        oscillators: parseRecommend(recommendOther),
        rawScore: recommendAll,
      },
      
      // Indikator
      indicators: {
        rsi: result['RSI'],
        rsiPrev: result['RSI[1]'],
        macd: result['MACD.macd'],
        macdSignal: result['MACD.signal'],
        momentum: result['Mom'],
        momentumPrev: result['Mom[1]'],
        bbUpper: result['BB.upper'],
        bbLower: result['BB.lower'],
        bbBasis: result['BB.basis'],
        stochK: result['Stoch.K'],
        stochD: result['Stoch.D'],
        adx: result['ADX'],
        cci: result['CCI20'],
        ao: result['AO'],
      },
      
      // Moving Averages
      movingAverages: {
        ema10: result['EMA10'],
        ema20: result['EMA20'],
        ema50: result['EMA50'],
        ema100: result['EMA100'],
        ema200: result['EMA200'],
        sma10: result['SMA10'],
        sma20: result['SMA20'],
        sma50: result['SMA50'],
        sma100: result['SMA100'],
        sma200: result['SMA200'],
      },
      
      // Harga
      price: {
        close: result['close'],
        open: result['open'],
        high: result['high'],
        low: result['low'],
        volume: result['volume'],
        change: result['change'],
      },
    };
    
  } catch (error) {
    console.error(`❌ Error TradingView ${symbol}:`, error.message);
    return null;
  }
}

// ============================================
// GENERATE LINK TRADINGVIEW
// ============================================
export function getTradingViewLink(symbol, interval = 'D') {
  return `https://www.tradingview.com/chart/?symbol=${symbol}&interval=${interval}`;
}

// ============================================
// FORMAT LAPORAN TRADINGVIEW UNTUK TELEGRAM
// ============================================
export function formatTradingViewReport(tvData, symbol) {
  if (!tvData) {
    return `📡 *TRADINGVIEW: ${symbol}*\n⚠️ Data TradingView tidak tersedia\n🔗 [Lihat Chart](${getTradingViewLink(symbol)})`;
  }
  
  const rec = tvData.recommendation;
  const ind = tvData.indicators;
  const ma = tvData.movingAverages;
  const price = tvData.price;
  
  const recEmoji = {
    'STRONG_BUY': '🟢🟢 STRONG BUY',
    'BUY': '🟢 BUY',
    'NEUTRAL': '⚪ NEUTRAL',
    'SELL': '🔴 SELL',
    'STRONG_SELL': '🔴🔴 STRONG SELL',
  };
  
  let report = `
📡 *TRADINGVIEW ANALYSIS: ${symbol}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💰 *Harga: $${price.close?.toFixed(2) || 'N/A'}* (${price.change?.toFixed(2) || 'N/A'}%)

🎯 *REKOMENDASI TRADINGVIEW*
├ Overall: ${recEmoji[rec.overall] || rec.overall}
├ Moving Averages: ${recEmoji[rec.movingAverages] || rec.movingAverages}
└ Oscillators: ${recEmoji[rec.oscillators] || rec.oscillators}

📊 *INDIKATOR TEKNIKAL*
├ RSI: ${ind.rsi?.toFixed(2) || 'N/A'}
├ MACD: ${ind.macd?.toFixed(4) || 'N/A'} | Signal: ${ind.macdSignal?.toFixed(4) || 'N/A'}
├ Stochastic K: ${ind.stochK?.toFixed(2) || 'N/A'} | D: ${ind.stochD?.toFixed(2) || 'N/A'}
├ ADX: ${ind.adx?.toFixed(2) || 'N/A'}
└ CCI: ${ind.cci?.toFixed(2) || 'N/A'}

📈 *MOVING AVERAGES*
├ EMA 20: $${ma.ema20?.toFixed(2) || 'N/A'}
├ EMA 50: $${ma.ema50?.toFixed(2) || 'N/A'}
├ EMA 200: $${ma.ema200?.toFixed(2) || 'N/A'}
├ SMA 50: $${ma.sma50?.toFixed(2) || 'N/A'}
└ SMA 200: $${ma.sma200?.toFixed(2) || 'N/A'}

🔗 [Lihat Chart TradingView](${getTradingViewLink(symbol)})
`;
  
  return report;
}

// ============================================
// WEBSOCKET TRADINGVIEW (Real-time Data)
// Untuk penggunaan lanjutan
// ============================================
export class TradingViewWebSocket {
  constructor() {
    this.sessionId = this.generateSessionId();
    this.chartSessionId = this.generateChartSessionId();
  }
  
  generateSessionId() {
    return 'qs_' + crypto.randomBytes(12).toString('hex');
  }
  
  generateChartSessionId() {
    return 'cs_' + crypto.randomBytes(12).toString('hex');
  }
  
  // Format pesan TradingView WebSocket
  formatMessage(func, args) {
    const msg = JSON.stringify({ m: func, p: args });
    return `~m~${msg.length}~m~${msg}`;
  }
  
  // Instruksi untuk penggunaan WebSocket
  getInstructions() {
    return `
📡 TRADINGVIEW WEBSOCKET INSTRUCTIONS:
1. Install: npm install ws
2. Connect to: wss://data.tradingview.com/socket.io/websocket
3. Send session messages untuk subscribe ke data real-time
4. Lihat: https://github.com/Mathieu2301/Tradingview-API untuk detail lengkap

Untuk pemula, gunakan getTradingViewRecommendation() yang lebih mudah.
    `;
  }
}
