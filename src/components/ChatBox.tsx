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

// Example dummy Q&A data
const initialMessages: Message[] = [
  {
    id: "1",
    role: "user",
    content: "Make a responsive navbar with logo and links",
  },
  {
    id: "2",
    role: "assistant",
    content: "Here's a simple responsive navbar using React and Tailwind CSS:",
    code: `function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex items-center py-4">
            <span className="font-bold text-xl">MyApp</span>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="py-2 px-3 hover:bg-gray-700 rounded">Home</a>
            <a href="#" className="py-2 px-3 hover:bg-gray-700 rounded">About</a>
            <a href="#" className="py-2 px-3 hover:bg-gray-700 rounded">Services</a>
            <a href="#" className="py-2 px-3 hover:bg-gray-700 rounded">Contact</a>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={\`\${isOpen ? "block" : "hidden"} md:hidden\`}>
        <div className="px-2 pt-2 pb-4 space-y-1">
          <a href="#" className="block px-3 py-2 hover:bg-gray-700 rounded">Home</a>
          <a href="#" className="block px-3 py-2 hover:bg-gray-700 rounded">About</a>
          <a href="#" className="block px-3 py-2 hover:bg-gray-700 rounded">Services</a>
          <a href="#" className="block px-3 py-2 hover:bg-gray-700 rounded">Contact</a>
        </div>
      </div>
    </nav>
  );
}`,
    language: "jsx",
  },
  {
    id: "3",
    role: "user",
    content: "Create a simple counter component",
  },
  {
    id: "4",
    role: "assistant",
    content: "Here's a simple counter component using React and Tailwind CSS:",
    code: `function Counter() {
  const [count, setCount] = useState(0);

  // Increment the counter
  function handleIncrement() {
    setCount(count + 1);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Counter App</h1>
      <p className="mb-4">Current count: {count}</p>
      <Button onClick={handleIncrement}>Increment</Button>
    </div>
  );
}`,
    language: "jsx",
  },
  {
    id: "5",
    role: "user",
    content: "Create a dark mode toggle switch",
  },
  {
    id: "6",
    role: "assistant",
    content: "Here's a simple dark mode toggle using React hooks:",
    code: `import { useState, useEffect } from 'react';

function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition-colors"
    >
      {darkMode ? (
        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}`,
    language: "jsx",
  },
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Store current input for history
    setPreviousInput(input);

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      // Simple response selection
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Here's a simple component based on your request:",
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
      setMessages((prev) => [...prev, newAiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const insertCode = (code: string) => {
    if (activeFile) {
      updateFile(activeFile.id, code);
      toast({
        title: "Code inserted",
        description: "Code has been inserted into the editor",
      });
    } else {
      toast({
        title: "No file selected",
        description: "Please select or create a file first",
        variant: "destructive",
      });
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to clipboard",
    });
  };

  const clearChat = () => {
    setMessages([]);
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
          Chat Assistant
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

                  {message.code && (
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
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => insertCode(message.code!)}
                        >
                          <ArrowUp className="h-3 w-3 mr-1" />
                          Insert
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
