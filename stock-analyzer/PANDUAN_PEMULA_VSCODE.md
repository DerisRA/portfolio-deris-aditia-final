# 🎓 PANDUAN LENGKAP UNTUK PEMULA - DARI NOL SAMPAI JALAN
## Sistem Analisa Saham US dengan VSCode

---

## 📁 STRUKTUR FILE PROJECT

```
stock-analyzer/
├── 📄 .env                    ← Konfigurasi rahasia (TOKEN, CHAT_ID)
├── 📄 .env.example            ← Contoh konfigurasi
├── 📄 package.json            ← Daftar library yang digunakan
├── 📄 PANDUAN_LENGKAP.md      ← Panduan lengkap
├── 📄 CARA_INSTALL.md         ← Cara install cepat
├── 📄 PANDUAN_PEMULA_VSCODE.md ← File ini
└── src/
    ├── 📄 index.js            ← FILE UTAMA - Jalankan ini!
    ├── 📄 config.js           ← Pengaturan sistem
    ├── 📄 dataFetcher.js      ← Ambil data dari Yahoo Finance
    ├── 📄 technicalAnalysis.js ← Analisa Teknikal (RSI, MACD, dll)
    ├── 📄 fundamentalAnalysis.js ← Analisa Fundamental (P/E, ROE, dll)
    ├── 📄 sentimentAnalysis.js ← Analisa Sentimen (Berita, Fear&Greed)
    ├── 📄 riskManagement.js   ← Manajemen Risiko (Stop Loss, dll)
    ├── 📄 tradingviewConnector.js ← Koneksi TradingView
    ├── 📄 reportGenerator.js  ← Buat laporan teks & HTML
    ├── 📄 telegramSender.js   ← Kirim ke Telegram
    ├── 📄 scheduler.js        ← Jadwal analisa otomatis
    └── 📄 test.js             ← Test semua komponen
```

---

## 🖥️ LANGKAH DEMI LANGKAH DI VSCODE

### LANGKAH 1: Download & Install Software

#### A. Install Node.js
1. Buka browser → https://nodejs.org
2. Klik tombol hijau besar "LTS" (bukan Current)
3. Download file .msi (Windows) atau .pkg (Mac)
4. Buka file yang didownload
5. Klik Next → Next → Install → Finish
6. **Verifikasi**: Buka Command Prompt → ketik `node --version`
   - Harus muncul: `v20.x.x` atau lebih baru ✅

#### B. Install VSCode
1. Buka browser → https://code.visualstudio.com
2. Klik "Download for Windows" (atau Mac/Linux)
3. Install seperti biasa
4. Buka VSCode

#### C. Install Extension VSCode (Opsional tapi Berguna)
1. Di VSCode, klik ikon Extensions (Ctrl+Shift+X)
2. Cari dan install:
   - **"ESLint"** - Cek error kode
   - **"Prettier"** - Format kode otomatis
   - **"GitLens"** - Manajemen Git

---

### LANGKAH 2: Setup Folder Project

1. **Buka VSCode**
2. **Buka Terminal**: Menu `Terminal` → `New Terminal`
   - Atau tekan: `Ctrl + `` ` (backtick)
3. **Navigasi ke Desktop**:
   ```bash
   # Windows
   cd C:\Users\NamaAnda\Desktop
   
   # Mac/Linux
   cd ~/Desktop
   ```
4. **Buat folder baru**:
   ```bash
   mkdir stock-analyzer
   cd stock-analyzer
   ```
5. **Buka di VSCode**:
   ```bash
   code .
   ```
   VSCode akan membuka folder baru

---

### LANGKAH 3: Copy File Project

**Cara 1: Copy Manual**
- Copy semua file dari folder `stock-analyzer` yang sudah dibuat
- Paste ke folder `stock-analyzer` di Desktop Anda

**Cara 2: Jika menggunakan Git**
```bash
git clone [URL_REPOSITORY]
cd stock-analyzer
```

---

### LANGKAH 4: Install Dependencies

Di terminal VSCode (pastikan sudah di folder stock-analyzer):
```bash
npm install
```

Anda akan melihat banyak teks berjalan. Tunggu sampai muncul:
```
added XXX packages in Xs
```

Ini artinya semua library berhasil diinstall ✅

---

### LANGKAH 5: Setup Telegram Bot

