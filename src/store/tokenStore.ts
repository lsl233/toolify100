import { atom, computed } from 'nanostores';
import { getEncoding } from 'js-tiktoken';

// Text statistics interface
export interface TextStats {
  text: string;
  tokens: number | undefined;
  words: number;
  charsWithSpaces: number;
  charsWithoutSpaces: number;
}

// Store state structure
interface TokenState {
  text: string;
  manualTokenCount: number | undefined;
}

// Initialize the token state atom
const tokenState = atom<TokenState>({
  text: "",
  manualTokenCount: undefined
});

// Tiktoken initialization (lazy loading)
let tokenEncoder: any = undefined;
try {
  tokenEncoder = getEncoding("cl100k_base");
} catch (error) {
  console.error("Failed to load tiktoken encoder:", error);
}

// Text statistics computed from the state
export const textStats = computed(tokenState, (state) => {
  const { text: textValue, manualTokenCount } = state;
  
  // If manual token count is set, use it
  if (manualTokenCount !== undefined) {
    return {
      text: textValue,
      tokens: manualTokenCount,
      words: calculateWords(textValue),
      charsWithSpaces: textValue.length,
      charsWithoutSpaces: textValue.replace(/\s/g, "").length
    } as TextStats;
  }
  
  // Otherwise calculate from text
  if (!textValue) {
    return {
      text: "",
      tokens: undefined,
      words: 0,
      charsWithSpaces: 0,
      charsWithoutSpaces: 0
    } as TextStats;
  }

  const tokens = calculateTokens(textValue);
  const words = calculateWords(textValue);
  
  return {
    text: textValue,
    tokens,
    words,
    charsWithSpaces: textValue.length,
    charsWithoutSpaces: textValue.replace(/\s/g, "").length
  } as TextStats;
});

// Maintain backward compatibility with text atom
export const text = computed(tokenState, state => state.text);

// Calculate token count from text
function calculateTokens(textValue: string): number {
  if (!textValue) return 0;

  if (tokenEncoder) {
    try {
      const encoded = tokenEncoder.encode(textValue);
      return encoded.length;
    } catch (error) {
      console.error("Error encoding text with tiktoken:", error);
    }
  }
  
  // Fallback calculation if tokenEncoder fails
  const chineseChars = (textValue.match(/[\u4e00-\u9fa5]/g) || []).length;
  const nonChineseChars = textValue.length - chineseChars;
  return Math.ceil(chineseChars * 1.5 + nonChineseChars * 0.25);
}

// Calculate word count
function calculateWords(textValue: string): number {
  if (!textValue) return 0;
  const chineseChars = (textValue.match(/[\u4e00-\u9fa5]/g) || []).length;
  const nonChineseWords = textValue.trim().split(/\s+/).filter(Boolean).length;
  return chineseChars + nonChineseWords;
}

// Update text content
export const updateText = (newText: string) => {
  tokenState.set({
    text: newText,
    manualTokenCount: undefined // Reset manual count when text is updated
  });
};

// Directly update token count
export const updateTokenCount = (tokenCount: number) => {
  tokenState.set({
    text: "",
    manualTokenCount: tokenCount
  });
};

// Reset both text and token count
export const resetTokens = () => {
  tokenState.set({
    text: "",
    manualTokenCount: undefined
  });
};
