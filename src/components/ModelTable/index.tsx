import { Table, TableCaption, TableRow, TableHead, TableHeader, TableBody, TableCell } from "../ui/table";
import { useStore } from "@nanostores/react";
import { textStats } from "../../store/tokenStore";

interface ModelPricing {
  Model: string;
  Provider: string;
  Context: string;
  "Input/1M Tokens": string;
  "Input(cached)/1M Tokens": string;
  "Output/1M Tokens": string;
  "Input Price": string;
  "Input(cached) Price": string;
  "Output Price": string;
}

interface ModelPricingRates {
  Model: string;
  inputRate: number;
  inputCachedRate: number;
  outputRate: number;
}

interface ModelHeader {
  name: string;
  key: keyof ModelPricing;
}

export default function ModelTable() {
  const stats = useStore(textStats);
  
  // Model pricing rates data (cost per million tokens)
  const modelPricingRates: ModelPricingRates[] = [
    {
      "Model": "o1",
      "inputRate": 15,
      "inputCachedRate": 7.5,
      "outputRate": 60
    },
    {
      "Model": "o1-mini",
      "inputRate": 3,
      "inputCachedRate": 1.5,
      "outputRate": 12
    },
    {
      "Model": "gpt-4o-mini",
      "inputRate": 0.15,
      "inputCachedRate": 0.075,
      "outputRate": 0.06
    },
    {
      "Model": "gpt-4o",
      "inputRate": 2.5,
      "inputCachedRate": 1.25,
      "outputRate": 10
    },
    {
      "Model": "Claude 3.7 Sonnet",
      "inputRate": 3,
      "inputCachedRate": 0,
      "outputRate": 15
    },
    {
      "Model": "Claude 3.5 Haiku",
      "inputRate": 0.8,
      "inputCachedRate": 0,
      "outputRate": 4
    },
    {
      "Model": "Claude 3 Opus",
      "inputRate": 15,
      "inputCachedRate": 0,
      "outputRate": 75
    },
    {
      "Model": "Gemini 2.0 Flash-Lite",
      "inputRate": 0.075,
      "inputCachedRate": 0,
      "outputRate": 0.3
    },
    {
      "Model": "Gemini 2.0 Flash",
      "inputRate": 0.1,
      "inputCachedRate": 0,
      "outputRate": 0.4
    },
    {
      "Model": "Gemini 1.5 Pro",
      "inputRate": 12.5,
      "inputCachedRate": 0,
      "outputRate": 5
    },
    {
      "Model": "Gemini 1.5 Flash",
      "inputRate": 0.075,
      "inputCachedRate": 0,
      "outputRate": 0.3
    },
    {
      "Model": "Gemini 1.0 Pro",
      "inputRate": 0.5,
      "inputCachedRate": 0,
      "outputRate": 1.5
    }
  ];

  // Calculate model pricing based on token count
  const calculatePricing = (): ModelPricing[] => {
    const tokensInMillion = stats.tokens / 1000000;
    
    return modelPricingRates.map(model => {
      const inputPrice = model.inputRate * tokensInMillion;
      const inputCachedPrice = model.inputCachedRate * tokensInMillion;
      const outputPrice = model.outputRate * tokensInMillion;
      
      return {
        Model: model.Model,
        Provider: getProviderForModel(model.Model),
        Context: getContextForModel(model.Model),
        "Input/1M Tokens": `$${model.inputRate}`,
        "Input(cached)/1M Tokens": `$${model.inputCachedRate}`,
        "Output/1M Tokens": `$${model.outputRate}`,
        "Input Price": formatPrice(inputPrice),
        "Input(cached) Price": formatPrice(inputCachedPrice),
        "Output Price": formatPrice(outputPrice)
      };
    });
  };

  // Helper function to format price
  const formatPrice = (price: number): string => {
    if (price < 0.0001 && price > 0) {
      return "$0.0001"; // Minimum displayable price
    }
    return `$${price.toFixed(4)}`;
  };

  // Helper function to get provider for a model
  const getProviderForModel = (model: string): string => {
    if (model.startsWith("gpt-") || model.startsWith("o1")) {
      return "OpenAI/Azure";
    } else if (model.startsWith("Claude")) {
      return "Anthropic";
    } else if (model.startsWith("Gemini")) {
      return "Google";
    }
    return "Unknown";
  };

  // Helper function to get context window size for a model
  const getContextForModel = (model: string): string => {
    if (model.startsWith("gpt-") || model.startsWith("o1")) {
      return "128K";
    } else if (model.startsWith("Claude")) {
      return "200K";
    } else if (model.startsWith("Gemini 1.0")) {
      return "32K";
    } else if (model.startsWith("Gemini")) {
      return "1M";
    }
    return "Unknown";
  };
  
  // Generate pricing data
  const pricingData = calculatePricing();

  const modelHeaders: ModelHeader[] = [
    {
      name: "模型",
      key: "Model"
    },
    {
      name: "提供商",
      key: "Provider"
    },
    {
      name: "上下文长度",
      key: "Context"
    },
    {
      name: "输入价格/百万tokens",
      key: "Input/1M Tokens"
    },
    // {
    //   name: "缓存输入价格/百万tokens",
    //   key: "Input(cached)/1M Tokens"
    // },
    {
      name: "输出价格/百万tokens",
      key: "Output/1M Tokens"
    },
    {
      name: "输入价格",
      key: "Input Price"
    },
    // {
    //   name: "缓存输入价格",
    //   key: "Input(cached) Price"
    // },
    {
      name: "输出价格",
      key: "Output Price"
    }
  ];

  return (
    <div
      className="bg-white rounded-lg shadow-md border border-stone-200 overflow-x-auto"
    >
      <Table>
        <TableCaption className="mb-4">
          LLM 模型价格列表 - 当前文本 {stats.tokens.toLocaleString()} tokens
        </TableCaption>
        <TableHeader>
          <TableRow>
            {
              modelHeaders.map((header) => (
                <TableHead className="font-medium px-4 py-1" key={header.key as React.Key}>{header.name}</TableHead>
              ))
            }
          </TableRow>
        </TableHeader>
        <TableBody>
          {pricingData.map((model, index) => (
            <TableRow key={index} className={index % 2 === 0 ? "bg-stone-50" : ""}>
              {
                modelHeaders.map((header) => (
                  <TableCell className="px-4 py-2" key={header.key as React.Key}>{model[header.key]}</TableCell>
                ))
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
