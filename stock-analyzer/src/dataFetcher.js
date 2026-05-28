// ============================================
// DATA FETCHER - Mengambil data dari Yahoo Finance
// ============================================
// Ini menggantikan yfinance Python dengan API langsung
// Yahoo Finance menyediakan data gratis tanpa API key

import axios from 'axios';
import { config } from './config.js';

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
};

// ============================================
// FUNGSI: Ambil data harga historis
// ============================================
export async function getHistoricalData(symbol, period = '3mo', interval = '1d') {
  try {
    console.log(`📊 Mengambil data historis ${symbol}...`);
    
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    const params = {
      range: period,
      interval: interval,
      includePrePost: false,
      events: 'div,splits',
    };

    const response = await axios.get(url, { params, headers, timeout: 15000 });
    const result = response.data.chart.result[0];

    if (!result) throw new Error(`Data tidak ditemukan untuk ${symbol}`);

    const timestamps = result.timestamp;
    const quotes = result.indicators.quote[0];
    const adjClose = result.indicators.adjclose?.[0]?.adjclose || quotes.close;

    // Format data menjadi array objek
    const data = timestamps.map((ts, i) => ({
      date: new Date(ts * 1000).toISOString().split('T')[0],
      open: quotes.open[i],
      high: quotes.high[i],
      low: quotes.low[i],
      close: quotes.close[i],
      adjClose: adjClose[i],
      volume: quotes.volume[i],
    })).filter(d => d.close !== null && d.close !== undefined);

    console.log(`✅ Berhasil ambil ${data.length} data untuk ${symbol}`);
    return data;

  } catch (error) {
    console.error(`❌ Error mengambil data historis ${symbol}:`, error.message);
    return null;
  }
}

