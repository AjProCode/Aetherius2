import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hello! I'm your AI financial assistant. I can help you with budgeting, investments, savings goals, and answer any financial questions you have. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();

  const adviceMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest("POST", "/api/ai/financial-advice", {
        question,
        context: {
          familyId: "family-1",
          currentGoals: ["vacation", "emergency", "education"],
          budgetUsage: 82.6,
        },
      });
      return response.json();
    },
    onSuccess: (data) => {
      const assistantMessage: ChatMessage = {
        id: Date.now().toString(),
        type: "assistant",
        content: data.advice,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    adviceMutation.mutate(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Card 
        className="bg-gradient-to-br from-primary to-accent text-white cursor-pointer hover:shadow-lg transition-shadow"
        onClick={() => setIsOpen(true)}
        data-testid="ai-assistant-card"
      >
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fas fa-robot text-2xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold" data-testid="text-ai-title">AI Financial Assistant</h3>
              <p className="text-sm opacity-90" data-testid="text-ai-subtitle">Get personalized advice anytime</p>
            </div>
          </div>
          <p className="text-sm opacity-90 mb-4" data-testid="text-ai-description">
            Ask me about budgeting, investments, or any financial questions!
          </p>
          <Button
            className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/20 text-white py-3 px-4 rounded-lg font-medium transition-all"
            data-testid="button-open-ai-chat"
          >
            <i className="fas fa-message mr-2"></i>
            Start Conversation
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl h-[80vh] flex flex-col" data-testid="dialog-ai-chat">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <i className="fas fa-robot text-white text-sm"></i>
              </div>
              <span data-testid="text-dialog-title">AI Financial Assistant</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col space-y-4">
            <ScrollArea className="flex-1 pr-4" data-testid="chat-messages">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    data-testid={`message-${message.id}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {adviceMutation.isPending && (
                  <div className="flex justify-start" data-testid="typing-indicator">
                    <div className="bg-muted text-foreground p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about finances..."
                disabled={adviceMutation.isPending}
                className="flex-1"
                data-testid="input-chat-message"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || adviceMutation.isPending}
                data-testid="button-send-message"
              >
                <i className="fas fa-paper-plane"></i>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
