import React, { useState, useEffect } from 'react';

const bootMessages = [
  "HUMANMADE_OS v3.14 alpha",
  "Initializing quantum core...",
  "[OK] Core services started",
  "Calibrating neural interface...",
  "Syncing with bio-rhythms...",
  "[OK] Neural link established",
  "Loading cognitive models...",
  "Decompressing memory engrams...",
  "System ready.",
  "Welcome, Human.",
];

interface BootScreenProps {
  onBootComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const bootSequence = () => {
      let currentLine = 0;
      const lineInterval = setInterval(() => {
        setLog((prevLog) => [...prevLog, bootMessages[currentLine]]);
        currentLine++;
        if (currentLine === bootMessages.length) {
          clearInterval(lineInterval);
          const progressInterval = setInterval(() => {
            setProgress((prev) => {
              if (prev >= 100) {
                clearInterval(progressInterval);
                setTimeout(onBootComplete, 1000); // Automatically continue after a short delay
                return 100;
              }
              return prev + 1;
            });
          }, 30);
        }
      }, 300);
    };

    const timer = setTimeout(bootSequence, 500); // Small delay to start

    return () => clearTimeout(timer);
  }, [onBootComplete]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black font-roboto-mono text-gray-300/80 p-4">
      <div className="w-full max-w-2xl">
        {log.map((line, index) => (
          <p key={index} className="text-sm md:text-base animate-fadeIn">{`> ${line}`}</p>
        ))}
      </div>

      {log.length === bootMessages.length && (
        <div className="w-full max-w-2xl mt-8 animate-fadeIn">
          <div className="w-full h-2 bg-gray-800/50 border border-gray-500/20">
            <div
              className="h-full bg-gray-200"
              style={{ width: `${progress}%`, transition: 'width 0.05s linear' }}
            ></div>
          </div>
          <p className="text-center mt-2 text-sm">{progress}%</p>
        </div>
      )}
    </div>
  );
};

export default BootScreen;
