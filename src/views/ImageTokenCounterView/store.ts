import { atom, computed } from 'nanostores';
import type { SupportedModel } from '@/lib/imageTokenCalculator';

export interface AIModel {
  model: string;
  provider: string;
  context: string;
  inputPriceRate: number;
  inputCachedPriceRate: number;
  outputPriceRate: number;
  inputPrice: number;
  inputCachedPrice: number;
  outputPrice: number;
  imageTokens: number;
  visionModel?: SupportedModel;
  imagePriceRate?: number; // 图片token的价格率
  isEstimated?: boolean;
}

const initialModels: AIModel[] = [
  {
    model: "GPT-4.1",
    provider: "OpenAI",
    context: "text",
    inputPriceRate: 2,
    inputCachedPriceRate: 0.5,
    outputPriceRate: 8,
    inputPrice: 0,
    inputCachedPrice: 0,
    outputPrice: 0,
    visionModel: "gpt-4-vision-preview",
    imagePriceRate: 8.5,
    imageTokens: 0
  },
  {
    model: "GPT-4.1 mini",
    provider: "OpenAI",
    context: "text",
    inputPriceRate: 0.4,
    inputCachedPriceRate: 0.1,
    outputPriceRate: 1.6,
    inputPrice: 0,
    inputCachedPrice: 0,
    outputPrice: 0,
    visionModel: "gpt-4-vision-preview-mini",
    imagePriceRate: 3.4,
    imageTokens: 0
  },
  {
    model: "GPT-4.1 nano",
    provider: "OpenAI",
    context: "text",
    inputPriceRate: 0.1,
    inputCachedPriceRate: 0.025,
    outputPriceRate: 0.4,
    inputPrice: 0,
    inputCachedPrice: 0,
    outputPrice: 0,
    visionModel: "gpt-4-vision-preview-nano",
    imagePriceRate: 0.85,
    imageTokens: 0
  },
  {
    model: "Claude-3 Opus",
    provider: "Anthropic",
    context: "text",
    inputPriceRate: 10,
    inputCachedPriceRate: 2.5,
    outputPriceRate: 40,
    inputPrice: 0,
    inputCachedPrice: 0,
    outputPrice: 0,
    visionModel: "claude-3-opus",
    imagePriceRate: 15,
    imageTokens: 0
  },
  {
    model: "Claude-3 Sonnet",
    provider: "Anthropic",
    context: "text",
    inputPriceRate: 1.1,
    inputCachedPriceRate: 0.275,
    outputPriceRate: 4.4,
    inputPrice: 0,
    inputCachedPrice: 0,
    outputPrice: 0,
    visionModel: "claude-3-sonnet",
    imagePriceRate: 3,
    imageTokens: 0
  },
  {
    model: "Gemini Pro",
    provider: "Google",
    context: "text",
    inputPriceRate: 0.075,
    inputCachedPriceRate: 0.019,
    outputPriceRate: 0.3,
    inputPrice: 0,
    inputCachedPrice: 0,
    outputPrice: 0,
    visionModel: "gemini-pro-vision",
    imagePriceRate: 1.0,
    imageTokens: 0,
    isEstimated: true
  },
  {
    model: "Gemini 2.0 Flash",
    provider: "Google",
    context: "1M",
    inputPriceRate: 0.1,
    inputCachedPriceRate: 0,
    outputPriceRate: 0.4,
    inputPrice: 0,
    inputCachedPrice: 0,
    outputPrice: 0,
    imagePriceRate: 1.0,
    visionModel: "gemini-pro-vision",
    imageTokens: 0,
  },
  {
    model: "Gemini 1.5 Pro",
    provider: "Google",
    context: "1M",
    inputPriceRate: 12.5,
    inputCachedPriceRate: 0,
    outputPriceRate: 5,
    inputPrice: 0,
    inputCachedPrice: 0,
    outputPrice: 0,
    imagePriceRate: 1.0,
    visionModel: "gemini-pro-vision",
    imageTokens: 0,
  },
  {
    model: "Gemini 1.5 Flash",
    provider: "Google",
    context: "1M",
    inputPriceRate: 0.075,
    inputCachedPriceRate: 0,
    outputPriceRate: 0.3,
    inputPrice: 0,
    inputCachedPrice: 0,
    outputPrice: 0,
    imagePriceRate: 1.0,
    visionModel: "gemini-pro-vision",
    imageTokens: 0,
  },
  {
    model: "Gemini 1.0 Pro",
    provider: "Google",
    context: "32K",
    inputPriceRate: 0.5,
    inputCachedPriceRate: 0,
    outputPriceRate: 1.5,
    inputPrice: 0,
    inputCachedPrice: 0,
    outputPrice: 0,
    imagePriceRate: 1.0,
    visionModel: "gemini-pro-vision",
    imageTokens: 0,
  },
  {
    model: "Deepseek chat STANDARD",
    provider: "Deepseek",
    context: "64K",
    inputPriceRate: 0.27,
    inputCachedPriceRate: 0.07,
    outputPriceRate: 1.10,
    inputPrice: 0,
    inputCachedPrice: 0,
    outputPrice: 0,
    imagePriceRate: 1.0,
    imageTokens: 0,
  },
  {
    model: "Deepseek chat DISCOUNT",
    provider: "Deepseek",
    context: "64K",
    inputPriceRate: 0.135,
    inputCachedPriceRate: 0.035,
    outputPriceRate: 0.550,
    inputPrice: 0,
    inputCachedPrice: 0,
    outputPrice: 0,
    imagePriceRate: 1.0,
    imageTokens: 0,
  },
  {
    model: "Deepseek reasoner STANDARD",
    provider: "Deepseek",
    context: "64K",
    inputPriceRate: 0.55,
    inputCachedPriceRate: 0.14,
    outputPriceRate: 2.19,
    inputPrice: 0,
    inputCachedPrice: 0,
    outputPrice: 0,
    imagePriceRate: 1.0,
    imageTokens: 0,
  },
  {
    model: "Deepseek reasoner DISCOUNT",
    provider: "Deepseek",
    context: "64K",
    inputPriceRate: 0.135,
    inputCachedPriceRate: 0.035,
    outputPriceRate: 0.550,
    inputPrice: 0,
    inputCachedPrice: 0,
    outputPrice: 0,
    imagePriceRate: 1.0,
    imageTokens: 0,
  }
];

