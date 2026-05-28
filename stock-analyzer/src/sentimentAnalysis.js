// ============================================
// ANALISA SENTIMEN
// ============================================
// Menganalisa sentimen pasar dari:
// 1. Berita terbaru
// 2. Fear & Greed Index
// 3. Analisa kata kunci berita

import axios from 'axios';

// ============================================
// KATA KUNCI SENTIMEN
// ============================================
const POSITIVE_KEYWORDS = [
  'beat', 'beats', 'exceeded', 'surpassed', 'record', 'growth', 'profit',
  'revenue', 'upgrade', 'buy', 'bullish', 'rally', 'surge', 'soar', 'jump',
  'gain', 'rise', 'strong', 'positive', 'outperform', 'breakthrough',
  'innovation', 'partnership', 'acquisition', 'dividend', 'buyback',
  'expansion', 'launch', 'approval', 'win', 'success', 'milestone',
  'naik', 'untung', 'positif', 'bagus', 'kuat', 'meningkat',
];

const NEGATIVE_KEYWORDS = [
  'miss', 'missed', 'below', 'disappointing', 'loss', 'decline', 'fall',
  'drop', 'plunge', 'crash', 'sell', 'bearish', 'downgrade', 'cut',
  'layoff', 'lawsuit', 'investigation', 'fraud', 'recall', 'warning',
  'risk', 'concern', 'weak', 'negative', 'underperform', 'debt',
  'bankruptcy', 'default', 'fine', 'penalty', 'scandal', 'hack',
  'turun', 'rugi', 'negatif', 'buruk', 'lemah', 'menurun',
];

const STRONG_POSITIVE = [
  'record high', 'all-time high', 'blowout', 'massive beat', 'explosive growth',
  'strong buy', 'price target raised', 'analyst upgrade',
];

const STRONG_NEGATIVE = [
  'bankruptcy', 'fraud', 'sec investigation', 'massive layoffs', 'guidance cut',
  'earnings miss', 'revenue miss', 'analyst downgrade', 'price target cut',
];

// ============================================
// ANALISA SENTIMEN BERITA
// ============================================
export function analyzeNewsSentiment(newsItems) {
  if (!newsItems || newsItems.length === 0) {
    return {
      score: 50,
      sentiment: 'NEUTRAL',
      newsCount: 0,
      positiveCount: 0,
      negativeCount: 0,
      neutralCount: 0,
      topNews: [],
      interpretation: 'Tidak ada berita terbaru',
    };
  }
  
  let totalScore = 0;
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  const analyzedNews = [];
  
  for (const news of newsItems) {
    const text = (news.title + ' ' + (news.summary || '')).toLowerCase();
    
    let newsScore = 0;
    let positiveHits = 0;
    let negativeHits = 0;
    
    // Cek kata kunci positif
    for (const keyword of POSITIVE_KEYWORDS) {
      if (text.includes(keyword)) {
        newsScore += 1;
        positiveHits++;
      }
    }
    
    // Cek kata kunci negatif
    for (const keyword of NEGATIVE_KEYWORDS) {
      if (text.includes(keyword)) {
        newsScore -= 1;
        negativeHits++;
      }
    }
    
    // Cek kata kunci kuat
    for (const keyword of STRONG_POSITIVE) {
      if (text.includes(keyword)) newsScore += 3;
    }
    for (const keyword of STRONG_NEGATIVE) {
      if (text.includes(keyword)) newsScore -= 3;
    }
    
    // Tentukan sentimen berita
    let newsSentiment = 'NEUTRAL';
    if (newsScore > 1) { newsSentiment = 'POSITIVE'; positiveCount++; }
    else if (newsScore < -1) { newsSentiment = 'NEGATIVE'; negativeCount++; }
    else { neutralCount++; }
    
    totalScore += newsScore;
    
    analyzedNews.push({
      title: news.title,
      publisher: news.publisher,
      publishedAt: news.publishedAt,
      sentiment: newsSentiment,
      score: newsScore,
      link: news.link,
    });
  }
  
  // Normalize score ke 0-100
  const maxPossibleScore = newsItems.length * 5;
  const normalizedScore = Math.max(0, Math.min(100, 
    50 + (totalScore / maxPossibleScore) * 50
  ));
  
  let sentiment = 'NEUTRAL';
  if (normalizedScore >= 65) sentiment = 'POSITIVE';
  else if (normalizedScore >= 55) sentiment = 'SLIGHTLY_POSITIVE';
  else if (normalizedScore <= 35) sentiment = 'NEGATIVE';
  else if (normalizedScore <= 45) sentiment = 'SLIGHTLY_NEGATIVE';
  
  // Sort by score untuk tampilkan yang paling relevan
  analyzedNews.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
  
  return {
    score: Math.round(normalizedScore),
    sentiment,
    newsCount: newsItems.length,
    positiveCount,
    negativeCount,
    neutralCount,
    topNews: analyzedNews.slice(0, 5),
    allNews: analyzedNews,
    interpretation: getSentimentInterpretation(sentiment, normalizedScore),
  };
}

