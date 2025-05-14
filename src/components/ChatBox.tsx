
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useEditor } from '@/contexts/EditorContext';
import { useToast } from '@/hooks/use-toast';
import { Send, Copy, ArrowUp, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  code?: string;
  language?: string;
}

export function ChatBox({ className }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeFile, updateFile } = useEditor();
  const { toast } = useToast();
  
  // For demonstration purposes - mock responses
  const dummyResponses = [
    {
      text: "Here's a simple React component for a button:",
      code: `function Button({ children, onClick }) {
  return (
    <button 
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      onClick={onClick}
    >
      {children}
    </button>
  );
}`,
      language: 'jsx'
    },
    {
      text: "Let's create a card component with Tailwind:",
      code: `function Card({ title, description, imageUrl }) {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      {imageUrl && <img className="w-full" src={imageUrl} alt={title} />}
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
    </div>
  );
}`,
      language: 'jsx'
    },
    {
      text: "Here's some CSS for a glassy navbar:",
      code: `.navbar {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
}`,
      language: 'css'
    }
  ];
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user'
    };
    setMessages([...messages, newUserMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const randomResponse = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: randomResponse.text,
        role: 'assistant',
        code: randomResponse.code,
        language: randomResponse.language
      };
      setMessages(prev => [...prev, newAiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const insertCode = (code: string) => {
    if (activeFile) {
      updateFile(activeFile.id, code);
      toast({
        title: "Code inserted",
        description: "Code has been inserted into the editor"
      });
    } else {
      toast({
        title: "No file selected",
        description: "Please select or create a file first",
        variant: "destructive"
      });
    }
  };
  
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to clipboard"
    });
  };
  
  return (
    <div className={cn("flex flex-col h-full border-l", className, isCollapsed && "w-12")}>
      <div className="p-2 border-b flex items-center justify-between">
        <h2 className={cn("text-sm font-medium", isCollapsed && "hidden")}>Chat Assistant</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
      </div>
      
      {!isCollapsed && (
        <>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                <p>Ask me to generate code for you!</p>
                <p className="text-sm mt-2">Example: "Create a navbar with logo and links"</p>
              </div>
            ) : (
              messages.map((message) => (
                <div 
                  key={message.id} 
                  className={cn(
                    "max-w-[80%] rounded-lg p-4",
                    message.role === 'user' ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"
                  )}
                >
                  <div className="text-sm">{message.content}</div>
                  {message.code && (
                    <Card className="mt-2 overflow-hidden">
                      <div className="bg-black text-white p-2 text-xs overflow-x-auto">
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
              <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                <div className="flex gap-1">
                  <span className="animate-pulse">•</span>
                  <span className="animate-pulse delay-100">•</span>
                  <span className="animate-pulse delay-200">•</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-2 border-t">
            <div className="flex">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for code generation..."
                className="min-h-[80px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button type="submit" className="ml-2" disabled={!input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
