import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Send, Bot, User } from "lucide-react";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI financial assistant. I can help you track expenses, create budgets, suggest investments, and answer questions about your finances. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: input }
    ];

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on your spending patterns, I recommend setting aside 20% of your income for savings.",
        "I've analyzed your transactions and found you could save ₹500/month by reducing dining out expenses.",
        "Your investment portfolio is well-balanced. Consider diversifying with index funds for long-term growth.",
        "I notice you're approaching your monthly budget limit. Would you like some tips to stay on track?",
      ];
      
      setMessages([
        ...newMessages,
        { 
          role: 'assistant', 
          content: responses[Math.floor(Math.random() * responses.length)]
        }
      ]);
    }, 1000);

    setMessages(newMessages);
    setInput('');
  };

  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Chat with Your
            <span className="bg-gradient-primary bg-clip-text text-transparent"> AI Assistant</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Get instant answers, advice, and insights about your finances
          </p>
        </div>

        <Card className="p-6 bg-gradient-card border-border/50">
          <div className="h-[500px] flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="w-8 h-8 bg-gradient-primary flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="w-8 h-8 bg-accent flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </Avatar>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your finances..."
                className="flex-1"
              />
              <Button onClick={handleSend} className="px-6">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-start gap-2"
            onClick={() => setInput("How much did I spend on food this month?")}
          >
            <span className="font-semibold">Quick Question</span>
            <span className="text-sm text-muted-foreground">How much did I spend on food?</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-start gap-2"
            onClick={() => setInput("Create a budget for next month")}
          >
            <span className="font-semibold">Budget Planning</span>
            <span className="text-sm text-muted-foreground">Help me create a budget</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-start gap-2"
            onClick={() => setInput("Suggest investment opportunities")}
          >
            <span className="font-semibold">Investment Tips</span>
            <span className="text-sm text-muted-foreground">Show me investment options</span>
          </Button>
        </div>
      </div>
    </section>
  );
};
