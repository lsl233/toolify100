import { useEffect, useState } from "react";
export default function Test() {

  const [texts, setTexts] = useState<string[]>([]);

  useEffect(() => {
    const fetchTexts = async () => {
      const timer = setInterval(() => {
        setTimeout(() => {
          console.log('fetchTexts')
          setTexts(['123', '456', '789', '123', '456', '789', '123', '456', '789', '123', '456', '789', '123', '456', '789', '123', '456', '789']);
        }, 1000);
      }, 3000);
      return () => clearInterval(timer);
    };
    fetchTexts()
  }, []);

  return (
    <div className="h-[50vh] overflow-auto">
      {texts.map((text, index) => (
        <div className="p-4" key={index}>{text}</div>
      ))}
    </div>
  )
}