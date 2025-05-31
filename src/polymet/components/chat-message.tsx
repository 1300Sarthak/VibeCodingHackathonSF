import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { PaperclipIcon } from "lucide-react";

export interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp?: string;
  links?: Array<{
    text: string;
    url: string;
  }>;
}

export default function ChatMessage({
  message,
  isBot,
  timestamp,
  links,
}: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full gap-3 py-2",
        isBot ? "justify-start" : "justify-end"
      )}
    >
      {isBot && (
        <Avatar className="h-8 w-8 bg-blue-100 dark:bg-blue-900">
          <AvatarImage src="https://github.com/polymet-ai.png" />

          <AvatarFallback className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <PaperclipIcon className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1 rounded-lg px-4 py-2 text-sm",
          isBot
            ? "bg-blue-50 text-slate-800 dark:bg-blue-900/50 dark:text-slate-100"
            : "bg-blue-600 text-white dark:bg-blue-700"
        )}
      >
        <p className="whitespace-pre-wrap">{message}</p>
        {links && links.length > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-block rounded-md px-2 py-1 text-xs font-medium underline",
                  isBot
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700"
                    : "bg-blue-500 text-white hover:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-500"
                )}
              >
                {link.text}
              </a>
            ))}
          </div>
        )}
        {timestamp && (
          <span className="mt-1 text-right text-xs opacity-70">
            {timestamp}
          </span>
        )}
      </div>
      {!isBot && (
        <Avatar className="h-8 w-8 bg-blue-600 dark:bg-blue-700">
          <AvatarFallback className="bg-blue-600 text-white dark:bg-blue-700">
            U
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
