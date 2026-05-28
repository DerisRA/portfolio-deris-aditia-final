// ============================================
// TELEGRAM SENDER
// ============================================
// Mengirim laporan ke Telegram dalam bentuk:
// 1. Pesan teks (dengan Markdown)
// 2. File HTML (sebagai dokumen)
// 3. Notifikasi alert

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import { config } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TELEGRAM_API = `https://api.telegram.org/bot${config.telegram.token}`;

// ============================================
// KIRIM PESAN TEKS
// ============================================
export async function sendMessage(text, chatId = null, parseMode = 'Markdown') {
  const targetChatId = chatId || config.telegram.chatId;
  
  if (!config.telegram.token || config.telegram.token === 'your_telegram_bot_token_here') {
    console.log('⚠️ Token Telegram belum dikonfigurasi. Pesan tidak dikirim.');
    console.log('📝 Preview pesan:');
    console.log(text.substring(0, 500) + '...');
    return false;
  }
  
  try {
    // Telegram membatasi pesan maksimal 4096 karakter
    const maxLength = 4000;
    
    if (text.length <= maxLength) {
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: targetChatId,
        text: text,
        parse_mode: parseMode,
        disable_web_page_preview: true,
      });
    } else {
      // Pecah pesan jika terlalu panjang
      const parts = splitMessage(text, maxLength);
      for (const part of parts) {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: targetChatId,
          text: part,
          parse_mode: parseMode,
          disable_web_page_preview: true,
        });
        // Delay antar pesan
        await sleep(500);
      }
    }
    
    console.log('✅ Pesan berhasil dikirim ke Telegram');
    return true;
    
  } catch (error) {
    console.error('❌ Error mengirim pesan Telegram:', error.response?.data || error.message);
    return false;
  }
}

// ============================================
// KIRIM FILE HTML SEBAGAI DOKUMEN
// ============================================
export async function sendHTMLDocument(htmlContent, filename, caption = '', chatId = null) {
  const targetChatId = chatId || config.telegram.chatId;
  
  if (!config.telegram.token || config.telegram.token === 'your_telegram_bot_token_here') {
    console.log('⚠️ Token Telegram belum dikonfigurasi. File tidak dikirim.');
    
    // Simpan file HTML secara lokal
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    const filePath = path.join(outputDir, filename);
    fs.writeFileSync(filePath, htmlContent, 'utf8');
    console.log(`📄 File HTML disimpan di: ${filePath}`);
    return false;
  }
  
  try {
    // Simpan HTML ke file sementara
    const tempDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
    const tempFile = path.join(tempDir, filename);
    fs.writeFileSync(tempFile, htmlContent, 'utf8');
    
    // Kirim sebagai dokumen
    const form = new FormData();
    form.append('chat_id', targetChatId);
    form.append('document', fs.createReadStream(tempFile), {
      filename: filename,
      contentType: 'text/html',
    });
    if (caption) form.append('caption', caption);
    
    await axios.post(`${TELEGRAM_API}/sendDocument`, form, {
      headers: form.getHeaders(),
      timeout: 30000,
    });
    
    // Hapus file sementara
    fs.unlinkSync(tempFile);
    
    console.log('✅ File HTML berhasil dikirim ke Telegram');
    return true;
    
  } catch (error) {
    console.error('❌ Error mengirim file Telegram:', error.response?.data || error.message);
    return false;
  }
}

// ============================================
// KIRIM LAPORAN LENGKAP
// ============================================
export async function sendFullReport(symbol, reports) {
  console.log(`📤 Mengirim laporan ${symbol} ke Telegram...`);
  
  // 1. Kirim ringkasan dulu
  await sendMessage(reports.summary);
  await sleep(1000);
  
  // 2. Kirim analisa teknikal
  await sendMessage(reports.technical);
  await sleep(1000);
  
  // 3. Kirim analisa fundamental
  await sendMessage(reports.fundamental);
  await sleep(1000);
  
  // 4. Kirim analisa sentimen
  await sendMessage(reports.sentiment);
  await sleep(1000);
  
  // 5. Kirim manajemen risiko
  await sendMessage(reports.risk);
  await sleep(1000);
  
  // 6. Kirim TradingView
  if (reports.tradingview) {
    await sendMessage(reports.tradingview);
    await sleep(1000);
  }
  
  // 7. Kirim laporan HTML lengkap
  const filename = `analisa_${symbol}_${new Date().toISOString().split('T')[0]}.html`;
  const caption = `📊 Laporan Lengkap ${symbol} - Buka di browser untuk tampilan terbaik`;
  await sendHTMLDocument(reports.html, filename, caption);
  
  console.log(`✅ Semua laporan ${symbol} berhasil dikirim!`);
}

