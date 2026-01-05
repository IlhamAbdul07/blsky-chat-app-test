export interface Message {
  id: string;
  sender: 'left' | 'right';
  text: string;
  timestamp: number;
}

export interface WSMessage {
  type: 'init' | 'new_message' | 'message';
  messages?: Message[];
  message?: Message;
  sender?: 'left' | 'right';
  text?: string;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number = 3000;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageHandlers: Set<(message: WSMessage) => void> = new Set();

  constructor(url: string = 'ws://localhost:8080') {
    this.url = url;
  }

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const data: WSMessage = JSON.parse(event.data);
          this.messageHandlers.forEach(handler => handler(data));
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectTimeout) {
      return;
    }

    this.reconnectTimeout = setTimeout(() => {
      console.log('Attempting to reconnect...');
      this.connect();
    }, this.reconnectInterval);
  }

  sendMessage(sender: 'left' | 'right', text: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'message',
        sender,
        text
      }));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  onMessage(handler: (message: WSMessage) => void): () => void {
    this.messageHandlers.add(handler);
    
    // Return unsubscribe function
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
