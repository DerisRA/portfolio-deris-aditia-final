# 📈 PANDUAN LENGKAP SISTEM ANALISA SAHAM US
## Dari Nol Sampai Berjalan - Untuk Pemula

---

## 🎯 APA YANG AKAN KITA BUAT?

Sistem ini akan:
1. **Mengambil data saham** dari Yahoo Finance (yfinance via API)
2. **Menganalisa secara Fundamental** (P/E ratio, EPS, Revenue, dll)
3. **Menganalisa secara Teknikal** (RSI, MACD, Bollinger Bands, Moving Average)
4. **Menganalisa Sentimen** (berita & market sentiment)
5. **Manajemen Risiko** (Stop Loss, Take Profit, Position Sizing)
6. **Mengirim hasil ke Telegram** (dalam bentuk teks & PDF)
7. **Terhubung ke TradingView** untuk chart real-time

---

## 📋 LANGKAH 1: PERSIAPAN KOMPUTER

### 1.1 Install Node.js
1. Buka browser, pergi ke: https://nodejs.org
2. Download versi **LTS** (Long Term Support)
3. Install dengan klik Next-Next-Finish
4. Buka **Command Prompt** atau **Terminal** di VSCode
5. Ketik: `node --version` → harus muncul angka versi (contoh: v20.x.x)
6. Ketik: `npm --version` → harus muncul angka versi

### 1.2 Install Python (untuk yfinance)
1. Buka browser, pergi ke: https://python.org
2. Download Python 3.11 atau lebih baru
3. **PENTING**: Centang "Add Python to PATH" saat install!
4. Buka terminal, ketik: `python --version` → harus muncul versi

### 1.3 Install VSCode
1. Pergi ke: https://code.visualstudio.com
2. Download dan install
3. Buka VSCode
4. Install extension: **Python**, **ESLint**, **Prettier**

---

## 📋 LANGKAH 2: SETUP TELEGRAM BOT

### 2.1 Buat Bot Telegram
1. Buka Telegram di HP atau PC
2. Cari **@BotFather** di pencarian Telegram
3. Klik START
4. Ketik: `/newbot`
5. Masukkan nama bot: contoh `SahamAnalyzerBot`
6. Masukkan username bot: contoh `saham_analyzer_bot` (harus diakhiri _bot)
7. BotFather akan memberikan **TOKEN** → **SIMPAN TOKEN INI!**
   - Contoh token: `7234567890:AAHdqTcvCHhvQNKMe1bEertyuiop`

### 2.2 Dapatkan Chat ID Anda
1. Cari bot Anda di Telegram (@saham_analyzer_bot)
2. Klik START
3. Buka browser, ketik URL ini (ganti TOKEN dengan token Anda):
   ```
   https://api.telegram.org/botTOKEN/getUpdates
   ```
4. Kirim pesan apapun ke bot Anda
5. Refresh halaman browser
6. Cari angka setelah `"id":` di bagian `"chat"` → itu **CHAT ID** Anda
   - Contoh: `"id": 123456789`

---

## 📋 LANGKAH 3: SETUP PROJECT

### 3.1 Buat Folder Project
1. Buka VSCode
2. Buka Terminal di VSCode: Menu **Terminal** → **New Terminal**
3. Ketik perintah berikut satu per satu:

```bash
# Pergi ke Desktop (atau folder pilihan Anda)
cd Desktop

# Buat folder baru
mkdir stock-analyzer
cd stock-analyzer

# Buka di VSCode
code .
```

### 3.2 Copy Semua File
Semua file yang sudah saya buat, copy ke folder `stock-analyzer` Anda.

### 3.3 Install Dependencies Node.js
Di terminal VSCode, ketik:
```bash
npm install
```
Tunggu sampai selesai (bisa 1-3 menit).

### 3.4 Install Dependencies Python
```bash
pip install yfinance pandas numpy requests python-telegram-bot reportlab matplotlib
```
Tunggu sampai selesai.

---

## 📋 LANGKAH 4: KONFIGURASI

### 4.1 Edit File .env
Buka file `.env` di VSCode, isi dengan data Anda:

```
TELEGRAM_BOT_TOKEN=7234567890:AAHdqTcvCHhvQNKMe1bEertyuiop
TELEGRAM_CHAT_ID=123456789
```

**JANGAN SHARE FILE .env KE SIAPAPUN!**

---

## 📋 LANGKAH 5: MENJALANKAN SISTEM

