import { Input } from "../ui/input";
import { useStore } from "@nanostores/react";
import { textStats, updateTokenCount } from "../../store/tokenStore";

export default function TokenCounter() {
  const stats = useStore(textStats);

  const handleDirectTokenInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Update the token count in the store
    if (value && !isNaN(Number(value))) {
      updateTokenCount(Number(value));
    }
  }

  return (
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
  );
}