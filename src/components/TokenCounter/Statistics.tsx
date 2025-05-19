import { useStore } from "@nanostores/react";
import { textStats } from "../../store/tokenStore";

export default function TokenCounter() {
  const stats = useStore(textStats);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow-md border border-stone-200 p-4 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-stone-700 font-medium">Tokens</span>
            <div className="relative ml-1 group">
              <div className="w-4 h-4 text-amber-500 cursor-help">
                <div className="w-4 h-4 rounded-full border border-amber-500 flex items-center justify-center">
                  <span className="text-xs">i</span>
                </div>
              </div>
              {/* <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-stone-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                Token是AI模型处理文本的基本单位。此计数使用tiktoken库，与OpenAI模型使用的分词方式一致。
              </div> */}
            </div>
          </div>
          <div className="flex items-baseline">
            <span id="token-count" className="text-2xl font-bold text-amber-600">
              {stats.tokens || 0}
            </span>
            {/* <span className="ml-1 text-xs text-stone-500">tokens</span> */}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-stone-200 p-4 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center">
          <span className="text-stone-700 font-medium">Words</span>
          <div className="flex items-baseline">
            <span id="word-count" className="text-2xl font-bold text-amber-600">
              {stats.words}
            </span>
            {/* <span className="ml-1 text-xs text-stone-500">字</span> */}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-stone-200 p-4 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center">
          <span className="text-stone-700 font-medium">Characters (no spaces)</span>
          <div className="flex items-baseline">
            <span id="chars-with-spaces" className="text-2xl font-bold text-amber-600">
              {stats.charsWithSpaces}
            </span>
            {/* <span className="ml-1 text-xs text-stone-500">字符</span> */}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-stone-200 p-4 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-center">
          <span className="text-stone-700 font-medium">Total characters</span>
          <div className="flex items-baseline">
            <span id="chars-without-spaces" className="text-2xl font-bold text-amber-600">
              {stats.charsWithoutSpaces}
            </span>
            {/* <span className="ml-1 text-xs text-stone-500">字符</span> */}
          </div>
        </div>
      </div>
    </div>
  );
} 