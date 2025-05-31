import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BuildingIcon, GlobeIcon, MinimizeIcon, XIcon } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
  onMinimize: () => void;
  simplifyLanguage: boolean;
  onToggleSimplify: () => void;
  translateToSpanish: boolean;
  onToggleTranslate: () => void;
}

export default function ChatHeader({
  onClose,
  onMinimize,
  simplifyLanguage,
  onToggleSimplify,
  translateToSpanish,
  onToggleTranslate,
}: ChatHeaderProps) {
  return (
    <div className="flex flex-col border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <BuildingIcon className="h-4 w-4" />
          </div>
          <h2 className="text-md font-semibold text-slate-800 dark:text-slate-100">
            GhostGov Assistant
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMinimize}
            className="h-8 w-8 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <MinimizeIcon className="h-4 w-4" />

            <span className="sr-only">Minimize</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <XIcon className="h-4 w-4" />

            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-800/50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Switch
                  id="simplify"
                  checked={simplifyLanguage}
                  onCheckedChange={onToggleSimplify}
                  className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
                />

                <label
                  htmlFor="simplify"
                  className="cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  Simplify Language
                </label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Make responses easier to understand</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <GlobeIcon className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />

                <Switch
                  id="translate"
                  checked={translateToSpanish}
                  onCheckedChange={onToggleTranslate}
                  className="data-[state=checked]:bg-blue-600 dark:data-[state=checked]:bg-blue-500"
                />

                <label
                  htmlFor="translate"
                  className="cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  Español
                </label>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Translate responses to Spanish</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
