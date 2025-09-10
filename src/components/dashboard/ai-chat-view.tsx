"use client";

import { useState } from "react";
import Image from "next/image";
import { aiChatHistory, aiCompanion, currentUser } from "@/lib/data";
import type { AiChatMessage } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Send, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function AiChatView() {
  const [messages, setMessages] = useState<AiChatMessage[]>(aiChatHistory);
  const [input, setInput] = useState("");

  const conversationStarters = [
    "What's the most interesting sci-fi movie you've seen recently?",
    "Tell me a fun fact about Jazz music.",
    "Recommend a new hiking trail for me.",
  ];

  const handleSend = () => {
    if (input.trim() === "") return;

    const userMessage: AiChatMessage = {
      id: `msg-${messages.length + 1}`,
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    const aiResponse: AiChatMessage = {
      id: `msg-${messages.length + 2}`,
      sender: "ai",
      text: "That's interesting! Tell me more.", // Placeholder AI response
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage, aiResponse]);
    setInput("");
  };
  
  const handleStartConversation = (starter: string) => {
    setInput(starter);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      <div className="lg:col-span-2 flex flex-col h-full bg-card rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Avatar>
                <AvatarImage src={aiCompanion.profilePic.imageUrl} data-ai-hint={aiCompanion.profilePic.imageHint} alt={aiCompanion.name} />
                <AvatarFallback>{aiCompanion.name.charAt(0)}</AvatarFallback>
            </Avatar>
            Chat with {aiCompanion.name}
          </CardTitle>
          <CardDescription>
            Your personal AI companion, here to help you connect.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden p-0">
          <ScrollArea className="flex-1 p-6 pt-0">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-3",
                    message.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.sender === "ai" && (
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={aiCompanion.profilePic.imageUrl}
                        alt={aiCompanion.name}
                        data-ai-hint={aiCompanion.profilePic.imageHint}
                      />
                      <AvatarFallback>{aiCompanion.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-xs md:max-w-md lg:max-w-2xl rounded-2xl p-3 text-sm",
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-secondary rounded-bl-none"
                    )}
                  >
                    <p>{message.text}</p>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={currentUser.profilePic.imageUrl}
                        alt={currentUser.name}
                        data-ai-hint={currentUser.profilePic.imageHint}
                      />
                      <AvatarFallback>
                        {currentUser.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="relative">
              <Textarea
                placeholder="Type your message here..."
                className="pr-16 resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                size="icon"
                className="absolute top-1/2 right-3 -translate-y-1/2"
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>

      <div className="lg:col-span-1">
        <Card className="shadow-sm rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Conversation Starters
            </CardTitle>
            <CardDescription>
              Need a little inspiration? Try one of these.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {conversationStarters.map((starter, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => handleStartConversation(starter)}
              >
                {starter}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
