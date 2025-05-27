import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, BookOpen, GraduationCap, Globe, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { n8nService } from "@/utils/n8nService";
import { useToast } from "@/hooks/use-toast";
import N8nConfigDialog from "@/components/N8nConfigDialog";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface FAQ {
  question: string;
  answer: string;
  icon: React.ReactNode;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const faqs: FAQ[] = [
    {
      question: "How do I apply for scholarships?",
      answer: "Scholarship applications typically require academic transcripts, letters of recommendation, and a personal statement. Check with the financial aid office for specific deadlines and requirements.",
      icon: <GraduationCap className="w-5 h-5" />
    },
    {
      question: "What is the Erasmus program?",
      answer: "Erasmus is a European Union student exchange program that allows you to study at partner universities for 3-12 months, earning credits toward your degree.",
      icon: <Globe className="w-5 h-5" />
    },
    {
      question: "What are the application deadlines?",
      answer: "Application deadlines vary by program. Generally, fall semester applications are due March-May, and spring semester applications are due October-November.",
      icon: <FileText className="w-5 h-5" />
    },
    {
      question: "How do I check my academic progress?",
      answer: "You can track your academic progress through the student portal, where you'll find your transcript, completed credits, and degree requirements list.",
      icon: <BookOpen className="w-5 h-5" />
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const webhookUrl = n8nService.getWebhookUrl();
    if (!webhookUrl) {
      toast({
        title: "n8n is not configured",
        description: "Please configure the n8n webhook from the settings button",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await n8nService.sendQuestionToN8n(input.trim());
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting n8n response:', error);
      toast({
        title: "n8n Connection Error",
        description: error.message || "Failed to connect to n8n webhook. Please check your configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFaqClick = async (faq: FAQ) => {
    const faqMessage: Message = {
      id: Date.now().toString(),
      content: faq.question,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, faqMessage]);
    setIsLoading(true);

    try {
      if (n8nService.getWebhookUrl()) {
        const response = await n8nService.sendQuestionToN8n(faq.question);
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: faq.answer,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Error getting FAQ response:', error);
    } finally {
      setIsLoading(false);
      setIsFaqOpen(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full bg-card rounded-lg border shadow-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-semibold">Chat Assistant</h2>
          <N8nConfigDialog />
        </div>

        {/* FAQ Section */}
        <Card className="mx-4 mt-4 bg-background/60 backdrop-blur-sm border">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors rounded-lg"
            onClick={() => setIsFaqOpen(!isFaqOpen)}
          >
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Frequently Asked Questions</h2>
            </div>
            {isFaqOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
          
          {isFaqOpen && (
            <div className="border-t">
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-3 bg-background/60 rounded-lg border hover:bg-accent/60 cursor-pointer transition-all hover:scale-[1.02]"
                    onClick={() => handleFaqClick(faq)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-primary mt-1">
                        {faq.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{faq.question}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="resize-none"
              rows={1}
              disabled={isLoading}
            />
            <Button
              onClick={handleSubmit}
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}