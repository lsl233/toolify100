import { atom, computed } from 'nanostores';
import { getEncoding } from 'js-tiktoken';

// Text statistics interface
export interface TextStats {
  text: string;
  tokens: number;
  words: number;
  charsWithSpaces: number;
  charsWithoutSpaces: number;
}

// Text content atom
export const text = atom<string>("");

// Tiktoken initialization (lazy loading)
let tokenEncoder: any = null;
try {
  tokenEncoder = getEncoding("cl100k_base");
} catch (error) {
  console.error("Failed to load tiktoken encoder:", error);
}

// Text statistics computed from the text content
export const textStats = computed(text, (textValue) => {
  if (!textValue) {
    return {
      text: "",
      tokens: 0,
      words: 0,
      charsWithSpaces: 0,
      charsWithoutSpaces: 0
    } as TextStats;
  }

  // Calculate token count using tiktoken if available
  let tokens = 0;
  if (tokenEncoder) {
    try {
      const encoded = tokenEncoder.encode(textValue);
      tokens = encoded.length;
    } catch (error) {
      console.error("Error encoding text with tiktoken:", error);
      // Fallback to estimation if tiktoken fails
      const chineseChars = (textValue.match(/[\u4e00-\u9fa5]/g) || []).length;
      const nonChineseChars = textValue.length - chineseChars;
      tokens = Math.ceil(chineseChars * 1.5 + nonChineseChars * 0.25);
    }
  } else {
    // Use estimation if tiktoken is not available
    const chineseChars = (textValue.match(/[\u4e00-\u9fa5]/g) || []).length;
    const nonChineseChars = textValue.length - chineseChars;
    tokens = Math.ceil(chineseChars * 1.5 + nonChineseChars * 0.25);
  }

  // Count words (Chinese characters as words + space-separated words)
  const chineseChars = (textValue.match(/[\u4e00-\u9fa5]/g) || []).length;
  const nonChineseWords = textValue.trim().split(/\s+/).filter(Boolean).length;
  const words = chineseChars + nonChineseWords;
  
  // Calculate character counts
  const charsWithSpaces = textValue.length;
  const charsWithoutSpaces = textValue.replace(/\s/g, "").length;

  return {
    text: textValue,
    tokens,
    words,
    charsWithSpaces,
    charsWithoutSpaces
  } as TextStats;
});

// Update function
export const updateText = (newText: string) => {
    text.set(newText);
}