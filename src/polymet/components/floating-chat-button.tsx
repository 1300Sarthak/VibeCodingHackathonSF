import { Button } from "@/components/ui/button";
import { MessageSquareIcon, XIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FloatingChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
}

export default function FloatingChatButton({
  isOpen,
  onClick,
  unreadCount = 0,
}: FloatingChatButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  // Animate the button when there are unread messages
  useEffect(() => {
    if (unreadCount > 0 && !isOpen) {
      const pulseInterval = setInterval(() => {
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 1000);
      }, 3000);

      return () => clearInterval(pulseInterval);
    }
  }, [unreadCount, isOpen]);

  // Animate the button when it's clicked
  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      onClick();
    }, 300);
  };

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300",
        "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600",
        isAnimating && "scale-90",
        isPulsing && "animate-pulse",
        isOpen && "rotate-90"
      )}
    >
      {isOpen ? (
        <XIcon className="h-6 w-6" />
      ) : (
        <>
          <MessageSquareIcon className="h-6 w-6" />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </>
      )}
    </Button>
  );
}
