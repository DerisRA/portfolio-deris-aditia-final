// ============================================
// MAIN ENTRY POINT - SISTEM ANALISA SAHAM US
// ============================================
// Cara menjalankan:
//   node src/index.js          → Analisa watchlist default
//   node src/index.js AAPL     → Analisa satu saham
//   node src/index.js AAPL MSFT GOOGL → Analisa beberapa saham

import { config } from './config.js';
import { getHistoricalData, getFundamentalData, getRealTimePrice, getNewsData } from './dataFetcher.js';
import { runTechnicalAnalysis } from './technicalAnalysis.js';
import { runFundamentalAnalysis } from './fundamentalAnalysis.js';
import { runSentimentAnalysis } from './sentimentAnalysis.js';
import { runRiskAnalysis } from './riskManagement.js';
import { getTradingViewRecommendation } from './tradingviewConnector.js';
import { generateAllReports } from './reportGenerator.js';
import { sendFullReport, sendWatchlistSummary, checkBotStatus, sendWelcomeMessage } from './telegramSender.js';

// ============================================
// FUNGSI UTAMA: ANALISA SATU SAHAM
// ============================================
async function analyzeStock(symbol) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🔍 MEMULAI ANALISA: ${symbol.toUpperCase()}`);
  console.log(`${'='.repeat(60)}\n`);
  
  const startTime = Date.now();
  symbol = symbol.toUpperCase();
  
  try {
    // ============================================
    // STEP 1: Ambil semua data secara paralel
    // ============================================
    console.log('📡 Mengambil data...\n');
    
    const [
      historicalData1Y,   // Data 1 tahun untuk MA200
      historicalData3M,   // Data 3 bulan untuk analisa utama
      fundamentalData,
      realTimePrice,
      newsData,
    ] = await Promise.allSettled([
      getHistoricalData(symbol, '1y', '1d'),
      getHistoricalData(symbol, '3mo', '1d'),
      getFundamentalData(symbol),
      getRealTimePrice(symbol),
      getNewsData(symbol),
    ]);
    
    // Extract values
    const historical1Y = historicalData1Y.status === 'fulfilled' ? historicalData1Y.value : null;
    const historical3M = historicalData3M.status === 'fulfilled' ? historicalData3M.value : null;
    const fundamental = fundamentalData.status === 'fulfilled' ? fundamentalData.value : null;
    const realTime = realTimePrice.status === 'fulfilled' ? realTimePrice.value : null;
    const news = newsData.status === 'fulfilled' ? newsData.value : [];
    
    // Gunakan data 1 tahun jika tersedia, jika tidak gunakan 3 bulan
    const historicalData = historical1Y || historical3M;
    
    if (!historicalData || historicalData.length === 0) {
      console.error(`❌ Tidak bisa mendapatkan data untuk ${symbol}`);
      console.error('Pastikan simbol saham benar (contoh: AAPL, MSFT, GOOGL)');
      return null;
    }
    
    const currentPrice = realTime?.price || historicalData[historicalData.length - 1]?.close;
    console.log(`💰 Harga saat ini: $${currentPrice?.toFixed(2)}\n`);
    
    // ============================================
    // STEP 2: Jalankan semua analisa
    // ============================================
    console.log('🔬 Menjalankan analisa...\n');
    
    // Analisa Teknikal
    console.log('📊 Analisa Teknikal...');
    const technicalAnalysis = runTechnicalAnalysis(historicalData);
    
    // Analisa Fundamental
    console.log('🏢 Analisa Fundamental...');
    const fundamentalAnalysis = fundamental ? runFundamentalAnalysis(fundamental) : null;
    
    // Analisa Sentimen (async)
    console.log('🧠 Analisa Sentimen...');
    const sentimentAnalysis = await runSentimentAnalysis(symbol, news);
    
    // TradingView
    console.log('📡 Mengambil data TradingView...');
    const tvData = await getTradingViewRecommendation(symbol);
    
    // Manajemen Risiko
    console.log('🛡️ Kalkulasi Manajemen Risiko...');
    const riskAnalysis = runRiskAnalysis(
      symbol,
      currentPrice,
      technicalAnalysis,
      fundamentalAnalysis,
      sentimentAnalysis
    );
    
    // ============================================
    // STEP 3: Generate laporan
    // ============================================
    console.log('\n📝 Membuat laporan...');
    const reports = generateAllReports(
      symbol,
      realTime,
      technicalAnalysis,
      fundamentalAnalysis,
      sentimentAnalysis,
      riskAnalysis,
      tvData
    );
    
    // ============================================
    // STEP 4: Tampilkan di console
    // ============================================
    console.log('\n' + '='.repeat(60));
    console.log('📋 RINGKASAN ANALISA:');
    console.log('='.repeat(60));
    console.log(`Symbol: ${symbol}`);
    console.log(`Harga: $${currentPrice?.toFixed(2)}`);
    console.log(`Skor Teknikal: ${technicalAnalysis?.score}/100 → ${technicalAnalysis?.recommendation}`);
    console.log(`Skor Fundamental: ${fundamentalAnalysis?.totalScore}/100 → ${fundamentalAnalysis?.recommendation}`);
    console.log(`Skor Sentimen: ${sentimentAnalysis?.overallScore}/100 → ${sentimentAnalysis?.overallSentiment}`);
    console.log(`Level Risiko: ${riskAnalysis?.riskAnalysis?.level}`);
    console.log(`\n🎯 REKOMENDASI AKHIR: ${riskAnalysis?.finalRecommendation}`);
    console.log(`\n🛑 Stop Loss: $${riskAnalysis?.stopLoss?.recommended?.price?.toFixed(2)}`);
    console.log(`🎯 Target 1: $${riskAnalysis?.takeProfit?.levels?.rr2?.price?.toFixed(2)}`);
    console.log(`🎯 Target 2: $${riskAnalysis?.takeProfit?.levels?.rr3?.price?.toFixed(2)}`);
    console.log('='.repeat(60));
    
    // ============================================
    // STEP 5: Kirim ke Telegram
    // ============================================
    console.log('\n📤 Mengirim ke Telegram...');
    await sendFullReport(symbol, reports);
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n✅ Analisa ${symbol} selesai dalam ${elapsed} detik`);
    
    return {
      symbol,
      price: currentPrice,
      changePercent: realTime?.changePercent,
      score: riskAnalysis?.scores?.average,
      recommendation: riskAnalysis?.finalRecommendation,
    };
    
  } catch (error) {
    console.error(`\n❌ Error analisa ${symbol}:`, error.message);
    if (error.stack) console.error(error.stack);
    return null;
  }
}

