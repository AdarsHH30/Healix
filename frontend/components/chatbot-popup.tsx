"use client";

import { X, Send, AlertCircle, Sparkles } from "lucide-react";
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
      {/* Premium backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xl z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Premium Chatbot Popup */}
      <div
        className="fixed bottom-20 sm:bottom-24 sm:right-4 md:right-6 sm:left-auto sm:w-[420px] md:w-[500px] max-h-[calc(100vh-6rem)] bg-gradient-to-b from-background to-background/95 rounded-2xl sm:rounded-3xl shadow-2xl border border-border/50 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300 backdrop-blur-sm"
        style={{ maxWidth: "calc(100vw - 1.5rem)" }}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-chart-1/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-chart-2/20 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="relative z-10 bg-gradient-to-r from-chart-1/80 via-chart-2/80 to-chart-1/60 backdrop-blur-xl px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between border-b border-white/10 shadow-lg">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-chart-1 to-chart-2 rounded-full blur opacity-60 animate-pulse" />
              <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                <span className="text-lg sm:text-2xl">✨</span>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-base tracking-tight">
                Wellness Assistant
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-lg shadow-green-400/50 animate-pulse" />
                <p className="text-white/70 text-[10px] sm:text-xs font-medium">
                  Ready to help
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative group text-white/80 hover:text-white transition-all p-2 rounded-lg active:scale-95"
            aria-label="Close chatbot"
          >
            <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur" />
            <X size={20} className="sm:w-5 sm:h-5 relative" strokeWidth={2.5} />
          </button>
        </div>

        {/* Messages Container */}
        <div className="relative z-10 flex flex-col flex-1 overflow-y-auto p-4 sm:p-5 bg-gradient-to-b from-transparent via-muted/20 to-muted/30">
          <div className="space-y-4 sm:space-y-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl sm:rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 backdrop-blur-sm transition-all hover:shadow-lg ${
                    message.sender === "user"
                      ? "bg-gradient-to-br from-chart-1 to-chart-2 text-white rounded-br-none shadow-lg shadow-chart-1/30 border border-chart-1/50"
                      : message.error
                      ? "bg-destructive/15 text-destructive border border-destructive/30 rounded-bl-none shadow-lg shadow-destructive/20"
                      : "bg-gradient-to-br from-muted/80 to-muted/60 text-foreground rounded-bl-none border border-border/50 shadow-lg shadow-black/5"
                  }`}
                >
                  {message.error && (
                    <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
                      <AlertCircle
                        size={14}
                        className="sm:w-4 sm:h-4 flex-shrink-0"
                      />
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide">
                        Error
                      </span>
                    </div>
                  )}
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {message.text}
                  </p>
                  <p
                    className={`text-[10px] sm:text-xs mt-2 font-medium opacity-70 ${
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
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="bg-gradient-to-br from-muted/80 to-muted/60 rounded-2xl rounded-bl-none px-4 sm:px-5 py-3 sm:py-3.5 border border-border/50 shadow-lg shadow-black/5">
                  <div className="flex gap-2 items-center">
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                      Assistant is thinking
                    </span>
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-chart-1 rounded-full animate-bounce" />
                      <span
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-chart-1 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <span
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-chart-1 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Section */}
        <div className="relative z-10 border-t border-border/50 p-3 sm:p-4 bg-gradient-to-t from-background/80 to-background/60 backdrop-blur-sm">
          <div className="flex gap-2 sm:gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-muted/60 to-muted/40 border border-border/50 focus:outline-none focus:ring-2 focus:ring-chart-1 focus:border-transparent text-xs sm:text-sm placeholder:text-muted-foreground/60 font-medium backdrop-blur-sm transition-all hover:border-border/80 shadow-lg shadow-black/5"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-br from-chart-1 to-chart-2 text-white rounded-xl sm:rounded-2xl hover:shadow-lg hover:shadow-chart-1/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 font-bold border border-chart-1/50 flex items-center justify-center"
              aria-label="Send message"
            >
              <Send size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground/50 mt-2 font-medium">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </div>
    </>
  );
}
