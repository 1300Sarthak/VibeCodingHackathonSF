import { Button } from "@/components/ui/button";
import { GlobeIcon, TextIcon } from "lucide-react";
import { useState, useEffect } from "react";

interface TextSelectionPopupProps {
  onSimplify: (text: string) => void;
  onTranslate: (text: string) => void;
}

export default function TextSelectionPopup({
  onSimplify,
  onTranslate,
}: TextSelectionPopupProps) {
  const [selectedText, setSelectedText] = useState("");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();

      if (selection && !selection.isCollapsed) {
        const text = selection.toString().trim();

        if (text) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          setSelectedText(text);
          setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
          });
          setVisible(true);
        } else {
          setVisible(false);
        }
      } else {
        setVisible(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".text-selection-popup")) {
        setVisible(false);
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="text-selection-popup absolute z-50 flex -translate-x-1/2 -translate-y-full flex-row items-center gap-1 rounded-md bg-white p-1 shadow-lg dark:bg-slate-800"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <Button
        size="sm"
        variant="ghost"
        className="h-8 flex items-center gap-1 text-xs rounded-md bg-slate-100 px-2 py-1 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
        onClick={() => onSimplify(selectedText)}
      >
        <TextIcon className="h-3 w-3" />
        Simplify
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 flex items-center gap-1 text-xs rounded-md bg-slate-100 px-2 py-1 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
        onClick={() => onTranslate(selectedText)}
      >
        <GlobeIcon className="h-3 w-3" />
        Translate
      </Button>
    </div>
  );
}