#### A. Buat Bot Baru
1. Buka Telegram di HP atau PC
2. Di kolom pencarian, ketik: **@BotFather**
3. Klik pada @BotFather (ada centang biru)
4. Klik tombol **START**
5. Ketik: `/newbot`
6. BotFather akan tanya nama bot:
   - Ketik nama: `Analisa Saham Saya`
7. BotFather akan tanya username bot:
   - Ketik username: `analisa_saham_saya_bot`
   - (harus diakhiri dengan `_bot`, harus unik)
8. BotFather akan memberikan **TOKEN** seperti ini:
   ```
   7234567890:AAHdqTcvCHhvQNKMe1bEertyuiop123456
   ```
   **COPY DAN SIMPAN TOKEN INI!**

#### B. Dapatkan Chat ID
1. Di Telegram, cari bot yang baru dibuat: `@analisa_saham_saya_bot`
2. Klik **START**
3. Kirim pesan apapun ke bot (contoh: "halo")
4. Buka browser, ketik URL ini (ganti TOKEN dengan token Anda):
   ```
   https://api.telegram.org/bot7234567890:AAHdqTcvCHhvQNKMe1bEertyuiop123456/getUpdates
   ```
5. Anda akan melihat JSON seperti ini:
   ```json
   {
     "result": [{
       "message": {
         "chat": {
           "id": 123456789,    ← INI CHAT ID ANDA!
           "first_name": "Nama Anda"
         }
       }
     }]
   }
   ```
6. **COPY angka setelah `"id":`** → Itu Chat ID Anda

---

### LANGKAH 6: Konfigurasi File .env

1. Di VSCode, buka file `.env` (klik di panel kiri)
2. Isi dengan data Anda:

```env
# Ganti dengan token dari BotFather
TELEGRAM_BOT_TOKEN=7234567890:AAHdqTcvCHhvQNKMe1bEertyuiop123456

# Ganti dengan Chat ID Anda
TELEGRAM_CHAT_ID=123456789

# Saham yang ingin dianalisa (pisahkan koma)
DEFAULT_WATCHLIST=AAPL,MSFT,GOOGL,NVDA,TSLA

# Modal investasi Anda dalam USD
PORTFOLIO_SIZE=10000

# Risiko per trade dalam persen
MAX_RISK_PER_TRADE=2
```

3. Tekan `Ctrl+S` untuk menyimpan

**⚠️ PENTING: Jangan pernah share file .env ke siapapun!**

---

### LANGKAH 7: Test Sistem

```bash
npm test
```

Anda akan melihat hasil seperti:
```
🧪 MENJALANKAN TEST SISTEM ANALISA SAHAM
==================================================

📋 TEST 1: Konfigurasi
  ✅ Konfigurasi OK

📊 TEST 2: Data Historis Yahoo Finance
  ✅ Berhasil ambil 251 data untuk AAPL

📈 TEST 5: Analisa Teknikal
  ✅ Analisa teknikal berhasil
  RSI: 45.23 (NEUTRAL)
  Skor: 55/100 → HOLD

🤖 TEST 9: Telegram Bot
  ✅ Bot aktif: @analisa_saham_saya_bot

🎉 SEMUA TEST BERHASIL! Sistem siap digunakan.
```

---

### LANGKAH 8: Jalankan Analisa!

```bash
# Analisa Apple
node src/index.js AAPL

# Analisa beberapa saham
node src/index.js AAPL MSFT GOOGL NVDA TSLA

# Analisa dengan watchlist default
node src/index.js
```

Anda akan menerima pesan di Telegram berisi:
- 📊 Ringkasan analisa
- 📈 Analisa teknikal lengkap
- 🏢 Analisa fundamental
- 🧠 Analisa sentimen & berita
- 🛡️ Manajemen risiko
- 📄 File HTML laporan lengkap

---

## 📊 MEMAHAMI HASIL ANALISA

### Skor 0-100
| Skor | Arti |
|------|------|
| 75-100 | STRONG BUY 🟢🟢 |
| 60-74 | BUY 🟢 |
| 45-59 | HOLD ⚪ |
| 30-44 | SELL 🔴 |
| 0-29 | STRONG SELL 🔴🔴 |

### RSI (Relative Strength Index)
| RSI | Arti | Aksi |
|-----|------|------|
| < 20 | Sangat Oversold | Potensi beli kuat |
| 20-30 | Oversold | Pertimbangkan beli |
| 30-70 | Normal | Tidak ada sinyal |
| 70-80 | Overbought | Pertimbangkan jual |
| > 80 | Sangat Overbought | Potensi jual kuat |

