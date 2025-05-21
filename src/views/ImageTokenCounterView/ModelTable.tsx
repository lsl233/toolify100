import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useStore } from "@nanostores/react";
import { $tokenCount } from "./store";
import { useEffect, useState } from "react";

interface AIModel {
  model: string;
  provider: string;
  context: string;
  inputPriceRate: number;
  inputCachedPriceRate: number;
  outputPriceRate: number;
  inputPrice: number;
  inputCachedPrice: number;
  outputPrice: number;
}

const aiModels: AIModel[] = [
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
  },
  
]

const modelHeaders: {
  name: string;
  key: keyof AIModel;
  after?: string;
}[] = [
    {
      name: "Model",
      key: "model",
    },
    {
      name: "Provider",
      key: "provider",
    },
    // {
    //   name: "Input Tokens",
    //   key: "inputTokens",
    // },
    // {
    //   name: "Output Tokens",
    //   key: "outputTokens",
    // },
    {
      name: "Input/1M Tokens",
      key: "inputPriceRate",
      after: "$"
    },
    // {
    //   name: "Input(cached) Price",
    //   key: "inputCachedPrice",
    // },
    {
      name: "Output/1M Tokens",
      key: "outputPriceRate",
      after: "$"
    },
    {
      name: "Input Price",
      key: "inputPrice",
      after: "$"
    },
    {
      name: "Output Price",
      key: "outputPrice",
      after: "$"
    },
  ]

export default function ModelTable() {
  const tokenCount = useStore($tokenCount)
  const [models, setModels] = useState<AIModel[]>(aiModels)

  useEffect(() => {
    setModels(aiModels.map((model) => ({
      ...model,
      inputPrice: model.inputPriceRate * tokenCount / 1000000,
      inputCachedPrice: model.inputCachedPriceRate * tokenCount / 1000000,
      outputPrice: model.outputPriceRate * tokenCount / 1000000,
    })))
  }, [tokenCount])
  return (
    <div
      className="bg-white rounded-lg shadow-md border border-stone-200 overflow-x-auto"
    >
      <Table>
        <TableCaption className="mb-4">
          LLM Model Price List - Current {tokenCount.toLocaleString()} tokens
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
          {models.map((model, index) => (
            <TableRow key={index} className={cn(index % 2 === 0 ? "bg-stone-50" : "", "border-stone-200")}>
              {
                modelHeaders.map((header) => (
                  <TableCell className="px-4 py-2" key={header.key as React.Key}>{model[header.key]}{header.after || null}</TableCell>
                ))
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}