// ============================================
// FUNGSI: Ambil data fundamental (info perusahaan)
// ============================================
export async function getFundamentalData(symbol) {
  try {
    console.log(`🏢 Mengambil data fundamental ${symbol}...`);

    // Coba beberapa endpoint Yahoo Finance
    const modules = [
      'summaryDetail',
      'financialData',
      'defaultKeyStatistics',
      'assetProfile',
      'recommendationTrend',
    ].join(',');

    // Coba v11 dulu, lalu v10, lalu v8
    const endpoints = [
      `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}`,
      `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}`,
      `https://query2.finance.yahoo.com/v11/finance/quoteSummary/${symbol}`,
    ];

    let response = null;
    for (const url of endpoints) {
      try {
        response = await axios.get(url, {
          params: { modules, crumb: '' },
          headers: {
            ...headers,
            'Cookie': 'YahooFinanceConsent=true',
          },
          timeout: 15000,
        });
        if (response.data?.quoteSummary?.result) break;
      } catch (e) {
        // Coba endpoint berikutnya
      }
    }

    // Jika semua endpoint gagal, gunakan data dari chart API
    if (!response?.data?.quoteSummary?.result) {
      return await getFundamentalFromChart(symbol);
    }

    const result = response.data.quoteSummary.result[0];
    if (!result) return await getFundamentalFromChart(symbol);

    const summary = result.summaryDetail || {};
    const financial = result.financialData || {};
    const keyStats = result.defaultKeyStatistics || {};
    const profile = result.assetProfile || {};
    const recommendation = result.recommendationTrend?.trend?.[0] || {};

    return {
      // Informasi Perusahaan
      company: {
        name: profile.longName || symbol,
        sector: profile.sector || 'N/A',
        industry: profile.industry || 'N/A',
        country: profile.country || 'US',
        employees: profile.fullTimeEmployees || 0,
        description: profile.longBusinessSummary || '',
        website: profile.website || '',
      },

      // Valuasi
      valuation: {
        marketCap: summary.marketCap?.raw || 0,
        enterpriseValue: keyStats.enterpriseValue?.raw || 0,
        peRatio: summary.trailingPE?.raw || null,
        forwardPE: summary.forwardPE?.raw || null,
        pegRatio: keyStats.pegRatio?.raw || null,
        priceToBook: keyStats.priceToBook?.raw || null,
        priceToSales: keyStats.priceToSalesTrailing12Months?.raw || null,
        evToEbitda: keyStats.enterpriseToEbitda?.raw || null,
      },

      // Profitabilitas
      profitability: {
        grossMargin: financial.grossMargins?.raw || null,
        operatingMargin: financial.operatingMargins?.raw || null,
        profitMargin: financial.profitMargins?.raw || null,
        returnOnEquity: financial.returnOnEquity?.raw || null,
        returnOnAssets: financial.returnOnAssets?.raw || null,
        ebitda: financial.ebitda?.raw || null,
      },

      // Pertumbuhan
      growth: {
        revenueGrowth: financial.revenueGrowth?.raw || null,
        earningsGrowth: financial.earningsGrowth?.raw || null,
        earningsQuarterlyGrowth: keyStats.earningsQuarterlyGrowth?.raw || null,
      },

      // Kesehatan Keuangan
      financial: {
        totalCash: financial.totalCash?.raw || 0,
        totalDebt: financial.totalDebt?.raw || 0,
        debtToEquity: financial.debtToEquity?.raw || null,
        currentRatio: financial.currentRatio?.raw || null,
        quickRatio: financial.quickRatio?.raw || null,
        freeCashflow: financial.freeCashflow?.raw || null,
        operatingCashflow: financial.operatingCashflow?.raw || null,
      },

      // Dividen
      dividend: {
        dividendRate: summary.dividendRate?.raw || 0,
        dividendYield: summary.dividendYield?.raw || 0,
        payoutRatio: summary.payoutRatio?.raw || null,
        exDividendDate: summary.exDividendDate?.fmt || null,
      },

      // EPS
      eps: {
        trailingEps: keyStats.trailingEps?.raw || null,
        forwardEps: keyStats.forwardEps?.raw || null,
        epsGrowth: keyStats.earningsQuarterlyGrowth?.raw || null,
      },

      // Rekomendasi Analis
      analystRecommendation: {
        strongBuy: recommendation.strongBuy || 0,
        buy: recommendation.buy || 0,
        hold: recommendation.hold || 0,
        sell: recommendation.sell || 0,
        strongSell: recommendation.strongSell || 0,
        targetMeanPrice: financial.targetMeanPrice?.raw || null,
        targetHighPrice: financial.targetHighPrice?.raw || null,
        targetLowPrice: financial.targetLowPrice?.raw || null,
        recommendationKey: financial.recommendationKey || 'none',
      },

      // Harga saat ini
      currentPrice: financial.currentPrice?.raw || null,
      fiftyTwoWeekHigh: summary.fiftyTwoWeekHigh?.raw || null,
      fiftyTwoWeekLow: summary.fiftyTwoWeekLow?.raw || null,
      beta: summary.beta?.raw || null,
    };

  } catch (error) {
    console.error(`❌ Error mengambil data fundamental ${symbol}:`, error.message);
    return null;
  }
}

