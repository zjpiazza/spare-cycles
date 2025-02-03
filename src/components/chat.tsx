'use client';

import { useState, useEffect } from 'react';
import { Send, User, Bot, WifiOff } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  models: string[];
}

export function Chat({ models }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(models[0] || '');
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch('/api/health');
        if (!response.ok) {
          setIsOffline(true);
          return;
        }
        setIsOffline(false);
      } catch (error) {
        console.error('Health check failed:', error);
        setIsOffline(true);
      }
    }
    
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isOffline) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-gray-800 rounded-xl">
        <div className="bg-gray-700 p-8 rounded-xl text-center">
          <WifiOff className="w-16 h-16 text-red-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold text-red-500 mb-2">Chat Offline</h2>
          <p className="text-gray-400">The chat service is currently unavailable. Please try again later.</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const assistantMessage: Message = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, assistantMessage]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }
      
      // Create a new TextDecoder for UTF-8
      const decoder = new TextDecoder();
      let buffer = ''; // Buffer for incomplete chunks

      // Get the response as a stream
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and combine with any buffered text
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Update the last message with the complete text
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          lastMessage.content = buffer;
          return newMessages;
        });
      }

      // Final decode to catch any remaining bytes
      const finalChunk = decoder.decode();
      if (finalChunk) {
        buffer += finalChunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          lastMessage.content = buffer;
          return newMessages;
        });
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.slice(0, -1)); // Remove the empty assistant message
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-800 rounded-xl h-[600px] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Chat</h2>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="bg-gray-700 rounded px-3 py-1"
          >
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-100'
                }`}
              >
                {message.content || (isLoading && index === messages.length - 1 ? '...' : '')}
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 rounded-lg px-4 py-2 flex items-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}