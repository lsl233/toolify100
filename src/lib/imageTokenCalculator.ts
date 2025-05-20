/**
 * 估算 OpenAI GPT-4o / GPT-4V 模型处理图片的 Token 数量。
 *
 * @param {number} width - 图片的像素宽度。
 * @param {number} height - 图片的像素高度。
 * @param {'low' | 'high' | 'auto'} detail - 图片处理的细节模式 ('low'、'high' 或 'auto')。
 * @returns {number} 估算的 Token 数量。
 * @throws {Error} 如果 detail 参数无效。
 */
export function calculateImageTokens(
  width: number, 
  height: number, 
  detail: 'low' | 'high' | 'auto' = 'auto'
): number {
  // 确保宽度和高度是正数
  if (width <= 0 || height <= 0) {
      throw new Error("图片宽度和高度必须是正数。");
  }

  // 根据 OpenAI 官方文档，当前已知的常量
  const BASE_TOKENS = 85;       // 每张图片的基础消耗
  const TILE_TOKENS = 170;      // 每个 512x512 瓦片的消耗
  const TILE_SIZE = 512;        // 瓦片的边长
  const SHORT_SIDE_TARGET_HIGH_RES = 768; // 高分辨率模式下短边缩放目标

  // 根据 detail 参数来选择默认行为 (OpenAI API 默认是 auto，这里简化为 high/low)
  // 实际 API 中的 'auto' 模式会根据图片大小智能选择，这里我们手动指定
  // 为了简单起见，如果 detail 是 'auto'，我们假设它走高分辨率计算路径，因为用户通常关心高分辨率的成本
  let detailMode: 'low' | 'high' = detail as 'low' | 'high';
  
  if (detail === 'auto') {
      // OpenAI 的 'auto' 行为是：
      // 如果图片的总像素少于100万像素（大概），则按低分辨率处理。
      // 如果图片尺寸较大，它会智能决定是处理成低分辨率还是高分辨率。
      // 这里为了简化，我们仅按照高分辨率模式的计算方式进行，因为它更复杂也更容易产生高费用。
      // 如果要严格模拟，需要更复杂的逻辑判断。
      console.warn("Detail 模式 'auto' 正在被按 'high' 模式估算。实际 API 行为可能会智能选择低分辨率。");
      detailMode = 'high';
  }


  if (detailMode === 'low') {
      return BASE_TOKENS;
  } else if (detailMode === 'high') {
      let currentWidth = width;
      let currentHeight = height;

      // 1. 如果短边超过 768 像素，则将短边缩放到 768 像素，长边等比例缩放
      if (Math.min(currentWidth, currentHeight) > SHORT_SIDE_TARGET_HIGH_RES) {
          const aspectRatio = currentWidth / currentHeight;
          if (currentWidth < currentHeight) { // 宽度是短边
              currentWidth = SHORT_SIDE_TARGET_HIGH_RES;
              currentHeight = Math.round(currentWidth / aspectRatio);
          } else { // 高度是短边
              currentHeight = SHORT_SIDE_TARGET_HIGH_RES;
              currentWidth = Math.round(currentHeight * aspectRatio);
          }
      }

      // 2. 确保长边不超过 2048 像素 (这是 OpenAI 的另一个隐性限制，虽然文档中不直接作为计算因子，但作为输入限制)
      // 实际上，更准确的说法是总像素不超过 4MB，或最长边不超过 2048 像素
      // 这里我们只考虑瓦片计算，通常大图已经会被切分
      // 这一步在官方计算瓦片时，一般认为已经处理，但在我们模拟时可略过，因为它不直接影响瓦片数

      // 3. 计算瓦片数量
      const tilesX = Math.ceil(currentWidth / TILE_SIZE);
      const tilesY = Math.ceil(currentHeight / TILE_SIZE);
      const numberOfTiles = tilesX * tilesY;

      return BASE_TOKENS + (numberOfTiles * TILE_TOKENS);

  } else {
      throw new Error("无效的 detail 参数。请使用 'low' 或 'high'。");
  }
}

/**
 * 从文件对象直接计算图片的 Token 消耗。
 * 
 * @param {File} file - 图片文件对象
 * @param {'low' | 'high' | 'auto'} detail - 图片处理的细节模式
 * @returns {Promise<number>} 估算的 Token 数量
 * @throws {Error} 如果文件读取失败或不是有效图片
 */
export function calculateImageTokensFromFile(
  file: File, 
  detail: 'low' | 'high' | 'auto' = 'auto'
): Promise<number> {
  return new Promise((resolve, reject) => {
    // 检查文件是否为图片
    if (!file.type.startsWith('image/')) {
      reject(new Error('提供的文件不是图片格式'));
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      try {
        // 获取图片尺寸并计算 token
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const tokens = calculateImageTokens(width, height, detail);
        resolve(tokens);
      } catch (error) {
        reject(error);
      } finally {
        // 释放 object URL
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('无法加载图片，请确保文件是有效的图片格式'));
    };

    // 开始加载图片
    img.src = objectUrl;
  });
}

// 补充：为了方便使用，添加一个同步获取图片尺寸并计算的方法
/**
 * 基于图片URL计算Token（仅在浏览器环境中使用）
 * 
 * @param {string} imageUrl - 图片URL
 * @param {'low' | 'high' | 'auto'} detail - 图片处理的细节模式
 * @returns {Promise<number>} 估算的 Token 数量
 */
export function calculateImageTokensFromUrl(
  imageUrl: string,
  detail: 'low' | 'high' | 'auto' = 'auto'
): Promise<number> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const tokens = calculateImageTokens(img.naturalWidth, img.naturalHeight, detail);
        resolve(tokens);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('无法加载图片，请检查URL是否有效'));
    };
    
    // 开始加载图片
    img.src = imageUrl;
  });
}