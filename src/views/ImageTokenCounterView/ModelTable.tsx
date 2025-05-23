import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useStore } from "@nanostores/react";
import { $tokenCount, $aiModels, type AIModel } from "./store";

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
  {
    name: "Input/1K Tokens",
    key: "inputPriceRate",
    after: "$"
  },
  {
    name: "Output/1K Tokens",
    key: "outputPriceRate",
    after: "$"
  },
  {
    name: "Input Price",
    key: "inputPrice",
    after: "$"
  },
  // {
  //   name: "Output Price",
  //   key: "outputPrice",
  //   after: "$"
  // },
  {
    name: "Image Tokens",
    key: "imageTokens",
  }
];

export default function ModelTable() {
  const tokenCount = useStore($tokenCount);
  const models = useStore($aiModels);

  return (
    <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-x-auto">
      <Table>
        <TableCaption className="mb-4">
          LLM Model Price List - Current {tokenCount.toLocaleString()} tokens
        </TableCaption>
        <TableHeader>
          <TableRow className="border-stone-200">
            {modelHeaders.map((header) => (
              <TableHead className="font-medium px-4 py-1" key={header.key as React.Key}>
                {header.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {models.map((model, index) => (
            <TableRow 
              key={index} 
              className={cn(
                index % 2 === 0 ? "bg-stone-50" : "", 
                "border-stone-200",
                model.isEstimated ? "text-stone-500" : ""
              )}
            >
              {modelHeaders.map((header) => (
                <TableCell 
                  className={cn(
                    "px-4 py-2",
                    model.isEstimated && header.key === 'model' ? "italic" : ""
                  )} 
                  key={header.key as React.Key}
                >
                  {header.key === 'imageTokens' 
                    ? (model[header.key] !== undefined ? model[header.key]?.toLocaleString() : '-')
                    : model[header.key]}{header.after || null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}