function getSentimentInterpretation(sentiment, score) {
  switch (sentiment) {
    case 'POSITIVE': return `🟢 Sentimen positif (${score}/100) - Berita mendukung kenaikan`;
    case 'SLIGHTLY_POSITIVE': return `🟡 Sentimen sedikit positif (${score}/100)`;
    case 'NEUTRAL': return `⚪ Sentimen netral (${score}/100) - Tidak ada arah jelas`;
    case 'SLIGHTLY_NEGATIVE': return `🟠 Sentimen sedikit negatif (${score}/100)`;
    case 'NEGATIVE': return `🔴 Sentimen negatif (${score}/100) - Berita mendukung penurunan`;
    default: return `Sentimen: ${score}/100`;
  }
}

// ============================================
// FEAR & GREED INDEX (CNN Money)
// ============================================
export async function getFearGreedIndex() {
  try {
    // CNN Fear & Greed Index API
    const response = await axios.get(
      'https://production.dataviz.cnn.io/index/fearandgreed/graphdata',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://www.cnn.com/markets/fear-and-greed',
        },
        timeout: 10000,
      }
    );
    
    const data = response.data;
    const current = data.fear_and_greed;
    
    return {
      score: current.score,
      rating: current.rating,
      timestamp: current.timestamp,
      previousClose: data.fear_and_greed_historical?.previous_close?.score,
      oneWeekAgo: data.fear_and_greed_historical?.one_week_ago?.score,
      oneMonthAgo: data.fear_and_greed_historical?.one_month_ago?.score,
      interpretation: getFearGreedInterpretation(current.score, current.rating),
    };
    
  } catch (error) {
    // Fallback: estimasi dari VIX atau data lain
    console.log('⚠️ Tidak bisa ambil Fear & Greed Index, menggunakan estimasi...');
    return {
      score: 50,
      rating: 'Neutral',
      timestamp: new Date().toISOString(),
      interpretation: '⚪ Fear & Greed: Data tidak tersedia (estimasi Neutral)',
      error: true,
    };
  }
}

function getFearGreedInterpretation(score, rating) {
  if (score <= 25) return `😱 EXTREME FEAR (${score}) - Pasar sangat takut, potensi beli!`;
  if (score <= 45) return `😨 FEAR (${score}) - Pasar takut, hati-hati`;
  if (score <= 55) return `😐 NEUTRAL (${score}) - Pasar seimbang`;
  if (score <= 75) return `😊 GREED (${score}) - Pasar serakah, mulai hati-hati`;
  return `🤑 EXTREME GREED (${score}) - Pasar sangat serakah, risiko tinggi!`;
}

// ============================================
// MARKET BREADTH (Kondisi Pasar Keseluruhan)
// ============================================
export async function getMarketBreadth() {
  try {
    // Ambil data SPY (S&P 500 ETF) sebagai proxy market
    const response = await axios.get(
      'https://query1.finance.yahoo.com/v8/finance/chart/SPY',
      {
        params: { range: '5d', interval: '1d' },
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 10000,
      }
    );
    
    const result = response.data.chart.result[0];
    const closes = result.indicators.quote[0].close;
    const volumes = result.indicators.quote[0].volume;
    
    const currentClose = closes[closes.length - 1];
    const prevClose = closes[closes.length - 2];
    const change = ((currentClose - prevClose) / prevClose) * 100;
    
    // Ambil juga VIX (volatility index)
    let vixData = null;
    try {
      const vixResponse = await axios.get(
        'https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX',
        {
          params: { range: '5d', interval: '1d' },
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 10000,
        }
      );
      const vixResult = vixResponse.data.chart.result[0];
      const vixCloses = vixResult.indicators.quote[0].close;
      vixData = {
        current: vixCloses[vixCloses.length - 1],
        previous: vixCloses[vixCloses.length - 2],
      };
    } catch (e) {
      // VIX tidak tersedia
    }
    
    const marketTrend = change > 0.5 ? 'BULLISH' : change < -0.5 ? 'BEARISH' : 'NEUTRAL';
    
    return {
      spy: {
        price: currentClose,
        change: change.toFixed(2),
        trend: marketTrend,
      },
      vix: vixData ? {
        current: vixData.current?.toFixed(2),
        previous: vixData.previous?.toFixed(2),
        trend: vixData.current < vixData.previous ? 'DECREASING' : 'INCREASING',
        level: vixData.current < 15 ? 'LOW' : vixData.current < 25 ? 'NORMAL' : vixData.current < 35 ? 'HIGH' : 'EXTREME',
      } : null,
      interpretation: getMarketInterpretation(marketTrend, vixData),
    };
    
  } catch (error) {
    console.error('❌ Error mengambil market breadth:', error.message);
    return null;
  }
}

