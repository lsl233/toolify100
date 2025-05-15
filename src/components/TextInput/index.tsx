import { useStore } from "@nanostores/react";
import { text, updateText } from "../../store/tokenStore";
import { useEffect, useState } from "react";

export default function TextInput() {
  const $text = useStore(text);
  const [inputText, setInputText] = useState($text);
  
  // Update the store when input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    updateText(newText);
  };

  // Clear the text input
  const handleClear = () => {
    setInputText("");
    updateText("");
  };

  // Update local state if store changes externally
  useEffect(() => {
    setInputText($text);
  }, [$text]);

  // Handle template selection from the document
  useEffect(() => {
    const handleTemplateSelected = (e: any) => {
      const content = e.detail?.content;
      if (content) {
        setInputText(content);
        updateText(content);
      }
    };

    document.addEventListener('template-selected', handleTemplateSelected);
    
    return () => {
      document.removeEventListener('template-selected', handleTemplateSelected);
    };
  }, []);

  return (
    <div className="mb-4">
      <div className="relative bg-white rounded-lg shadow-md border border-stone-200">
        <textarea
          id="text-input"
          placeholder="在此粘贴或输入您的文本..."
          className="w-full min-h-[200px] p-4 text-stone-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y"
          value={inputText}
          onChange={handleInputChange}
        />
        <button
          id="clear-button"
          className={`absolute top-3 right-3 p-1.5 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-500 hover:text-stone-700 transition-colors ${!inputText ? 'hidden' : ''}`}
          aria-label="清除文本"
          onClick={handleClear}
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-3 h-0.5 bg-current absolute rotate-45"></div>
            <div className="w-3 h-0.5 bg-current absolute -rotate-45"></div>
          </div>
        </button>
      </div>
    </div>
  );
} 