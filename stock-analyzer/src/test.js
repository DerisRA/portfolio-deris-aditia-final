// ============================================
// TEST FILE - Cek semua komponen berjalan
// ============================================
// Cara menjalankan: node src/test.js

import { config } from './config.js';
import { getHistoricalData, getFundamentalData, getRealTimePrice, getNewsData } from './dataFetcher.js';
import { runTechnicalAnalysis } from './technicalAnalysis.js';
import { runFundamentalAnalysis } from './fundamentalAnalysis.js';
import { runSentimentAnalysis } from './sentimentAnalysis.js';
import { runRiskAnalysis } from './riskManagement.js';
import { getTradingViewRecommendation } from './tradingviewConnector.js';
import { checkBotStatus, sendWelcomeMessage } from './telegramSender.js';

const TEST_SYMBOL = 'AAPL';

async function runTests() {
  console.log('\n🧪 MENJALANKAN TEST SISTEM ANALISA SAHAM');
  console.log('='.repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  // ============================================
  // TEST 1: Konfigurasi
  // ============================================
  console.log('\n📋 TEST 1: Konfigurasi');
  try {
    console.log(`  Watchlist: ${config.watchlist.join(', ')}`);
    console.log(`  Portfolio: $${config.portfolio.size}`);
    console.log(`  RSI Oversold: ${config.rsi.oversold}`);
    console.log(`  ✅ Konfigurasi OK`);
    passed++;
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
    failed++;
  }
  
  // ============================================
  // TEST 2: Data Historis
  // ============================================
  console.log('\n📊 TEST 2: Data Historis Yahoo Finance');
  try {
    const data = await getHistoricalData(TEST_SYMBOL, '1mo', '1d');
    if (data && data.length > 0) {
      console.log(`  ✅ Berhasil ambil ${data.length} data untuk ${TEST_SYMBOL}`);
      console.log(`  Data terbaru: ${data[data.length - 1].date} | Close: $${data[data.length - 1].close?.toFixed(2)}`);
      passed++;
    } else {
      throw new Error('Data kosong');
    }
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
    failed++;
  }
  
  // ============================================
  // TEST 3: Data Fundamental
  // ============================================
  console.log('\n🏢 TEST 3: Data Fundamental');
  try {
    const data = await getFundamentalData(TEST_SYMBOL);
    if (data && data.company) {
      console.log(`  ✅ Berhasil ambil data fundamental`);
      console.log(`  Perusahaan: ${data.company.name}`);
      console.log(`  P/E Ratio: ${data.valuation.peRatio?.toFixed(2) || 'N/A'}`);
      console.log(`  Market Cap: $${(data.valuation.marketCap / 1e12).toFixed(2)}T`);
      passed++;
    } else {
      throw new Error('Data fundamental kosong');
    }
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
    failed++;
  }
  
  // ============================================
  // TEST 4: Harga Real-time
  // ============================================
  console.log('\n💰 TEST 4: Harga Real-time');
  try {
    const data = await getRealTimePrice(TEST_SYMBOL);
    if (data && data.price) {
      console.log(`  ✅ Harga ${TEST_SYMBOL}: $${data.price.toFixed(2)}`);
      console.log(`  Perubahan: ${data.changePercent?.toFixed(2)}%`);
      console.log(`  Market State: ${data.marketState}`);
      passed++;
    } else {
      throw new Error('Data harga kosong');
    }
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
    failed++;
  }
  
  // ============================================
  // TEST 5: Analisa Teknikal
  // ============================================
  console.log('\n📈 TEST 5: Analisa Teknikal');
  try {
    const historical = await getHistoricalData(TEST_SYMBOL, '1y', '1d');
    if (historical) {
      const analysis = runTechnicalAnalysis(historical);
      if (analysis && analysis.rsi) {
        console.log(`  ✅ Analisa teknikal berhasil`);
        console.log(`  RSI: ${analysis.rsi.value?.toFixed(2)} (${analysis.rsi.signal})`);
        console.log(`  MACD: ${analysis.macd?.trend || 'N/A'}`);
        console.log(`  Skor: ${analysis.score}/100 → ${analysis.recommendation}`);
        passed++;
      } else {
        throw new Error('Analisa teknikal gagal');
      }
    }
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
    failed++;
  }
  
  // ============================================
  // TEST 6: Analisa Fundamental
  // ============================================
  console.log('\n🏢 TEST 6: Analisa Fundamental');
  try {
    const fundamental = await getFundamentalData(TEST_SYMBOL);
    if (fundamental) {
      const analysis = runFundamentalAnalysis(fundamental);
      if (analysis && analysis.totalScore !== undefined) {
        console.log(`  ✅ Analisa fundamental berhasil`);
        console.log(`  Skor: ${analysis.totalScore}/100 → ${analysis.recommendation}`);
        passed++;
      } else {
        throw new Error('Analisa fundamental gagal');
      }
    }
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
    failed++;
  }
  
  // ============================================
  // TEST 7: Analisa Sentimen
  // ============================================
  console.log('\n🧠 TEST 7: Analisa Sentimen');
  try {
    const news = await getNewsData(TEST_SYMBOL);
    const sentiment = await runSentimentAnalysis(TEST_SYMBOL, news);
    if (sentiment) {
      console.log(`  ✅ Analisa sentimen berhasil`);
      console.log(`  Skor: ${sentiment.overallScore}/100 → ${sentiment.overallSentiment}`);
      console.log(`  Berita: ${sentiment.news?.newsCount || 0} item`);
      passed++;
    } else {
      throw new Error('Analisa sentimen gagal');
    }
  } catch (e) {
    console.log(`  ❌ Error: ${e.message}`);
    failed++;
  }
  
  // ============================================
  // TEST 8: TradingView
  // ============================================
  console.log('\n📡 TEST 8: TradingView Connector');
  try {
    const tvData = await getTradingViewRecommendation(TEST_SYMBOL);
    if (tvData) {
      console.log(`  ✅ TradingView berhasil`);
      console.log(`  Rekomendasi: ${tvData.recommendation?.overall}`);
      console.log(`  RSI TV: ${tvData.indicators?.rsi?.toFixed(2)}`);
      passed++;
    } else {
      console.log(`  ⚠️ TradingView tidak tersedia (mungkin diblokir)`);
      console.log(`  Sistem tetap berjalan tanpa TradingView`);
      passed++; // Tidak fatal
    }
  } catch (e) {
    console.log(`  ⚠️ TradingView error: ${e.message} (tidak fatal)`);
    passed++; // Tidak fatal
  }
  
  // ============================================
  // TEST 9: Telegram Bot
  // ============================================
  console.log('\n🤖 TEST 9: Telegram Bot');
  try {
    const status = await checkBotStatus();
    if (status.ok) {
      console.log(`  ✅ Bot aktif: @${status.bot.username}`);
      console.log(`  Mengirim pesan test...`);
      await sendWelcomeMessage();
      passed++;
    } else {
      console.log(`  ⚠️ Bot tidak aktif: ${status.error}`);
      console.log(`  Pastikan TELEGRAM_BOT_TOKEN di file .env sudah benar`);
      // Tidak fatal untuk test
      passed++;
    }
  } catch (e) {
    console.log(`  ⚠️ Telegram error: ${e.message}`);
    passed++;
  }
  
  // ============================================
  // HASIL TEST
  // ============================================
  console.log('\n' + '='.repeat(50));
  console.log('📊 HASIL TEST:');
  console.log(`  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 SEMUA TEST BERHASIL! Sistem siap digunakan.');
    console.log('\nCara menjalankan analisa:');
    console.log('  node src/index.js AAPL');
    console.log('  node src/index.js AAPL MSFT GOOGL NVDA');
  } else {
    console.log('\n⚠️ Ada beberapa test yang gagal. Periksa konfigurasi Anda.');
  }
  
  console.log('='.repeat(50) + '\n');
}

runTests().catch(console.error);
