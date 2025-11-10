
import React, { useState, useEffect } from 'react';

const TerminalApp: React.FC = () => {
  const [lines, setLines] = useState<string[]>(['HumanMade OS [Version 1.0.0]', '(c) 2024 HumanMade Corporation. All rights reserved.']);
  
  useEffect(() => {
    const initialCommands = [
      'Connecting to global network...',
      'Connection established.',
      'Awaiting user input...',
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < initialCommands.length) {
        setLines(prev => [...prev, `> ${initialCommands[i]}`]);
        i++;
      } else {
        clearInterval(interval);
        setLines(prev => [...prev, `> `]);
      }
    }, 500 + Math.random() * 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/80 text-green-400 font-mono text-sm p-4 h-full overflow-y-auto">
      {lines.map((line, index) => (
        <p key={index} className="whitespace-pre-wrap">{line}{index === lines.length - 1 && <span className="animate-ping">_</span>}</p>
      ))}
    </div>
  );
};

export default TerminalApp;
