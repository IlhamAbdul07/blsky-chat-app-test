# 💬 Andi & Yono Chat - Real-time WebSocket Test

Aplikasi chat real-time yang mensimulasikan 2 orang (Andi & Yono) chatting di satu halaman menggunakan WebSocket, Next.js, dan TypeScript.

## ✨ Fitur

- 👥 Simulasi 2 pengguna (Andi & Yono) chatting real-time di satu halaman
- ⚡ Real-time messaging menggunakan WebSocket
- 🔔 **Efek flash notification** saat menerima pesan:
  - Ketika Andi mengirim pesan → Box Yono flash dengan highlight kuning
  - Ketika Yono mengirim pesan → Box Andi flash dengan highlight kuning
  - Flash duration: 0.5 detik dengan background highlight dan scale effect
- 💾 Persistensi pesan - pesan tetap tersimpan meskipun tab ditutup
- 🔄 Auto-reconnect jika koneksi terputus
- 🎨 UI modern dengan Tailwind CSS

## 🏗️ Struktur Project

```
blsky-chat-test/
│
├── app/
│   └── page.tsx               # UI utama chat (Next.js App Router)
│
├── src/
│   ├── components/
│   │   └── ChatBox.tsx        # Komponen chat box
│   └── lib/
│       └── websocket.ts       # WebSocket client helper
│
├── server/
│   ├── ws-server.ts           # WebSocket server
│   └── messages.json          # File penyimpanan pesan
│
├── tsconfig.json
├── tsconfig.server.json       # Config untuk server
├── package.json
└── README.md
```

## 🚀 Cara Menjalankan

### 1. Install Dependencies (jika belum)

```bash
npm install
```

### 2. Jalankan WebSocket Server

Buka terminal pertama dan jalankan:

```bash
npm run ws
```

Server WebSocket akan berjalan di `ws://localhost:8080`

### 3. Jalankan Next.js Development Server

Buka terminal kedua dan jalankan:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### 4. Buka di Browser

Buka browser dan akses `http://localhost:3000`

## 📝 Cara Menggunakan

1. Buka aplikasi di browser `http://localhost:3000`
2. Anda akan melihat dua jendela chat: **Andi** (biru) dan **Yono** (hijau)
3. Bayangkan ada 2 orang sedang chatting real-time di satu halaman
4. **Ketik pesan sebagai Andi** (box kiri) dan klik **Kirim**
   - Pesan muncul di box Andi
   - Box Yono akan **flash** dengan highlight kuning ⚡
5. **Ketik pesan sebagai Yono** (box kanan) dan klik **Kirim**
   - Pesan muncul di box Yono  
   - Box Andi akan **flash** dengan highlight kuning ⚡
6. Semua pesan tersimpan di `server/messages.json`
7. Tutup tab dan buka lagi - pesan lama tetap ada 💾

## 🛠️ Teknologi yang Digunakan

- **Next.js 16** - React framework
- **TypeScript** - Type-safe development
- **WebSocket (ws)** - Real-time communication
- **Tailwind CSS** - Styling
- **Node.js Crypto** - Generate unique message IDs (built-in)

## 📦 Scripts

- `npm run dev` - Menjalankan Next.js development server
- `npm run ws` - Menjalankan WebSocket server
- `npm run build` - Build aplikasi untuk production
- `npm run start` - Menjalankan production server
- `npm run lint` - Menjalankan ESLint

## 🔧 Konfigurasi

### WebSocket Server Port

Secara default, WebSocket server berjalan di port **8080**. Untuk mengubahnya, edit `server/ws-server.ts`:

```typescript
const PORT = 8080; // Ubah sesuai kebutuhan
```

Jangan lupa update juga di `src/lib/websocket.ts`:

```typescript
constructor(url: string = 'ws://localhost:8080') {
  // Ubah port sesuai dengan server
}
```

## 🗂️ Data Persistence

Semua pesan disimpan di `server/messages.json` dalam format:

```json
[
  {
    "id": "uuid-string",
    "sender": "left",
    "text": "Hello from left!",
    "timestamp": 1704441600000
  }
]
```

## 🐛 Troubleshooting

### WebSocket tidak terhubung

1. Pastikan WebSocket server sudah berjalan (`npm run ws`)
2. Check console browser untuk error
3. Pastikan port 8080 tidak digunakan aplikasi lain

### Pesan tidak muncul setelah refresh

1. Check apakah `server/messages.json` ada dan valid
2. Pastikan WebSocket server memiliki permission write ke file

### Development Server Error

1. Hapus folder `.next` dan jalankan `npm run dev` lagi
2. Clear browser cache
3. Restart kedua server (WebSocket dan Next.js)

## 📄 License

MIT

## 📚 Dokumentasi Lengkap

Untuk penjelasan detail tentang arsitektur, cara kerja, dan penjelasan setiap fungsi, lihat:
**[PENJELASAN_PROJECT.txt](./PENJELASAN_PROJECT.txt)**

File ini berisi:
- ✅ Pengecekan requirement test kerja
- 🏗️ Arsitektur lengkap dengan diagram
- 📦 Penjelasan setiap package yang dipakai
- ⚙️ Cara kerja sistem dan message flow
- 🔧 Penjelasan detail setiap file dan fungsi
- 📖 Konsep fundamental (WebSocket, React hooks, dll)
- 🧪 Testing & debugging guide

## 👨‍💻 Author

Dibuat dengan ❤️ untuk Bluesky Chat Test
