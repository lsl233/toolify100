import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/image-upload";
import { calculateImageTokensFromFile } from "@/lib/imageTokenCalculator";
import { getImageInfo } from "@/lib/imageUtils";
import { useState } from "react";
import { $tokenCount, updateTokenCount } from "./store";
import { useStore } from '@nanostores/react'


export default function TokenCalculator() {
  // const [tokens, setTokens] = useState(0);
  const tokenCount = useStore($tokenCount);
  const [imageInfo, setImageInfo] = useState({
    size: 0,
    width: 0,
    height: 0
  });

  const handleTabChange = () => {
    console.log("handleTabChange");
  }

  const handleImageChange = async (file) => {
    if (file) {
      console.log('Selected file:', file.name, file.size);
      
      try {
        // 重置当前信息
        setImageInfo({
          size: '加载中...',
          width: 0,
          height: 0
        });
        
        // 获取图片信息
        const info = await getImageInfo(file);
        setImageInfo({
          size: info.size,
          width: info.width,
          height: info.height
        });
        
        // 计算token数量
        const tokenCount = await calculateImageTokensFromFile(file, 'high');
        updateTokenCount(tokenCount);
      } catch (error) {
        console.error('处理图片时出错:', error);
        setImageInfo({
          size: '错误',
          width: 0,
          height: 0
        });
        setTokens(0);
      }
    } else {
      // 重置状态
      setTokens(0);
      setImageInfo({
        size: 0,
        width: 0,
        height: 0
      });
    }
  };
  
  // 格式化文件大小为友好显示
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="">
      <Tabs className="flex-1" onValueChange={handleTabChange} defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger disabled value="size">Input Image Size</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <ImageUpload
            onImageChange={handleImageChange}
            maxSizeMB={10}
            label="请上传图片"
          />
        </TabsContent>
        <TabsContent value="size">
        </TabsContent>
      </Tabs>
      <div className="flex gap-4">
        <div className="bg-white w-1/4 rounded-lg mt-4 shadow-md border border-stone-200 p-4 hover:shadow-lg transition-shadow">
          <div className="h-full flex flex-col justify-center items-center">
            <span className="text-stone-700 font-medium">Tokens</span>
            <div className="flex">
              <span id="token-count" className="text-2xl font-bold text-amber-600">
                {tokenCount}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white w-1/4 rounded-lg mt-4 shadow-md border border-stone-200 p-4 hover:shadow-lg transition-shadow">
          <div className="h-full flex flex-col justify-center items-center">
            <span className="text-stone-700 font-medium">Size</span>
            <div className="flex">
              <span id="size-count" className="text-2xl font-bold text-amber-600">
                {imageInfo.size}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white w-1/4 rounded-lg mt-4 shadow-md border border-stone-200 p-4 hover:shadow-lg transition-shadow">
          <div className="h-full flex flex-col justify-center items-center">
            <span className="text-stone-700 font-medium">Width</span>
            <div className="flex">
              <span id="width-count" className="text-2xl font-bold text-amber-600">
                {imageInfo.width > 0 ? `${imageInfo.width}px` : '-'}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white w-1/4 rounded-lg mt-4 shadow-md border border-stone-200 p-4 hover:shadow-lg transition-shadow">
          <div className="h-full flex flex-col justify-center items-center">
            <span className="text-stone-700 font-medium">Height</span>
            <div className="flex">
              <span id="height-count" className="text-2xl font-bold text-amber-600">
                {imageInfo.height > 0 ? `${imageInfo.height}px` : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
