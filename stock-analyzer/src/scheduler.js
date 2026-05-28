// ============================================
// SCHEDULER - ANALISA OTOMATIS TERJADWAL
// ============================================
// Menjalankan analisa secara otomatis sesuai jadwal
// Cara menjalankan: node src/scheduler.js

import cron from 'node-cron';
import { config } from './config.js';
import { sendMessage } from './telegramSender.js';

// Import fungsi analisa dari index.js
// (kita buat fungsi terpisah agar bisa diimport)

console.log('⏰ SCHEDULER ANALISA SAHAM DIMULAI');
console.log(`📋 Watchlist: ${config.watchlist.join(', ')}`);
console.log('');

// ============================================
// JADWAL ANALISA
// ============================================
// Catatan: Waktu dalam format cron (UTC)
// Market US buka: 09:30 - 16:00 ET
// ET = UTC-4 (summer) atau UTC-5 (winter)
// WIB = UTC+7
// Jadi 09:30 ET = 20:30 WIB (summer) atau 21:30 WIB (winter)

// Analisa pagi (sebelum market buka) - 09:00 ET = 20:00 WIB
const morningSchedule = '0 14 * * 1-5'; // 14:00 UTC = 21:00 WIB = 09:00 ET (winter)

// Analisa tengah hari - 12:00 ET = 23:00 WIB
const middaySchedule = '0 17 * * 1-5'; // 17:00 UTC = 00:00 WIB+1 = 12:00 ET

// Analisa setelah market tutup - 16:30 ET = 03:30 WIB+1
const closingSchedule = '30 21 * * 1-5'; // 21:30 UTC = 04:30 WIB = 16:30 ET

// ============================================
// FUNGSI ANALISA TERJADWAL
// ============================================
async function runScheduledAnalysis(sessionName) {
  const now = new Date().toLocaleString('id-ID', { 
    timeZone: 'Asia/Jakarta',
    dateStyle: 'full',
    timeStyle: 'short'
  });
  
  console.log(`\n⏰ [${now}] Menjalankan analisa ${sessionName}...`);
  
  // Kirim notifikasi mulai
  await sendMessage(`
⏰ *Analisa ${sessionName} Dimulai*
📅 ${now} WIB
📋 Saham: ${config.watchlist.join(', ')}
  `);
  
  // Import dan jalankan analisa
  try {
    // Dynamic import untuk menghindari circular dependency
    const { default: analyzeAll } = await import('./analyzeAll.js');
    await analyzeAll(config.watchlist);
  } catch (error) {
    console.error(`❌ Error analisa terjadwal:`, error.message);
    await sendMessage(`❌ Error analisa ${sessionName}: ${error.message}`);
  }
}

// ============================================
// DAFTARKAN JADWAL
// ============================================

// Analisa Pagi (Senin-Jumat)
cron.schedule(morningSchedule, () => {
  runScheduledAnalysis('Pagi (Pre-Market)');
}, {
  timezone: 'UTC',
});

// Analisa Tengah Hari (Senin-Jumat)
cron.schedule(middaySchedule, () => {
  runScheduledAnalysis('Tengah Hari');
}, {
  timezone: 'UTC',
});

// Analisa Penutupan (Senin-Jumat)
cron.schedule(closingSchedule, () => {
  runScheduledAnalysis('Penutupan (After-Market)');
}, {
  timezone: 'UTC',
});

// ============================================
// TAMPILKAN INFO JADWAL
// ============================================
console.log('📅 JADWAL ANALISA OTOMATIS:');
console.log('');
console.log('🌅 Pagi (Pre-Market):');
console.log('   09:00 ET | 21:00 WIB | Senin-Jumat');
console.log('');
console.log('☀️ Tengah Hari:');
console.log('   12:00 ET | 00:00 WIB+1 | Senin-Jumat');
console.log('');
console.log('🌆 Penutupan (After-Market):');
console.log('   16:30 ET | 04:30 WIB | Senin-Jumat');
console.log('');
console.log('✅ Scheduler aktif! Tekan Ctrl+C untuk berhenti.');
console.log('');

// Kirim notifikasi scheduler aktif
sendMessage(`
🤖 *Scheduler Analisa Saham Aktif*

📋 Watchlist: ${config.watchlist.join(', ')}

📅 Jadwal Analisa:
• 🌅 Pagi: 09:00 ET (21:00 WIB)
• ☀️ Siang: 12:00 ET (00:00 WIB)
• 🌆 Sore: 16:30 ET (04:30 WIB)

Hanya Senin-Jumat (hari trading)
`).catch(console.error);

// Keep process alive
process.on('SIGINT', async () => {
  console.log('\n\n⛔ Scheduler dihentikan');
  await sendMessage('⛔ Scheduler analisa saham dihentikan').catch(() => {});
  process.exit(0);
});