### MACD
- **MACD cross di atas Signal** → Sinyal BELI 🟢
- **MACD cross di bawah Signal** → Sinyal JUAL 🔴
- **MACD di atas 0** → Trend bullish
- **MACD di bawah 0** → Trend bearish

### Moving Average
- **Harga > MA50 & MA200** → Trend naik (bullish) 📈
- **Harga < MA50 & MA200** → Trend turun (bearish) 📉
- **Golden Cross (MA50 > MA200)** → Sinyal bullish jangka panjang 🌟
- **Death Cross (MA50 < MA200)** → Sinyal bearish jangka panjang 💀

### P/E Ratio (Fundamental)
| P/E | Arti |
|-----|------|
| < 10 | Sangat murah (undervalued) |
| 10-20 | Wajar |
| 20-30 | Agak mahal |
| > 30 | Mahal (overvalued) |

---

## ⏰ JADWAL ANALISA OTOMATIS

Untuk analisa otomatis setiap hari:
```bash
node src/scheduler.js
```

Jadwal analisa:
| Waktu ET | Waktu WIB | Keterangan |
|----------|-----------|------------|
| 09:00 ET | 21:00 WIB | Pre-Market |
| 12:00 ET | 00:00 WIB | Tengah Hari |
| 16:30 ET | 04:30 WIB | After-Market |

*Hanya Senin-Jumat (hari trading)*

---

## 🔧 TIPS & TRIK

### Tambah Saham ke Watchlist
Edit file `.env`:
```
DEFAULT_WATCHLIST=AAPL,MSFT,GOOGL,NVDA,TSLA,META,AMZN,JPM
```

### Ubah Modal Portfolio
```
PORTFOLIO_SIZE=50000
```

### Ubah Risiko per Trade
```
MAX_RISK_PER_TRADE=1
```
*(1% = lebih konservatif, 5% = lebih agresif)*

### Simpan Laporan HTML
Laporan HTML otomatis disimpan di folder `output/` jika Telegram belum dikonfigurasi.

---

## ❓ FAQ (Pertanyaan Umum)

**Q: Apakah ini gratis?**
A: Ya! Semua data dari Yahoo Finance gratis. Telegram bot juga gratis.

**Q: Apakah data real-time?**
A: Data harga real-time (delay 15 menit untuk non-premium). Data historis real-time.

**Q: Apakah bisa untuk saham Indonesia?**
A: Sistem ini dirancang untuk saham US. Untuk saham Indonesia, simbol berbeda (contoh: BBCA.JK).

**Q: Seberapa akurat analisanya?**
A: Tidak ada analisa yang 100% akurat. Gunakan sebagai referensi, bukan keputusan final.

**Q: Apakah aman?**
A: Data Anda tidak dikirim ke mana-mana selain Telegram bot Anda sendiri.

**Q: Bisa dijalankan 24 jam?**
A: Ya, gunakan `node src/scheduler.js` dan biarkan berjalan.

---

## ⚠️ DISCLAIMER

**PENTING DIBACA:**
- Sistem ini hanya untuk **edukasi dan referensi**
- **BUKAN** saran investasi resmi
- Pasar saham mengandung **risiko tinggi**
- Selalu lakukan **riset sendiri** (DYOR - Do Your Own Research)
- Jangan investasikan uang yang tidak mampu Anda rugikan
- Konsultasikan dengan **financial advisor berlisensi**
- Past performance **tidak menjamin** future results

---

## 📞 SIMBOL SAHAM POPULER

```
TECH:     AAPL  MSFT  GOOGL  META  AMZN  NVDA  TSLA  NFLX
FINANCE:  JPM   BAC   GS    MS    WFC   BRK-B
HEALTH:   JNJ   PFE   UNH   ABBV  MRK   LLY
ENERGY:   XOM   CVX   COP   SLB
CONSUMER: WMT   COST  MCD   SBUX  NKE   HD
SEMI:     NVDA  AMD   INTC  QCOM  AVGO  TSM
ETF:      SPY   QQQ   DIA   IWM   VTI   GLD
```

---

*Dibuat dengan ❤️ untuk investor pemula Indonesia*
*Semoga sukses dalam perjalanan investasi Anda!*