// ============================================
// ANALISA BEBERAPA SAHAM (WATCHLIST)
// ============================================
async function analyzeWatchlist(symbols) {
  console.log(`\n🚀 MEMULAI ANALISA WATCHLIST`);
  console.log(`📋 Saham: ${symbols.join(', ')}`);
  console.log(`⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB\n`);
  
  const results = [];
  
  for (const symbol of symbols) {
    const result = await analyzeStock(symbol);
    if (result) results.push(result);
    
    // Delay antar saham untuk menghindari rate limit
    if (symbols.indexOf(symbol) < symbols.length - 1) {
      console.log('\n⏳ Menunggu 3 detik sebelum analisa berikutnya...\n');
      await sleep(3000);
    }
  }
  
  // Kirim ringkasan watchlist
  if (results.length > 1) {
    console.log('\n📊 Mengirim ringkasan watchlist...');
    await sendWatchlistSummary(results);
  }
  
  // Tampilkan ringkasan di console
  console.log('\n' + '='.repeat(60));
  console.log('📊 RINGKASAN WATCHLIST:');
  console.log('='.repeat(60));
  
  // Sort by score
  results.sort((a, b) => (b.score || 0) - (a.score || 0));
  
  for (const result of results) {
    const recEmoji = {
      'STRONG BUY': '🟢🟢',
      'BUY': '🟢',
      'HOLD': '⚪',
      'WAIT': '🟡',
      'SELL': '🔴',
      'STRONG SELL': '🔴🔴',
    }[result.recommendation] || '⚪';
    
    console.log(`${recEmoji} ${result.symbol.padEnd(6)} $${result.price?.toFixed(2).padStart(8)} | Skor: ${result.score}/100 | ${result.recommendation}`);
  }
  
  console.log('='.repeat(60));
  console.log('\n✅ Analisa watchlist selesai!');
  
  return results;
}

// ============================================
// HELPER
// ============================================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// MAIN FUNCTION
// ============================================
async function main() {
  console.log('\n' + '🚀'.repeat(30));
  console.log('  SISTEM ANALISA SAHAM US');
  console.log('  Teknikal | Fundamental | Sentimen | Risiko');
  console.log('🚀'.repeat(30) + '\n');
  
  // Cek status Telegram bot
  console.log('🤖 Mengecek status Telegram bot...');
  const botStatus = await checkBotStatus();
  if (botStatus.ok) {
    console.log(`✅ Bot aktif: @${botStatus.bot.username}`);
  } else {
    console.log(`⚠️ Bot Telegram: ${botStatus.error}`);
    console.log('   Laporan akan disimpan secara lokal\n');
  }
  
  // Ambil simbol dari command line arguments
  const args = process.argv.slice(2);
  
  let symbols;
  if (args.length > 0) {
    // Gunakan simbol dari command line
    symbols = args.map(s => s.toUpperCase());
  } else {
    // Gunakan watchlist default dari config
    symbols = config.watchlist;
    console.log(`📋 Menggunakan watchlist default: ${symbols.join(', ')}\n`);
  }
  
  // Validasi simbol
  const validSymbols = symbols.filter(s => /^[A-Z]{1,5}$/.test(s));
  const invalidSymbols = symbols.filter(s => !/^[A-Z]{1,5}$/.test(s));
  
  if (invalidSymbols.length > 0) {
    console.log(`⚠️ Simbol tidak valid (diabaikan): ${invalidSymbols.join(', ')}`);
  }
  
  if (validSymbols.length === 0) {
    console.error('❌ Tidak ada simbol saham yang valid!');
    console.error('Contoh penggunaan: node src/index.js AAPL MSFT GOOGL');
    process.exit(1);
  }
  
  // Jalankan analisa
  if (validSymbols.length === 1) {
    await analyzeStock(validSymbols[0]);
  } else {
    await analyzeWatchlist(validSymbols);
  }
}

// Jalankan program
main().catch(error => {
  console.error('\n❌ Error fatal:', error.message);
  process.exit(1);
});
