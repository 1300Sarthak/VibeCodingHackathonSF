import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import ChatHeader from "@/polymet/components/chat-header";
import ChatInput from "@/polymet/components/chat-input";
import ChatMessage from "@/polymet/components/chat-message";
import FloatingChatButton from "@/polymet/components/floating-chat-button";
import TextSelectionPopup from "@/polymet/components/text-selection-popup";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: string;
  links?: Array<{
    text: string;
    url: string;
  }>;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm GhostGov Assistant. How can I help you with government services today?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [simplifyLanguage, setSimplifyLanguage] = useState(false);
  const [translateToSpanish, setTranslateToSpanish] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Reset unread count when chat is opened
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      let botResponse: Message;

      if (
        content.toLowerCase().includes("california") ||
        content.toLowerCase().includes("moved")
      ) {
        botResponse = {
          id: Date.now().toString(),
          content: translateToSpanish
            ? "Ya que estás en California, deberás actualizar tus registros del DMV. También deberías registrarte para votar y actualizar tu dirección con USPS."
            : simplifyLanguage
              ? "Since you moved to California, you need to: 1) Update your address at DMV, 2) Register to vote, and 3) Tell USPS your new address."
              : "Since you're in California, you'll want to update your DMV records. You should also register to vote and update your address with USPS.",
          isBot: true,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          links: [
            {
              text: translateToSpanish
                ? "Actualizar dirección en DMV"
                : "Update Address at DMV",
              url: "#",
            },
            {
              text: translateToSpanish
                ? "Registrarse para votar"
                : "Register to Vote",
              url: "#",
            },
            {
              text: translateToSpanish
                ? "Cambio de dirección USPS"
                : "USPS Change of Address",
              url: "#",
            },
          ],
        };
      } else {
        botResponse = {
          id: Date.now().toString(),
          content: translateToSpanish
            ? "¿Puedes proporcionar más detalles sobre lo que necesitas? Estoy aquí para ayudarte con servicios gubernamentales."
            : simplifyLanguage
              ? "Can you tell me more about what you need? I'm here to help with government services."
              : "Could you provide more details about what you're looking for? I'm here to assist you with government services and information.",
          isBot: true,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
      }

      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);

      // If chat is closed, increment unread count
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    }, 1500);
  };

  const handleSimplifyText = (text: string) => {
    handleSendMessage(`Can you simplify this: "${text}"`);
  };

  const handleTranslateText = (text: string) => {
    handleSendMessage(`Can you translate this to Spanish: "${text}"`);
  };

  return (
    <>
      <FloatingChatButton
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        unreadCount={unreadCount}
      />

      <div
        className={cn(
          "fixed bottom-24 right-6 z-40 flex w-[380px] flex-col rounded-lg bg-white shadow-xl transition-all duration-300 dark:bg-slate-900",
          "border border-slate-200 dark:border-slate-700",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8 pointer-events-none"
        )}
        style={{ height: "calc(100vh - 180px)", maxHeight: "600px" }}
      >
        <ChatHeader
          onClose={() => setIsOpen(false)}
          onMinimize={() => setIsOpen(false)}
          simplifyLanguage={simplifyLanguage}
          onToggleSimplify={() => setSimplifyLanguage(!simplifyLanguage)}
          translateToSpanish={translateToSpanish}
          onToggleTranslate={() => setTranslateToSpanish(!translateToSpanish)}
        />

        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isBot={message.isBot}
              timestamp={message.timestamp}
              links={message.links}
            />
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 py-2">
              <div className="h-8 w-8 flex-shrink-0 rounded-full bg-blue-100 dark:bg-blue-900"></div>
              <div className="flex gap-1">
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-blue-400 dark:bg-blue-500"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-blue-400 dark:bg-blue-500"
                  style={{ animationDelay: "300ms" }}
                ></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-blue-400 dark:bg-blue-500"
                  style={{ animationDelay: "600ms" }}
                ></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>

      <TextSelectionPopup
        onSimplify={handleSimplifyText}
        onTranslate={handleTranslateText}
      />
    </>
  );
}