// ============================================
// FUNGSI FALLBACK: Ambil data fundamental dari chart API
// ============================================
async function getFundamentalFromChart(symbol) {
  try {
    console.log(`🔄 Menggunakan fallback data untuk ${symbol}...`);
    
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    const response = await axios.get(url, {
      params: { range: '1d', interval: '1d', includePrePost: false },
      headers,
      timeout: 10000,
    });
    
    const meta = response.data.chart.result[0].meta;
    
    // Data minimal dari chart API
    return {
      company: {
        name: meta.longName || meta.shortName || symbol,
        sector: 'N/A',
        industry: 'N/A',
        country: 'US',
        employees: 0,
        description: '',
        website: '',
      },
      valuation: {
        marketCap: meta.marketCap || 0,
        enterpriseValue: 0,
        peRatio: null,
        forwardPE: null,
        pegRatio: null,
        priceToBook: null,
        priceToSales: null,
        evToEbitda: null,
      },
      profitability: {
        grossMargin: null,
        operatingMargin: null,
        profitMargin: null,
        returnOnEquity: null,
        returnOnAssets: null,
        ebitda: null,
      },
      growth: {
        revenueGrowth: null,
        earningsGrowth: null,
        earningsQuarterlyGrowth: null,
      },
      financial: {
        totalCash: 0,
        totalDebt: 0,
        debtToEquity: null,
        currentRatio: null,
        quickRatio: null,
        freeCashflow: null,
        operatingCashflow: null,
      },
      dividend: {
        dividendRate: 0,
        dividendYield: 0,
        payoutRatio: null,
        exDividendDate: null,
      },
      eps: {
        trailingEps: null,
        forwardEps: null,
        epsGrowth: null,
      },
      analystRecommendation: {
        strongBuy: 0, buy: 0, hold: 0, sell: 0, strongSell: 0,
        targetMeanPrice: null,
        targetHighPrice: null,
        targetLowPrice: null,
        recommendationKey: 'none',
      },
      currentPrice: meta.regularMarketPrice,
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow,
      beta: null,
      _fallback: true,
    };
  } catch (error) {
    console.error(`❌ Fallback fundamental gagal untuk ${symbol}:`, error.message);
    return null;
  }
}

// ============================================
// FUNGSI: Ambil harga real-time
// ============================================
export async function getRealTimePrice(symbol) {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`;
    const response = await axios.get(url, {
      params: { range: '1d', interval: '1m' },
      headers,
      timeout: 10000,
    });

    const result = response.data.chart.result[0];
    const meta = result.meta;

    return {
      symbol: symbol,
      price: meta.regularMarketPrice,
      previousClose: meta.previousClose || meta.chartPreviousClose,
      change: meta.regularMarketPrice - (meta.previousClose || meta.chartPreviousClose),
      changePercent: ((meta.regularMarketPrice - (meta.previousClose || meta.chartPreviousClose)) / (meta.previousClose || meta.chartPreviousClose)) * 100,
      volume: meta.regularMarketVolume,
      marketState: meta.marketState,
      currency: meta.currency,
      exchangeName: meta.exchangeName,
      timestamp: new Date(meta.regularMarketTime * 1000).toISOString(),
    };

  } catch (error) {
    console.error(`❌ Error mengambil harga real-time ${symbol}:`, error.message);
    return null;
  }
}

// ============================================
// FUNGSI: Ambil berita terbaru
// ============================================
export async function getNewsData(symbol) {
  try {
    console.log(`📰 Mengambil berita ${symbol}...`);
    
    const url = `https://query1.finance.yahoo.com/v1/finance/search`;
    const response = await axios.get(url, {
      params: {
        q: symbol,
        newsCount: 10,
        quotesCount: 0,
      },
      headers,
      timeout: 10000,
    });

    const news = response.data.news || [];
    return news.map(item => ({
      title: item.title,
      publisher: item.publisher,
      link: item.link,
      publishedAt: new Date(item.providerPublishTime * 1000).toISOString(),
      type: item.type,
    }));

  } catch (error) {
    console.error(`❌ Error mengambil berita ${symbol}:`, error.message);
    return [];
  }
}

// ============================================
// FUNGSI: Format angka besar (1B, 1M, dll)
// ============================================
export function formatLargeNumber(num) {
  if (!num || isNaN(num)) return 'N/A';
  if (Math.abs(num) >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (Math.abs(num) >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (Math.abs(num) >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (Math.abs(num) >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

export function formatPercent(num) {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  return `${(num * 100).toFixed(2)}%`;
}

export function formatNumber(num, decimals = 2) {
  if (num === null || num === undefined || isNaN(num)) return 'N/A';
  return num.toFixed(decimals);
}
