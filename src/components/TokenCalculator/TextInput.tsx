import { useStore } from "@nanostores/react";
import { text, updateText } from "../../store/tokenStore";

export default function TextInput() {
  const textValue = useStore(text);
  
  // Update the store when input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    // setInputText(newText);
    updateText(newText);
  };

  // Clear the text input
  const handleClear = () => {
    // setInputText("");
    updateText("");
  };

  return (
    <div className="mb-4">
      <div className="relative bg-white rounded-lg shadow-md border border-stone-200">
        <textarea
          id="text-input"
          placeholder="Paste or enter your text here..."
          className="w-full min-h-[200px] block py-4 pl-4 pr-12 text-stone-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y"
          value={textValue}
          onChange={handleInputChange}
        />
        <button
          id="clear-button"
          className={`absolute top-4 right-4 p-1.5 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-500 hover:text-stone-700 transition-colors ${!textValue ? 'hidden' : ''}`}
          aria-label="Clear text"
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