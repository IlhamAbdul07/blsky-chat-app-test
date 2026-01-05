'use client';

import { useEffect, useRef, useState } from 'react';
import { Message } from '@/src/lib/websocket';

interface ChatBoxProps {
  side: 'left' | 'right';
  messages: Message[];
  onSendMessage: (text: string) => void;
  shouldFlash: boolean;
  onFlashComplete: () => void;
}

export default function ChatBox({
  side,
  messages,
  onSendMessage,
  shouldFlash,
  onFlashComplete
}: ChatBoxProps) {
  const [inputText, setInputText] = useState('');
  const [isFlashing, setIsFlashing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle flash effect
  useEffect(() => {
    if (shouldFlash) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsFlashing(true);
      const timer = setTimeout(() => {
        setIsFlashing(false);
        onFlashComplete();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [shouldFlash, onFlashComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
      inputRef.current?.focus();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className={`flex flex-col h-full border-2 rounded-lg transition-all duration-300 ${
        side === 'left' 
          ? 'border-blue-500' 
          : 'border-green-500'
      } ${isFlashing ? 'bg-yellow-200 ring-4 ring-yellow-400 shadow-2xl scale-[1.02]' : side === 'left' ? 'bg-blue-50' : 'bg-green-50'}`}
    >
      {/* Header */}
      <div
        className={`p-4 font-bold text-white rounded-t-lg ${
          side === 'left' ? 'bg-blue-500' : 'bg-green-500'
        }`}
      >
        {side === 'left' ? '👤 Andi' : '👤 Yono'}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-8">
            Belum ada pesan
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === side ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                  msg.sender === side
                    ? side === 'left'
                      ? 'bg-blue-500 text-white'
                      : 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-800 border border-gray-300'
                }`}
              >
                <p className="break-words">{msg.text}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {formatTime(msg.timestamp)}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-300">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ketik pesan..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
              side === 'left'
                ? 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300'
                : 'bg-green-500 hover:bg-green-600 disabled:bg-green-300'
            }`}
          >
            Kirim
          </button>
        </div>
      </form>
    </div>
  );
}
