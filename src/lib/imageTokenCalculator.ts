// 定义支持的模型类型
export type SupportedModel = 
  | 'gpt-4-vision-preview' 
  | 'gpt-4-vision-preview-mini' 
  | 'gpt-4-vision-preview-nano'
  | 'claude-3-opus' 
  | 'claude-3-sonnet'
  | 'gemini-pro-vision';

// 定义模型配置接口
interface ModelConfig {
  baseTokens: number;      // 每张图片的基础消耗
  tileTokens: number;      // 每个瓦片的消耗
  tileSize: number;        // 瓦片的边长
  shortSideTarget: number; // 高分辨率模式下短边缩放目标
  maxSideLength: number;   // 最大边长限制
  supportsDetail: boolean; // 是否支持 detail 参数
  scalingFactor: number;   // token 缩放因子，用于调整最终 token 数量
}

// 模型特定的配置
const MODEL_CONFIGS: Record<SupportedModel, ModelConfig> = {
  'gpt-4-vision-preview': {
    baseTokens: 85,
    tileTokens: 170,
    tileSize: 512,
    shortSideTarget: 768,
    maxSideLength: 2048,
    supportsDetail: true,
    scalingFactor: 1.0 // 标准版本，不缩放
  },
  'gpt-4-vision-preview-mini': {
    baseTokens: 85,
    tileTokens: 170,
    tileSize: 512,
    shortSideTarget: 768,
    maxSideLength: 2048,
    supportsDetail: true,
    scalingFactor: 1.62
  },
  'gpt-4-vision-preview-nano': {
    baseTokens: 85,
    tileTokens: 170,
    tileSize: 512,
    shortSideTarget: 768,
    maxSideLength: 2048,
    supportsDetail: true,
    scalingFactor: 2.46
  },
  'claude-3-opus': {
    baseTokens: 200,
    tileTokens: 300,
    tileSize: 1024,
    shortSideTarget: 1024,
    maxSideLength: 3072,
    supportsDetail: false,
    scalingFactor: 1.0
  },
  'claude-3-sonnet': {
    baseTokens: 170,
    tileTokens: 250,
    tileSize: 1024,
    shortSideTarget: 1024,
    maxSideLength: 3072,
    supportsDetail: false,
    scalingFactor: 1.0
  },
  'gemini-pro-vision': {
    baseTokens: 100,
    tileTokens: 200,
    tileSize: 768,
    shortSideTarget: 1024,
    maxSideLength: 2048,
    supportsDetail: false,
    scalingFactor: 1.0
  }
};

/**
 * 估算不同模型处理图片的 Token 数量。
 *
 * @param {number} width - 图片的像素宽度。
 * @param {number} height - 图片的像素高度。
 * @param {SupportedModel} model - 使用的模型名称。
 * @param {'low' | 'high' | 'auto'} detail - 图片处理的细节模式 ('low'、'high' 或 'auto')。
 * @returns {number} 估算的 Token 数量。
 * @throws {Error} 如果参数无效。
 */
export function calculateImageTokens(
  width: number,
  height: number,
  model: SupportedModel = 'gpt-4-vision-preview',
  detail: 'low' | 'high' | 'auto' = 'auto'
): number {
  // 确保宽度和高度是正数
  if (width <= 0 || height <= 0) {
    throw new Error("图片宽度和高度必须是正数。");
  }

  const config = MODEL_CONFIGS[model];
  if (!config) {
    throw new Error(`不支持的模型: ${model}`);
  }

  // 如果模型不支持 detail 参数，强制使用 high
  if (!config.supportsDetail && detail !== 'high') {
    console.warn(`${model} 不支持 detail 参数，将使用默认的高质量模式`);
    detail = 'high';
  }

  // 根据 detail 参数来选择计算方式
  let detailMode: 'low' | 'high' = detail as 'low' | 'high';
  if (detail === 'auto') {
    console.warn(`Detail 模式 'auto' 正在被按 'high' 模式估算。实际 API 行为可能会智能选择低分辨率。`);
    detailMode = 'high';
  }

  let tokenCount: number;
  if (detailMode === 'low') {
    tokenCount = config.baseTokens;
  } else if (detailMode === 'high') {
    let currentWidth = width;
    let currentHeight = height;

    // 1. 如果短边超过目标尺寸，则将短边缩放到目标尺寸，长边等比例缩放
    if (Math.min(currentWidth, currentHeight) > config.shortSideTarget) {
      const aspectRatio = currentWidth / currentHeight;
      if (currentWidth < currentHeight) {
        currentWidth = config.shortSideTarget;
        currentHeight = Math.round(currentWidth / aspectRatio);
      } else {
        currentHeight = config.shortSideTarget;
        currentWidth = Math.round(currentHeight * aspectRatio);
      }
    }

    // 2. 确保不超过最大边长限制
    if (currentWidth > config.maxSideLength || currentHeight > config.maxSideLength) {
      const scale = Math.min(
        config.maxSideLength / currentWidth,
        config.maxSideLength / currentHeight
      );
      currentWidth = Math.round(currentWidth * scale);
      currentHeight = Math.round(currentHeight * scale);
    }

    // 3. 计算瓦片数量
    const tilesX = Math.ceil(currentWidth / config.tileSize);
    const tilesY = Math.ceil(currentHeight / config.tileSize);
    const numberOfTiles = tilesX * tilesY;

    tokenCount = config.baseTokens + (numberOfTiles * config.tileTokens);
  } else {
    throw new Error("无效的 detail 参数。请使用 'low' 或 'high'。");
  }

  // 应用缩放因子
  return Math.round(tokenCount * config.scalingFactor);
}

/**
 * 从文件对象直接计算图片的 Token 消耗。
 * 
 * @param {File} file - 图片文件对象
 * @param {SupportedModel} model - 使用的模型名称
 * @param {'low' | 'high' | 'auto'} detail - 图片处理的细节模式
 * @returns {Promise<number>} 估算的 Token 数量
 * @throws {Error} 如果文件读取失败或不是有效图片
 */
export function calculateImageTokensFromFile(
  file: File,
  model: SupportedModel = 'gpt-4-vision-preview',
  detail: 'low' | 'high' | 'auto' = 'auto'
): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('提供的文件不是图片格式'));
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const tokens = calculateImageTokens(img.naturalWidth, img.naturalHeight, model, detail);
        resolve(tokens);
      } catch (error) {
        reject(error);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('无法加载图片，请确保文件是有效的图片格式'));
    };

    img.src = objectUrl;
  });
}

/**
 * 基于图片URL计算Token（仅在浏览器环境中使用）
 * 
 * @param {string} imageUrl - 图片URL
 * @param {SupportedModel} model - 使用的模型名称
 * @param {'low' | 'high' | 'auto'} detail - 图片处理的细节模式
 * @returns {Promise<number>} 估算的 Token 数量
 */
export function calculateImageTokensFromUrl(
  imageUrl: string,
  model: SupportedModel = 'gpt-4-vision-preview',
  detail: 'low' | 'high' | 'auto' = 'auto'
): Promise<number> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const tokens = calculateImageTokens(img.naturalWidth, img.naturalHeight, model, detail);
        resolve(tokens);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('无法加载图片，请检查URL是否有效'));
    };
    
    img.src = imageUrl;
  });
}