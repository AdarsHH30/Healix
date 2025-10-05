"use client";

import { X, Send, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { sendChatbotQuery } from "@/lib/chatbot-api";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  sources?: string[];
  error?: boolean;
}

interface ChatbotPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatbotPopup({ isOpen, onClose }: ChatbotPopupProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your wellness assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentQuery = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      // Call the RAG backend API
      const response = await sendChatbotQuery(currentQuery);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.answer,
        sender: "bot",
        timestamp: new Date(),
        sources: response.sources,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      // Handle errors gracefully
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          error instanceof Error
            ? `I'm sorry, I encountered an error: ${error.message}. Please make sure the chatbot backend is running.`
            : "I'm sorry, I encountered an unexpected error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        error: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Chatbot Popup */}
      <div className="fixed inset-x-3 bottom-20 sm:bottom-24 sm:right-4 md:right-6 sm:left-auto sm:w-[420px] md:w-[500px] h-[calc(100vh-6rem)] sm:h-[600px] md:h-[700px] bg-background rounded-xl sm:rounded-2xl shadow-2xl border border-border z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-chart-1 to-chart-2 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-lg sm:text-xl">🤖</span>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm sm:text-base">
                Wellness Assistant
              </h3>
              <p className="text-white/80 text-[10px] sm:text-xs">Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-white transition-colors p-2 hover:bg-white/20 bg-white/10 rounded-lg active:scale-95"
            aria-label="Close chatbot"
          >
            <X size={20} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-muted/20">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 ${
                  message.sender === "user"
                    ? "bg-chart-1 text-white rounded-br-sm"
                    : message.error
                    ? "bg-destructive/10 text-destructive border border-destructive/20 rounded-bl-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                }`}
              >
                {message.error && (
                  <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                    <AlertCircle size={14} className="sm:w-4 sm:h-4" />
                    <span className="text-[10px] sm:text-xs font-semibold">
                      Error
                    </span>
                  </div>
                )}
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>
                <p
                  className={`text-[10px] sm:text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-white/60"
                      : message.error
                      ? "text-destructive/60"
                      : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-xl sm:rounded-2xl rounded-bl-sm px-3 sm:px-4 py-2.5 sm:py-3">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                  <span
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  />
                  <span
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-muted-foreground/40 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-3 sm:p-4 bg-background">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-chart-1 text-xs sm:text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-chart-1 text-white rounded-lg sm:rounded-xl hover:bg-chart-1/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              aria-label="Send message"
            >
              <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
