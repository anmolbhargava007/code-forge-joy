
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useEditor } from "@/contexts/EditorContext";
import { useToast } from "@/hooks/use-toast";
import { Send, Copy, ArrowUp, MessageCircle, Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  code?: string;
  language?: string;
}

// Example initial welcome message
const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Welcome! Ask me to generate code for you. I'll create it and automatically place it in the editor.",
  }
];

export function ChatBox({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [previousInput, setPreviousInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { activeFile, updateFile } = useEditor();
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Effect to automatically insert the latest code into the editor
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant" && lastMessage?.code && activeFile) {
      updateFile(activeFile.id, lastMessage.code);
      toast({
        title: "Code inserted",
        description: "Generated code has been inserted into the editor",
      });
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Store current input for history
    setPreviousInput(input);

    // Clear previous messages and add only the new user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    };
    setMessages([newUserMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      // Simple response generation
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Here's the code based on your request:",
        role: "assistant",
        code: `function ExampleComponent() {
  const [state, setState] = useState(false);
  
  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-2">Example Component</h2>
      <p className="text-gray-600">This is an example component based on your request.</p>
      <button 
        onClick={() => setState(!state)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {state ? 'Active' : 'Inactive'}
      </button>
    </div>
  );
}`,
        language: "jsx",
      };
      setMessages(prev => [...prev, newAiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to clipboard",
    });
  };

  const clearChat = () => {
    setMessages(initialMessages);
    toast({
      title: "Chat cleared",
      description: "All messages have been removed",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === "ArrowUp" && input === "" && previousInput) {
      e.preventDefault();
      setInput(previousInput);
    }
  };

  // Make sure the conditional rendering correctly checks isOpen state
  if (!isOpen) {
    return (
      <div className={cn("fixed bottom-4 right-4 z-50", className)}>
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col bg-white dark:bg-gray-900 border-t shadow-lg",
        className,
        isCollapsed ? "h-12" : "h-[500px]"
      )}
    >
      <div className="p-2 border-b flex items-center justify-between bg-muted/50">
        <h2 className={cn("text-sm font-medium", isCollapsed && "hidden")}>
          Code Generator
        </h2>
        <div className="flex gap-1">
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              className="h-8 w-8 text-muted-foreground"
              title="Clear chat"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
            title={isCollapsed ? "Expand chat" : "Collapse chat"}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                <p>Ask me to generate code for you!</p>
                <p className="text-sm mt-2">
                  Example: "Create a navbar with logo and links"
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col max-w-[85%] rounded-lg",
                    message.role === "user" ? "ml-auto items-end" : ""
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg p-4",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>

                  {message.code && message.role === "assistant" && (
                    <Card className="mt-2 overflow-hidden shadow-sm w-full">
                      <div className="bg-black text-white p-3 text-xs overflow-x-auto">
                        <pre>{message.code}</pre>
                      </div>
                      <div className="p-1 bg-background flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => copyCode(message.code!)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </Card>
                  )}
                </div>
              ))
            )}
            {isTyping && (
              <div className="bg-muted rounded-lg p-4 max-w-[85%]">
                <div className="flex gap-1">
                  <span className="animate-pulse">•</span>
                  <span className="animate-pulse delay-100">•</span>
                  <span className="animate-pulse delay-200">•</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 border-t bg-background">
            <div className="flex relative">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for code generation..."
                className="min-h-[60px] pr-12 resize-none rounded-md"
                onKeyDown={handleKeyDown}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-2 bottom-2"
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xs text-muted-foreground mt-2 px-2">
              Press Enter to send, Shift+Enter for new line, ↑ for previous
              prompt
            </div>
          </form>
        </>
      )}
    </div>
  );
}
