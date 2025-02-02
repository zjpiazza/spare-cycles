import React from "react";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bot, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
  status?: "queued" | "processing" | "completed";
  queuePosition?: number;
}

export function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      status: "completed"
    },
  ]);
  const [input, setInput] = React.useState("");
  const [totalQueueSize, setTotalQueueSize] = React.useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Simulate queue position
    const queuePosition = Math.floor(Math.random() * 3) + 1; // Random position 1-3
    setTotalQueueSize(prev => prev + queuePosition);

    const userMessage: Message = {
      role: "user",
      content: input,
      status: "completed"
    };

    const queueMessage: Message = {
      role: "assistant",
      content: `Your request is in queue. Position: ${queuePosition}`,
      status: "queued",
      queuePosition
    };

    setMessages((prev) => [...prev, userMessage, queueMessage]);
    setInput("");

    // Simulate processing after queue
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg === queueMessage 
          ? {
              role: "assistant",
              content: "I'm processing your request using the available GPU resources...",
              status: "processing"
            }
          : msg
      ));

      // Simulate completion
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.status === "processing"
            ? {
                role: "assistant",
                content: "Here's your processed response using the GPU!",
                status: "completed"
              }
            : msg
        ));
        setTotalQueueSize(prev => Math.max(0, prev - 1));
      }, 2000);
    }, 3000);
  };

  return (
    <div className="flex h-[600px] flex-col rounded-xl border bg-gray-800 shadow-xl">
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
                  <AvatarFallback>
                    <Bot className="h-5 w-5" />
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
                  <AvatarFallback>
                    <User className="h-5 w-5" />
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