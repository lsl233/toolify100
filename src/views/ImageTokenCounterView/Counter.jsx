import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/ui/image-upload";
import { calculateImageTokensFromFile } from "@/lib/imageTokenCalculator";
import { getImageInfo } from "@/lib/imageUtils";
import { useState } from "react";
import { $tokenCount, updateTokenCount, resetTokenCount, updateImageTokens, $aiModels } from "./store";
import { useStore } from '@nanostores/react'
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator"
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";

export default function TokenCalculator() {
  const tokenCount = useStore($tokenCount);
  const models = useStore($aiModels);
  const [imageInfo, setImageInfo] = useState({
    size: 0,
    width: 0,
    height: 0
  });

  // 新增状态管理
  const [imageSize, setImageSize] = useState("");
  const [sizeUnit, setSizeUnit] = useState("mb");
  const [imageCount, setImageCount] = useState("");

  const handleTabChange = (value) => {
    if (value === "upload") {
      // 重置所有状态
      resetTokenCount();
      updateImageTokens({});
      setImageInfo({
        size: 0,
        width: 0,
        height: 0
      });
    } else if (value === "size") {
      // 重置所有状态
      resetTokenCount();
      updateImageTokens({size: 0});
      setImageSize("");
      setImageCount("");
      setSizeUnit("mb");
    }
  }

  const calculateTokensFromSize = (size, count, unit) => {
    if (!size || !count) return;

    const inputSize = parseFloat(size);
    const countInInt = parseInt(count);

    if (isNaN(inputSize) || isNaN(countInInt) || inputSize <= 0 || countInInt <= 0) return;

    // 转换为字节
    let sizeInBytes = inputSize;
    switch (unit) {
      case "kb":
        sizeInBytes *= 1024;
        break;
      case "mb":
        sizeInBytes *= 1024 * 1024;
        break;
      case "gb":
        sizeInBytes *= 1024 * 1024 * 1024;
        break;
    }

    // 获取所有支持图片的模型
    const visionModels = models
      .filter(model => model.visionModel)
      .map(model => model.visionModel);

    // 为每个支持图片的模型计算token
    const modelTokens = {};
    visionModels.forEach((modelType) => {
      if (modelType) {
        // 基于图片大小估算token
        // 这里使用一个简单的估算公式：每1MB大约4000个token
        const tokensPerImage = Math.ceil((sizeInBytes / (1024 * 1024)) * 4000);
        modelTokens[modelType] = tokensPerImage * countInInt;
      }
    });

    // 更新每个模型的图片token
    updateImageTokens(modelTokens);
    updateTokenCount(0); // 重置文本token，因为是图片模式

    // 更新图片信息显示
    setImageInfo({
      size: `${inputSize} ${unit.toUpperCase()}`,
      width: 0,
      height: 0
    });
  };

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

        // 获取所有支持图片的模型
        const visionModels = models
          .filter(model => model.visionModel)
          .map(model => model.visionModel);

        // 为每个支持图片的模型计算token
        const tokenPromises = visionModels.map(async (modelType) => {
          if (!modelType) return 0;
          return await calculateImageTokensFromFile(file, modelType, 'high');
        });

        // 等待所有token计算完成
        const tokenResults = await Promise.all(tokenPromises);

        // 创建模型和token的映射
        const modelTokens = {};
        visionModels.forEach((modelType, index) => {
          if (modelType) {
            modelTokens[modelType] = tokenResults[index];
          }
        });

        // 更新每个模型的图片token
        updateImageTokens(modelTokens);
        updateTokenCount(0); // 重置文本token，因为是图片模式
      } catch (error) {
        console.error('处理图片时出错:', error);
        setImageInfo({
          size: '错误',
          width: 0,
          height: 0
        });
        resetTokenCount();
        updateImageTokens({});
      }
    } else {
      // 重置状态
      resetTokenCount();
      updateImageTokens({});
      setImageInfo({
        size: 0,
        width: 0,
        height: 0
      });
    }
  };

  return (
    <div className="">
      <Tabs className="flex-1" onValueChange={handleTabChange} defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="size">Input Image Size</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <ImageUpload
            onImageChange={handleImageChange}
            maxSizeMB={10}
          />
        </TabsContent>
        <TabsContent value="size">
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              className="focus:ring-amber-500 w-1/3 bg-white"
              placeholder="Enter image size (e.g., 1000)"
              value={imageSize}
              onChange={(e) => {
                const newSize = e.target.value;
                setImageSize(newSize);
                calculateTokensFromSize(newSize, imageCount, sizeUnit);
              }}
            />
            <Select value={sizeUnit} onValueChange={(value) => {
              setSizeUnit(value);
              calculateTokensFromSize(imageSize, imageCount, value);
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select image size unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kb">KB</SelectItem>
                <SelectItem value="mb">MB</SelectItem>
                <SelectItem value="gb">GB</SelectItem>
              </SelectContent>
            </Select>
            <Separator orientation="vertical" className="!h-6" />
            <Input
              type="number"
              className="w-[180px] focus:ring-amber-500 bg-white"
              placeholder="Enter image count (e.g., 50)"
              value={imageCount}
              onChange={(e) => {
                const newCount = e.target.value;
                setImageCount(newCount);
                calculateTokensFromSize(imageSize, newCount, sizeUnit);
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex gap-4">
        <div className="bg-white w-1/3 rounded-lg mt-4 shadow-md border border-stone-200 p-4 hover:shadow-lg transition-shadow">
          <div className="h-full flex flex-col justify-center items-center">
            <span className="text-stone-700 font-medium">Size</span>
            <div className="flex">
              <span id="size-count" className="text-2xl font-bold text-amber-600">
                {imageInfo.size}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white w-1/3 rounded-lg mt-4 shadow-md border border-stone-200 p-4 hover:shadow-lg transition-shadow">
          <div className="h-full flex flex-col justify-center items-center">
            <span className="text-stone-700 font-medium">Width</span>
            <div className="flex">
              <span id="width-count" className="text-2xl font-bold text-amber-600">
                {imageInfo.width > 0 ? `${imageInfo.width}px` : '-'}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-white w-1/3 rounded-lg mt-4 shadow-md border border-stone-200 p-4 hover:shadow-lg transition-shadow">
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
