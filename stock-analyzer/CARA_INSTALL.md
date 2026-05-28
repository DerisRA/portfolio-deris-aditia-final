# 🚀 CARA INSTALL & MENJALANKAN - STEP BY STEP

## ⚡ QUICK START (5 Menit)

### LANGKAH 1: Buka Terminal di VSCode
```
Menu Terminal → New Terminal
```

### LANGKAH 2: Masuk ke folder project
```bash
cd stock-analyzer
```

### LANGKAH 3: Install dependencies
```bash
npm install
```
*Tunggu 1-3 menit sampai selesai*

### LANGKAH 4: Setup konfigurasi
```bash
# Copy file contoh konfigurasi
cp .env.example .env
```

Buka file `.env` di VSCode dan isi:
```
TELEGRAM_BOT_TOKEN=token_dari_botfather
TELEGRAM_CHAT_ID=chat_id_anda
```

### LANGKAH 5: Test sistem
```bash
npm test
```

### LANGKAH 6: Jalankan analisa!
```bash
# Analisa Apple
node src/index.js AAPL

# Analisa beberapa saham
node src/index.js AAPL MSFT GOOGL NVDA TSLA
```

---

## 📱 CARA DAPAT TOKEN TELEGRAM

1. Buka Telegram → Cari **@BotFather**
2. Ketik `/newbot`
3. Ikuti instruksi → Dapatkan TOKEN
4. Cari bot Anda → Klik START
5. Buka: `https://api.telegram.org/botTOKEN/getUpdates`
6. Kirim pesan ke bot → Refresh halaman
7. Cari `"id"` di bagian `"chat"` → Itu CHAT_ID Anda

---

## 🎯 CONTOH PENGGUNAAN

```bash
# Satu saham
node src/index.js AAPL

# Beberapa saham
node src/index.js AAPL MSFT GOOGL

# Saham populer
node src/index.js NVDA TSLA META AMZN

# ETF
node src/index.js SPY QQQ

# Jadwal otomatis (berjalan terus)
node src/scheduler.js
```

---

## 📊 SAHAM YANG BISA DIANALISA

| Kategori | Simbol |
|----------|--------|
| Tech | AAPL, MSFT, GOOGL, META, AMZN, NVDA, TSLA |
| Finance | JPM, BAC, GS, MS, WFC, BRK-B |
| Healthcare | JNJ, PFE, UNH, ABBV, MRK |
| Energy | XOM, CVX, COP, SLB |
| Consumer | WMT, COST, MCD, SBUX, NKE |
| ETF | SPY, QQQ, DIA, IWM, VTI |

---

## ❓ TROUBLESHOOTING

### "Cannot find module"
```bash
npm install
```

### "Error: getaddrinfo ENOTFOUND"
- Cek koneksi internet Anda

### Telegram tidak menerima pesan
- Pastikan TOKEN benar di .env
- Pastikan CHAT_ID benar
- Pastikan sudah klik START di bot

### Data saham tidak muncul
- Pastikan simbol benar (huruf kapital)
- Cek koneksi internet
- Yahoo Finance mungkin sedang down, coba lagi

---

## 🔧 KUSTOMISASI

Edit file `.env` untuk mengubah:
- `DEFAULT_WATCHLIST` - Daftar saham default
- `PORTFOLIO_SIZE` - Modal investasi Anda
- `MAX_RISK_PER_TRADE` - Risiko per trade (%)
- `RSI_OVERSOLD` - Threshold RSI oversold
- `RSI_OVERBOUGHT` - Threshold RSI overbought

