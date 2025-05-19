import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs";
import Statistics from "./Statistics";
import TextInput from "./TextInput";
import { Input } from "../ui/input";
import { useState } from "react";
import { useStore } from "@nanostores/react";
import { resetTokens, textStats, updateText, updateTokenCount } from "../../store/tokenStore";

export default function TokenCounter() {
  // const [directTokenInput, setDirectTokenInput] = useState<string>("");
  const stats = useStore(textStats);

  const handleDirectTokenInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // setDirectTokenInput(value);
    
    // Update the token count in the store
    if (value && !isNaN(Number(value))) {
      // Create a dummy text with the specified number of tokens
      // This is a workaround since we can't directly set the token count
      updateTokenCount(Number(value));
    }
  };

  const handleTabChange = (value: string) => {
    resetTokens();
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
              {/* <label htmlFor="token-input" className="block text-sm font-medium text-stone-700 mb-1">
                Enter token count directly
              </label> */}
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
            {/* <Statistics /> */}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