function getMarketInterpretation(trend, vix) {
  let msg = '';
  if (trend === 'BULLISH') msg = '📈 Market S&P500 sedang naik';
  else if (trend === 'BEARISH') msg = '📉 Market S&P500 sedang turun';
  else msg = '➡️ Market S&P500 sideways';
  
  if (vix) {
    if (vix.current > 30) msg += ' | ⚠️ VIX tinggi - Volatilitas ekstrem!';
    else if (vix.current > 20) msg += ' | 🟡 VIX normal-tinggi';
    else msg += ' | 🟢 VIX rendah - Pasar tenang';
  }
  
  return msg;
}

// ============================================
// FUNGSI UTAMA: Jalankan semua analisa sentimen
// ============================================
export async function runSentimentAnalysis(symbol, newsData) {
  console.log(`🧠 Menganalisa sentimen ${symbol}...`);
  
  const [newsSentiment, fearGreed, marketBreadth] = await Promise.allSettled([
    Promise.resolve(analyzeNewsSentiment(newsData)),
    getFearGreedIndex(),
    getMarketBreadth(),
  ]);
  
  const news = newsSentiment.status === 'fulfilled' ? newsSentiment.value : null;
  const fg = fearGreed.status === 'fulfilled' ? fearGreed.value : null;
  const market = marketBreadth.status === 'fulfilled' ? marketBreadth.value : null;
  
  // Hitung skor sentimen keseluruhan
  let totalScore = 50;
  let weights = 0;
  
  if (news) { totalScore += (news.score - 50) * 0.5; weights += 0.5; }
  if (fg && !fg.error) { totalScore += (fg.score - 50) * 0.3; weights += 0.3; }
  if (market) {
    const marketScore = market.spy.trend === 'BULLISH' ? 65 : market.spy.trend === 'BEARISH' ? 35 : 50;
    totalScore += (marketScore - 50) * 0.2;
    weights += 0.2;
  }
  
  totalScore = Math.max(0, Math.min(100, totalScore));
  
  let overallSentiment = 'NEUTRAL';
  if (totalScore >= 65) overallSentiment = 'POSITIVE';
  else if (totalScore >= 55) overallSentiment = 'SLIGHTLY_POSITIVE';
  else if (totalScore <= 35) overallSentiment = 'NEGATIVE';
  else if (totalScore <= 45) overallSentiment = 'SLIGHTLY_NEGATIVE';
  
  return {
    symbol,
    overallScore: Math.round(totalScore),
    overallSentiment,
    news,
    fearGreed: fg,
    marketBreadth: market,
    interpretation: getSentimentInterpretation(overallSentiment, Math.round(totalScore)),
  };
}

// ============================================
// FORMAT LAPORAN SENTIMEN UNTUK TELEGRAM
// ============================================
export function formatSentimentReport(sentiment) {
  if (!sentiment) return '❌ Data sentimen tidak tersedia';
  
  let report = `
🧠 *ANALISA SENTIMEN: ${sentiment.symbol}*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 *Skor Sentimen: ${sentiment.overallScore}/100*
${sentiment.interpretation}
`;
  
  // Fear & Greed
  if (sentiment.fearGreed && !sentiment.fearGreed.error) {
    const fg = sentiment.fearGreed;
    report += `
😱 *FEAR & GREED INDEX*
├ Skor: ${fg.score?.toFixed(0) || 'N/A'} - ${fg.rating || 'N/A'}
├ Seminggu lalu: ${fg.oneWeekAgo?.toFixed(0) || 'N/A'}
└ ${fg.interpretation}
`;
  }
  
  // Market Breadth
  if (sentiment.marketBreadth) {
    const mb = sentiment.marketBreadth;
    report += `
📈 *KONDISI PASAR (S&P500)*
├ SPY: $${mb.spy.price?.toFixed(2)} (${mb.spy.change}%)
`;
    if (mb.vix) {
      report += `├ VIX: ${mb.vix.current} (${mb.vix.level})
`;
    }
    report += `└ ${mb.interpretation}
`;
  }
  
  // Berita
  if (sentiment.news && sentiment.news.newsCount > 0) {
    const news = sentiment.news;
    report += `
📰 *ANALISA BERITA (${news.newsCount} berita)*
├ Positif: ${news.positiveCount} | Negatif: ${news.negativeCount} | Netral: ${news.neutralCount}
└ ${news.interpretation}

📋 *BERITA TERBARU:*
`;
    
    for (const item of news.topNews.slice(0, 3)) {
      const emoji = item.sentiment === 'POSITIVE' ? '🟢' : 
                   item.sentiment === 'NEGATIVE' ? '🔴' : '⚪';
      const date = new Date(item.publishedAt).toLocaleDateString('id-ID');
      report += `${emoji} ${item.title.substring(0, 80)}...
   📅 ${date} | ${item.publisher}

`;
    }
  }
  
  return report;
}
