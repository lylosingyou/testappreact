import React, { useState, useEffect, useRef } from 'react';

const terminalLines = [
  "HumanMade OS [Version 3.14.159]",
  "(c) HumanMade Corporation. All rights reserved.",
  "",
  "C:\\Users\\Human> system --check",
  "Checking core integrity... OK",
  "Verifying neural link latency... 2ms",
  "Analyzing cognitive load... 12.4%",
  "All systems nominal.",
  "",
  "C:\\Users\\Human> ",
];

const TerminalApp: React.FC = () => {
  const [output, setOutput] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lineIndex = 0;
    const interval = setInterval(() => {
      setOutput(prev => [...prev, terminalLines[lineIndex]]);
      lineIndex++;
      if (lineIndex >= terminalLines.length) {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div ref={containerRef} className="w-full h-full bg-black/90 p-2 font-roboto-mono text-sm text-gray-300 overflow-y-auto">
      {output.map((line, i) => (
        <p key={i} className="whitespace-pre-wrap">{line}{i === output.length - 1 && i === terminalLines.length - 1 && <span className="w-2 h-4 bg-gray-300 inline-block animate-pulse ml-1"></span>}</p>
      ))}
    </div>
  );
};

export default TerminalApp;