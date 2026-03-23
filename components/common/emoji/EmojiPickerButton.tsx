'use client';

import { useState, useRef, useEffect } from 'react';
import EmojiPicker, { type EmojiClickData, Theme } from 'emoji-picker-react';
import { useDarkMode } from '@/lib/use-dark-mode';

interface EmojiPickerButtonProps {
  onEmojiSelect: (emoji: string) => void;
  selectedEmoji?: string;
}

export function EmojiPickerButton({ onEmojiSelect, selectedEmoji = '✨' }: EmojiPickerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useDarkMode();

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji);
    setIsOpen(false);
  };

  return (
    <div ref={pickerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full border border-border bg-background hover:bg-muted transition-colors flex items-center justify-center text-xl"
        aria-label="选择表情"
      >
        {selectedEmoji}
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 z-50">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
            lazyLoadEmojis
            searchPlaceholder="搜索表情..."
            width={300}
            height={400}
          />
        </div>
      )}
    </div>
  );
}