# 💬 Real-time Chat with WebSocket

A simple real-time chat application simulating two users (Andi & Yono) chatting on one page using WebSocket, Next.js, and TypeScript.

## ✨ Features

- **Real-time messaging** with WebSocket
- **Flash notification** when receiving messages (0.5s yellow highlight)
- **Message persistence** - messages saved even after closing the tab
- **Auto-reconnect** on connection loss
- **Minimal dependencies** - only necessary libraries

## 🚀 Quick Start

**1. Install dependencies**
```bash
npm install
```

**2. Start WebSocket server** (Terminal 1)
```bash
npm run ws
```
Server runs on `ws://localhost:8080`

**3. Start Next.js dev server** (Terminal 2)
```bash
npm run dev
```
App runs on `http://localhost:3000`

**4. Open browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
blsky-chat-test/
├── app/
│   └── page.tsx              # Main UI (Next.js App Router)
├── src/
│   ├── components/
│   │   └── ChatBox.tsx       # Chat box component
│   └── lib/
│       └── websocket.ts      # WebSocket client helper
├── server/
│   ├── ws-server.ts          # WebSocket server
│   └── messages.json         # Message storage
└── tsconfig.server.json      # Server TypeScript config
```

## 🛠️ Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **WebSocket (ws)** - Real-time communication
- **Tailwind CSS** - Styling
- **Node.js Crypto** - UUID generation (built-in)

## 🎯 How It Works

1. **Andi sends message** → Message appears in both boxes → **Yono's box flashes** ⚡
2. **Yono sends message** → Message appears in both boxes → **Andi's box flashes** ⚡
3. **Close tab & reopen** → All messages still there (saved in `server/messages.json`)

## 📦 Available Scripts

```bash
npm run dev    # Start Next.js dev server (port 3000)
npm run ws     # Start WebSocket server (port 8080)
npm run build  # Build for production
npm run start  # Start production server
```

## 🐛 Troubleshooting

**WebSocket not connected?**
- Make sure WebSocket server is running: `npm run ws`
- Check if port 8080 is available

**Messages not persisting?**
- Check if `server/messages.json` exists and is valid JSON
- Ensure server has write permissions

**Dev server error?**
- Delete `.next` folder and run `npm run dev` again
- Restart both servers

## 📚 Full Documentation

For detailed architecture, code explanations, and implementation details, see:
**[PENJELASAN_PROJECT.txt](./PENJELASAN_PROJECT.txt)**

Includes:
- Complete architecture with diagrams
- Message flow explanations
- Function-by-function breakdown
- WebSocket fundamentals
- Testing & debugging guide

## 📄 License

MIT
