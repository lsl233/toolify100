import { Table, TableCaption, TableRow, TableHead, TableHeader, TableBody, TableCell } from "../ui/table";
import { useStore } from "@nanostores/react";
import { textStats } from "../../store/tokenStore";
import { cn } from "@/lib/utils";

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
  Provider: string;
  Context: string;
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
      "Provider": "OpenAI/Azure",
      "Context": "128K",
      "inputRate": 15,
      "inputCachedRate": 7.5,
      "outputRate": 60
    },
    {
      "Model": "o1-mini",
      "Provider": "OpenAI/Azure",
      "Context": "128K",
      "inputRate": 3,
      "inputCachedRate": 1.5,
      "outputRate": 12
    },
    {
      "Model": "gpt-4o-mini",
      "Provider": "OpenAI/Azure",
      "Context": "128K",
      "inputRate": 0.15,
      "inputCachedRate": 0.075,
      "outputRate": 0.06
    },
    {
      "Model": "gpt-4o",
      "Provider": "OpenAI/Azure",
      "Context": "128K",
      "inputRate": 2.5,
      "inputCachedRate": 1.25,
      "outputRate": 10
    },
    {
      "Model": "Claude 3.7 Sonnet",
      "Provider": "Anthropic",
      "Context": "200K",
      "inputRate": 3,
      "inputCachedRate": 0,
      "outputRate": 15
    },
    {
      "Model": "Claude 3.5 Haiku",
      "Provider": "Anthropic",
      "Context": "200K",
      "inputRate": 0.8,
      "inputCachedRate": 0,
      "outputRate": 4
    },
    {
      "Model": "Claude 3 Opus",
      "Provider": "Anthropic",
      "Context": "200K",
      "inputRate": 15,
      "inputCachedRate": 0,
      "outputRate": 75
    },
    {
      "Model": "Gemini 2.0 Flash-Lite",
      "Provider": "Google",
      "Context": "1M",
      "inputRate": 0.075,
      "inputCachedRate": 0,
      "outputRate": 0.3
    },
    {
      "Model": "Gemini 2.0 Flash",
      "Provider": "Google",
      "Context": "1M",
      "inputRate": 0.1,
      "inputCachedRate": 0,
      "outputRate": 0.4
    },
    {
      "Model": "Gemini 1.5 Pro",
      "Provider": "Google",
      "Context": "1M",
      "inputRate": 12.5,
      "inputCachedRate": 0,
      "outputRate": 5
    },
    {
      "Model": "Gemini 1.5 Flash",
      "Provider": "Google",
      "Context": "1M",
      "inputRate": 0.075,
      "inputCachedRate": 0,
      "outputRate": 0.3
    },
    {
      "Model": "Gemini 1.0 Pro",
      "Provider": "Google",
      "Context": "32K",
      "inputRate": 0.5,
      "inputCachedRate": 0,
      "outputRate": 1.5
    },
    {
      "Model": "Deepseek chat STANDARD",
      "Provider": "Deepseek",
      "Context": "64K",
      "inputRate": 0.27,
      "inputCachedRate": 0.07,
      "outputRate": 1.10
    },
    {
      "Model": "Deepseek chat DISCOUNT",
      "Provider": "Deepseek",
      "Context": "64K",
      "inputRate": 0.135,
      "inputCachedRate": 0.035,
      "outputRate": 0.550
    },
    {
      "Model": "Deepseek reasoner STANDARD",
      "Provider": "Deepseek",
      "Context": "64K",
      "inputRate": 0.55,
      "inputCachedRate": 0.14,
      "outputRate": 2.19
    },
    {
      "Model": "Deepseek reasoner DISCOUNT",
      "Provider": "Deepseek",
      "Context": "64K",
      "inputRate": 0.135,
      "inputCachedRate": 0.035,
      "outputRate": 0.550
    }
  ];

  // Calculate model pricing based on token count
  const calculatePricing = (): ModelPricing[] => {
    const tokensInMillion = stats.tokens ? stats.tokens / 1000000 : 0;
    
    return modelPricingRates.map(model => {
      const inputPrice = model.inputRate * tokensInMillion;
      const inputCachedPrice = model.inputCachedRate * tokensInMillion;
      const outputPrice = model.outputRate * tokensInMillion;
      
      return {
        Model: model.Model,
        Provider: model.Provider,
        Context: model.Context,
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
  
  // Generate pricing data
  const pricingData = calculatePricing();

  const modelHeaders: ModelHeader[] = [
    {
      name: "Models",
      key: "Model"
    },
    // {
    //   name: "提供商",
    //   key: "Provider"
    // },
    {
      name: "Context",
      key: "Context"
    },
    {
      name: "Input Price/1M Tokens",
      key: "Input/1M Tokens"
    },
    // {
    //   name: "缓存输入价格/百万tokens",
    //   key: "Input(cached)/1M Tokens"
    // },
    {
      name: "Output Price/1M Tokens",
      key: "Output/1M Tokens"
    },
    {
      name: "Input Price",
      key: "Input Price"
    },
    // {
    //   name: "缓存输入价格",
    //   key: "Input(cached) Price"
    // },
    {
      name: "Output Price",
      key: "Output Price"
    }
  ];

  return (
    <div
      className="bg-white rounded-lg shadow-md border border-stone-200 overflow-x-auto"
    >
      <Table>
        <TableCaption className="mb-4">
          LLM Model Price List - Current {stats.tokens?.toLocaleString()} tokens
        </TableCaption>
        <TableHeader>
          <TableRow className="border-stone-200">
            {
              modelHeaders.map((header) => (
                <TableHead className="font-medium px-4 py-1" key={header.key as React.Key}>{header.name}</TableHead>
              ))
            }
          </TableRow>
        </TableHeader>
        <TableBody>
          {pricingData.map((model, index) => (
            <TableRow key={index} className={cn(index % 2 === 0 ? "bg-stone-50" : "", "border-stone-200")}>
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
