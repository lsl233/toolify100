/**
 * 获取图片的详细信息，包括宽度、高度和格式化后的文件大小
 * 
 * @param {File} file - 图片文件对象
 * @returns {Promise<{width: number, height: number, size: string, originalSize: number}>} 
 *          包含图片宽度、高度、格式化大小和原始大小的对象
 */
export function getImageInfo(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('未提供文件'));
      return;
    }

    // 检查文件是否为图片
    if (!file.type.startsWith('image/')) {
      reject(new Error('文件不是图片格式'));
      return;
    }

    // 创建URL
    const imageUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      // 获取图片信息
      const info = {
        width: img.naturalWidth,
        height: img.naturalHeight,
        size: formatFileSize(file.size),
        originalSize: file.size
      };

      // 释放URL
      URL.revokeObjectURL(imageUrl);
      resolve(info);
    };

    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('图片加载失败'));
    };

    // 开始加载图片
    img.src = imageUrl;
  });
}

/**
 * 将文件大小（字节）格式化为人类可读的字符串
 * 
 * @param {number} bytes - 文件大小（字节）
 * @param {number} [decimals=2] - 小数点后位数
 * @returns {string} 格式化后的文件大小，如 "1.25 MB"
 */
export function formatFileSize(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * 从Data URL中获取图片的Base64编码数据部分
 * 
 * @param {string} dataUrl - 完整的Data URL
 * @returns {string} 纯Base64数据部分
 */
export function getBase64FromDataUrl(dataUrl) {
  return dataUrl.split(',')[1];
}

/**
 * 将图片文件转换为Data URL
 * 
 * @param {File} file - 图片文件
 * @returns {Promise<string>} 包含图片数据的Data URL
 */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

/**
 * 压缩图片文件到指定的最大尺寸
 * 
 * @param {File} file - 原始图片文件
 * @param {Object} options - 压缩选项
 * @param {number} [options.maxWidth=1920] - 最大宽度
 * @param {number} [options.maxHeight=1080] - 最大高度
 * @param {number} [options.quality=0.8] - JPEG/WEBP压缩质量(0-1)
 * @returns {Promise<Blob>} 压缩后的图片Blob对象
 */
export function compressImage(file, { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = {}) {
  return new Promise((resolve, reject) => {
    // 无需压缩的情况
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('无效的图片文件'));
      return;
    }
    
    // 创建URL
    const imageUrl = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      // 计算新尺寸
      let width = img.naturalWidth;
      let height = img.naturalHeight;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }
      
      // 创建画布
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      // 绘制图片
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // 确定输出格式
      let outputType = file.type;
      if (outputType === 'image/png' && quality < 1) {
        // PNG不支持质量参数，切换到JPEG以支持压缩
        outputType = 'image/jpeg';
      }
      
      // 转换为Blob
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(imageUrl);
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('图片压缩失败'));
          }
        },
        outputType,
        quality
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error('图片加载失败'));
    };
    
    img.src = imageUrl;
  });
} 