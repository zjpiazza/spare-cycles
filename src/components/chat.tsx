import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bot, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  role: "user" | "assistant";
  content: string;
  status?: "queued" | "processing" | "completed";
  queuePosition?: number;
}

interface ChatProps {
  models: string[];
}

export function Chat({ models }: ChatProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      status: "completed"
    },
  ]);
  const [input, setInput] = React.useState("");
  const [totalQueueSize, setTotalQueueSize] = React.useState(0);
  const [selectedModel, setSelectedModel] = React.useState("gpt-3.5-turbo");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      status: "completed"
    };

    const pendingMessage: Message = {
      role: "assistant",
      content: "Processing your request...",
      status: "processing"
    };

    setMessages(prev => [...prev, userMessage, pendingMessage]);
    setInput("");

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages
            .filter(m => m.status === "completed")
            .map(m => ({
              role: m.role,
              content: m.content
            }))
            .concat({ role: "user" as const, content: input }),
          model: selectedModel
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      setMessages(prev => prev.map(msg => 
        msg === pendingMessage
          ? {
              role: "assistant",
              content: data.content,
              status: "completed"
            }
          : msg
      ));
    } catch (error) {
      console.error('Error calling chat API:', error);
      setMessages(prev => prev.map(msg => 
        msg === pendingMessage
          ? {
              role: "assistant",
              content: "Sorry, there was an error processing your request. Please try again.",
              status: "completed"
            }
          : msg
      ));
    }
  };

  return (
    <div className="flex h-[600px] flex-col rounded-xl border bg-gray-800 shadow-xl">
      <div className="border-b border-gray-700 p-4">
        <Select
          value={selectedModel}
          onValueChange={setSelectedModel}
        >
          <SelectTrigger className="w-[200px] bg-gray-700 border-gray-600">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {models.map((model) => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {totalQueueSize > 0 && (
        <div className="bg-blue-900/50 p-2 flex items-center justify-center gap-2 text-sm">
          <Clock className="w-4 h-4" />
          <span>Current Queue Size: {totalQueueSize}</span>
        </div>
      )}
      <ScrollArea className="h-full p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn("flex items-start gap-4", {
                "justify-end": message.role === "user",
              })}
            >
              {message.role === "assistant" && (
                <Avatar>
                  <AvatarFallback className="bg-gray-700">
                    <Bot className="h-5 w-5 text-blue-400" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "rounded-xl px-4 py-2 max-w-[80%]",
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : message.status === "queued"
                    ? "bg-yellow-500/20 text-yellow-200 border border-yellow-500/50"
                    : message.status === "processing"
                    ? "bg-blue-500/20 text-blue-200 border border-blue-500/50"
                    : "bg-gray-700 text-gray-200"
                )}
              >
                <p className="text-sm">
                  {message.content}
                  {message.status === "queued" && (
                    <span className="block text-xs mt-1 text-yellow-200/80">
                      Queue Position: {message.queuePosition}
                    </span>
                  )}
                </p>
              </div>
              {message.role === "user" && (
                <Avatar>
                  <AvatarFallback className="bg-gray-700">
                    <User className="h-5 w-5 text-blue-400" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-lg bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}