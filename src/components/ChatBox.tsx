
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useEditor } from "@/contexts/EditorContext";
import { useToast } from "@/hooks/use-toast";
import { Send, ArrowUp, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  code?: string;
  language?: string;
}

// Simplified initial messages
const initialMessages: Message[] = [
  {
    id: "welcome-msg",
    content: "Hi! I'm Lovable. How can I help you today?",
    role: "assistant",
  },
];

export function ChatBox({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { activeFile, updateFile } = useEditor();
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: "I understand what you're looking for. Let me help you with that.",
        role: "assistant",
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Notify user
      toast({
        title: "Response received",
        description: "Lovable has responded to your message",
      });
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-1 py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex max-w-full mb-4",
              message.role === "assistant" ? "justify-start" : "justify-end"
            )}
          >
            <Card
              className={cn(
                "px-4 py-3 rounded-lg text-sm",
                message.role === "assistant"
                  ? "bg-muted text-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium">Lovable</span>
                </div>
              )}
              <div className="whitespace-pre-wrap">{message.content}</div>
            </Card>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
        <div className="relative">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            className="resize-none pr-12 min-h-[80px] max-h-[200px]"
            rows={3}
          />
          <Button
            type="submit"
            size="sm"
            className="absolute bottom-2 right-2"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