// ============================================
// KIRIM ALERT CEPAT
// ============================================
export async function sendQuickAlert(symbol, price, recommendation, score, chatId = null) {
  const recEmoji = {
    'STRONG BUY': '🟢🟢',
    'BUY': '🟢',
    'HOLD': '⚪',
    'WAIT': '🟡',
    'SELL': '🔴',
    'STRONG SELL': '🔴🔴',
  }[recommendation] || '⚪';
  
  const message = `
🔔 *ALERT SAHAM*

📌 *${symbol}*
💰 Harga: $${price?.toFixed(2) || 'N/A'}
${recEmoji} Rekomendasi: *${recommendation}*
📊 Skor: ${score}/100

⏰ ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB
  `;
  
  return await sendMessage(message, chatId);
}

// ============================================
// KIRIM PESAN SELAMAT DATANG / TEST
// ============================================
export async function sendWelcomeMessage(chatId = null) {
  const message = `
🎉 *Selamat! Bot Analisa Saham Aktif!*

Sistem analisa saham US Anda sudah berjalan dengan baik.

📊 *Fitur yang tersedia:*
• Analisa Teknikal (RSI, MACD, BB, MA)
• Analisa Fundamental (P/E, ROE, Growth)
• Analisa Sentimen (Berita, Fear & Greed)
• Manajemen Risiko (Stop Loss, Take Profit)
• Koneksi TradingView
• Laporan PDF/HTML

🚀 *Cara menggunakan:*
Jalankan: \`node src/index.js AAPL\`

⚠️ _Disclaimer: Bukan saran investasi resmi_
  `;
  
  return await sendMessage(message, chatId);
}

// ============================================
// KIRIM RINGKASAN WATCHLIST
// ============================================
export async function sendWatchlistSummary(results) {
  let message = `
📊 *RINGKASAN WATCHLIST*
📅 ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })} WIB
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;
  
  for (const result of results) {
    if (!result) continue;
    
    const recEmoji = {
      'STRONG BUY': '🟢🟢',
      'BUY': '🟢',
      'HOLD': '⚪',
      'WAIT': '🟡',
      'SELL': '🔴',
      'STRONG SELL': '🔴🔴',
    }[result.recommendation] || '⚪';
    
    const changeStr = result.changePercent ? 
      `${result.changePercent > 0 ? '+' : ''}${result.changePercent.toFixed(2)}%` : 'N/A';
    
    message += `${recEmoji} *${result.symbol}* $${result.price?.toFixed(2) || 'N/A'} (${changeStr})
   Skor: ${result.score}/100 | ${result.recommendation}

`;
  }
  
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
_Ketik simbol saham untuk analisa lengkap_`;
  
  return await sendMessage(message);
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function splitMessage(text, maxLength) {
  const parts = [];
  let current = '';
  const lines = text.split('\n');
  
  for (const line of lines) {
    if ((current + line + '\n').length > maxLength) {
      if (current) parts.push(current);
      current = line + '\n';
    } else {
      current += line + '\n';
    }
  }
  
  if (current) parts.push(current);
  return parts;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// CEK STATUS BOT
// ============================================
export async function checkBotStatus() {
  if (!config.telegram.token || config.telegram.token === 'your_telegram_bot_token_here') {
    return { ok: false, error: 'Token belum dikonfigurasi' };
  }
  
  try {
    const response = await axios.get(`${TELEGRAM_API}/getMe`);
    return { ok: true, bot: response.data.result };
  } catch (error) {
    return { ok: false, error: error.response?.data?.description || error.message };
  }
}
