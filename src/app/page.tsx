'use client';

import { useEffect, useState, useCallback } from 'react';
import ChatBox from '@/components/ChatBox';
import { WebSocketClient, Message, WSMessage } from '@/lib/websocket';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [wsClient] = useState(() => new WebSocketClient());
  const [isConnected, setIsConnected] = useState(false);
  const [flashLeft, setFlashLeft] = useState(false);
  const [flashRight, setFlashRight] = useState(false);
  const [lastSender, setLastSender] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    wsClient.connect();

    // Setup message handler
    const unsubscribe = wsClient.onMessage((data: WSMessage) => {
      if (data.type === 'init' && data.messages) {
        setMessages(data.messages);
        setIsConnected(true);
      } else if (data.type === 'new_message' && data.message) {
        setMessages(prev => [...prev, data.message!]);
        
        // Flash the opposite side
        if (data.message.sender === 'left') {
          setFlashRight(true);
        } else {
          setFlashLeft(true);
        }
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      wsClient.disconnect();
    };
  }, [wsClient]);

  const handleSendMessage = useCallback((sender: 'left' | 'right', text: string) => {
    wsClient.sendMessage(sender, text);
    setLastSender(sender);
  }, [wsClient]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-green-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💬 Bluesky Chat Test
          </h1>
          <p className="text-gray-600">
            Aplikasi chat real-time dengan WebSocket
          </p>
          <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Terhubung' : 'Terputus'}
            </span>
          </div>
        </div>

        {/* Chat Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[600px]">
          <ChatBox
            side="left"
            messages={messages}
            onSendMessage={(text) => handleSendMessage('left', text)}
            shouldFlash={flashLeft}
            onFlashComplete={() => setFlashLeft(false)}
          />
          <ChatBox
            side="right"
            messages={messages}
            onSendMessage={(text) => handleSendMessage('right', text)}
            shouldFlash={flashRight}
            onFlashComplete={() => setFlashRight(false)}
          />
        </div>

        {/* Stats */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Total Pesan: {messages.length}</p>
        </div>
      </div>
    </main>
  );
}
