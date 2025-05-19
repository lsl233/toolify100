import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { Input } from "../ui/input";
import Statistics from "./Statistics";
import TextInput from "./TextInput";
import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { resetTokens, textStats, updateTokenCount } from "../../store/tokenStore";

export default function TokenCalculator() {
  const stats = useStore(textStats);
  const [tokenInput, setTokenInput] = useState<string>("");

  const handleDirectTokenInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Update the token count in the store
    if (value && !isNaN(Number(value))) {
      updateTokenCount(Number(value));
    } else {
      updateTokenCount(0);
    }
  };

  const handleTabChange = (value: string) => {
    resetTokens();
    setTokenInput("");
  };

  return (
    <>
      <Tabs onValueChange={handleTabChange} defaultValue="text">
        <TabsList>
          <TabsTrigger value="text">Input Text</TabsTrigger>
          <TabsTrigger value="token">Input Token Count</TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <TextInput />
          <Statistics />
        </TabsContent>
        <TabsContent value="token">
          <div className="space-y-4 mb-4">
            <div className="flex items-center">
              <Input 
                id="token-input"
                type="number" 
                className="focus:ring-amber-500 w-1/2 bg-white" 
                placeholder="Enter token count (e.g., 1000)" 
                value={stats.tokens}
                onChange={handleDirectTokenInput}
              />
              <p className="text-sm ml-2 text-stone-500">
                This will calculate prices based on the token count you enter
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
