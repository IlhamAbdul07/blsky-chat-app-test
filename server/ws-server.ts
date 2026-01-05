import { WebSocketServer, WebSocket } from 'ws';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

const PORT = 8080;
const MESSAGES_FILE = path.join(__dirname, 'messages.json');

interface Message {
  id: string;
  sender: 'left' | 'right';
  text: string;
  timestamp: number;
}

// Load messages from file
function loadMessages(): Message[] {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const data = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading messages:', error);
  }
  return [];
}

// Save messages to file
function saveMessages(messages: Message[]): void {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving messages:', error);
  }
}

// Initialize messages storage
let messages: Message[] = loadMessages();

// Create WebSocket server
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server started on ws://localhost:${PORT}`);

// Broadcast to all connected clients
function broadcast(data: any, sender?: WebSocket): void {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== sender) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on('connection', (ws: WebSocket) => {
  console.log('New client connected');

  // Send all existing messages to the new client
  ws.send(JSON.stringify({
    type: 'init',
    messages: messages
  }));

  ws.on('message', (data: Buffer) => {
    try {
      const payload = JSON.parse(data.toString());

      if (payload.type === 'message') {
        const newMessage: Message = {
          id: randomUUID(),
          sender: payload.sender,
          text: payload.text,
          timestamp: Date.now()
        };

        messages.push(newMessage);
        saveMessages(messages);

        // Broadcast to all clients including sender
        const response = {
          type: 'new_message',
          message: newMessage
        };

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(response));
          }
        });
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down WebSocket server...');
  wss.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});