### 5.1 Jalankan Analisa
Di terminal VSCode:
```bash
# Analisa satu saham
node src/index.js AAPL

# Analisa beberapa saham sekaligus
node src/index.js AAPL MSFT GOOGL TSLA

# Analisa dengan watchlist default
node src/index.js
```

### 5.2 Hasil yang Akan Diterima di Telegram
- ✅ Laporan teks lengkap dengan semua analisa
- ✅ File PDF dengan chart dan grafik
- ✅ Rekomendasi: BUY / SELL / HOLD / WAIT
- ✅ Level Stop Loss dan Take Profit
- ✅ Risk/Reward Ratio

---

## 📋 LANGKAH 6: MEMAHAMI HASIL ANALISA

### 6.1 Analisa Fundamental
- **P/E Ratio**: Harga saham dibagi laba per saham
  - < 15: Murah (undervalued)
  - 15-25: Wajar
  - > 25: Mahal (overvalued)
- **EPS Growth**: Pertumbuhan laba per saham (makin tinggi makin bagus)
- **Debt/Equity**: Rasio hutang (< 1 lebih aman)
- **ROE**: Return on Equity (> 15% bagus)

### 6.2 Analisa Teknikal
- **RSI (Relative Strength Index)**:
  - < 30: Oversold → Potensi naik (sinyal beli)
  - > 70: Overbought → Potensi turun (sinyal jual)
  - 30-70: Normal
- **MACD**: 
  - MACD cross di atas Signal → Sinyal beli
  - MACD cross di bawah Signal → Sinyal jual
- **Moving Average (MA)**:
  - Harga di atas MA50 & MA200 → Trend naik (bullish)
  - Harga di bawah MA50 & MA200 → Trend turun (bearish)
- **Bollinger Bands**:
  - Harga menyentuh band bawah → Potensi naik
  - Harga menyentuh band atas → Potensi turun

### 6.3 Manajemen Risiko
- **Stop Loss**: Batas kerugian maksimal (biasanya 5-10% dari harga beli)
- **Take Profit**: Target keuntungan (biasanya 2-3x dari stop loss)
- **Position Sizing**: Jangan taruh lebih dari 5% modal di satu saham
- **Risk/Reward Ratio**: Minimal 1:2 (risiko 1, potensi untung 2)

### 6.4 Membaca Rekomendasi
- 🟢 **STRONG BUY**: Semua indikator positif, masuk sekarang
- 🟡 **BUY**: Lebih banyak sinyal positif, bisa masuk
- ⚪ **HOLD**: Tahan posisi yang ada, jangan tambah
- 🟠 **WAIT**: Tunggu konfirmasi lebih lanjut
- 🔴 **SELL**: Sinyal negatif dominan, keluar posisi
- ⛔ **STRONG SELL**: Semua indikator negatif, keluar segera

---

## 📋 LANGKAH 7: JADWAL ANALISA OTOMATIS

### 7.1 Jalankan Scheduler
```bash
node src/scheduler.js
```
Sistem akan otomatis analisa setiap:
- Pagi: 09:30 ET (sebelum market buka)
- Siang: 12:00 ET (tengah hari)
- Sore: 16:00 ET (setelah market tutup)

---

## ⚠️ DISCLAIMER PENTING

**SISTEM INI HANYA UNTUK EDUKASI DAN REFERENSI!**

- Analisa ini BUKAN saran investasi resmi
- Pasar saham mengandung risiko tinggi
- Selalu lakukan riset sendiri sebelum investasi
- Jangan investasikan uang yang tidak mampu Anda rugikan
- Konsultasikan dengan financial advisor berlisensi

---

## 🆘 TROUBLESHOOTING

### Error: "Cannot find module"
```bash
npm install
```

### Error: "Python not found"
- Pastikan Python sudah diinstall dan ada di PATH
- Coba: `python3 --version` atau `py --version`

### Telegram tidak menerima pesan
- Pastikan TOKEN dan CHAT_ID benar di file .env
- Pastikan Anda sudah klik START di bot Telegram

### Data saham tidak muncul
- Cek koneksi internet
- Pastikan simbol saham benar (contoh: AAPL, bukan Apple)

---

## 📞 SAHAM YANG BISA DIANALISA

Contoh simbol saham US populer:
- **Tech**: AAPL, MSFT, GOOGL, META, AMZN, NVDA, TSLA
- **Finance**: JPM, BAC, GS, MS, WFC
- **Healthcare**: JNJ, PFE, UNH, ABBV
- **Energy**: XOM, CVX, COP
- **ETF**: SPY, QQQ, DIA, IWM