// 文本 token 计数
export const $tokenCount = atom(0);

// AI 模型数据
export const $aiModels = atom<AIModel[]>(initialModels);

// 更新文本 token 计数
export const updateTokenCount = (newTokenCount: number) => {
  $tokenCount.set(newTokenCount);
  updateModelPrices();
};

// 重置文本 token 计数
export const resetTokenCount = () => {
  $tokenCount.set(0);
  updateModelPrices();
};

// 更新图片 token
export const updateImageTokens = (modelTokens: Record<SupportedModel, number>) => {
  const models = $aiModels.get();
  const updatedModels = models.map(model => ({
    ...model,
    imageTokens: model.visionModel ? modelTokens[model.visionModel] : 0
  }));

  $aiModels.set(updatedModels);
  updateModelPrices(); // 更新图片token后重新计算价格
};

// 更新模型价格
const updateModelPrices = () => {
  // const tokenCount = $tokenCount.get();
  const models = $aiModels.get();
  const updatedModels = models.map(model => {
    const tokenCount = model.imageTokens
    // 计算文本token的价格
    const textInputPrice = model.inputPriceRate * tokenCount / 1000000;
    const textInputCachedPrice = model.inputCachedPriceRate * tokenCount / 1000000;
    const textOutputPrice = model.outputPriceRate * tokenCount / 1000000;

    // 计算图片token的价格（如果有）
    const imagePrice = model.imageTokens && model.imagePriceRate
      ? (model.imageTokens * model.imagePriceRate / 1000000)
      : 0;

    return {
      ...model,
      // 总价格 = 文本价格 + 图片价格
      inputPrice: textInputPrice + imagePrice,
      inputCachedPrice: textInputCachedPrice,
      outputPrice: textOutputPrice,
    };
  });
  $aiModels.set(updatedModels);
};