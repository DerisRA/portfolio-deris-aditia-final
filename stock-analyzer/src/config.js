// ============================================
// KONFIGURASI UTAMA SISTEM ANALISA SAHAM
// ============================================
import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // Telegram
  telegram: {
    token: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
  },

  // Watchlist default
  watchlist: (process.env.DEFAULT_WATCHLIST || 'AAPL,MSFT,GOOGL,NVDA,TSLA')
    .split(',')
    .map(s => s.trim()),

  // Portfolio
  portfolio: {
    size: parseFloat(process.env.PORTFOLIO_SIZE || '10000'),
    maxRiskPerTrade: parseFloat(process.env.MAX_RISK_PER_TRADE || '2'),
  },

  // RSI thresholds
  rsi: {
    oversold: parseFloat(process.env.RSI_OVERSOLD || '30'),
    overbought: parseFloat(process.env.RSI_OVERBOUGHT || '70'),
  },

  // Alert
  minAlertScore: parseFloat(process.env.MIN_ALERT_SCORE || '60'),

  // TradingView
  tradingview: {
    username: process.env.TRADINGVIEW_USERNAME || '',
    password: process.env.TRADINGVIEW_PASSWORD || '',
  },

  // Yahoo Finance API base URL
  yahooFinanceBase: 'https://query1.finance.yahoo.com/v8/finance',
  yahooFinanceV10: 'https://query1.finance.yahoo.com/v10/finance',
  yahooFinanceV11: 'https://query1.finance.yahoo.com/v11/finance',

  // Periode data historis
  periods: {
    short: '1mo',   // 1 bulan
    medium: '3mo',  // 3 bulan
    long: '1y',     // 1 tahun
    veryLong: '5y', // 5 tahun
  },

  // Interval data
  intervals: {
    daily: '1d',
    weekly: '1wk',
    monthly: '1mo',
  },
};

export default config;
