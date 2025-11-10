
import React, { useState, useEffect, useCallback } from 'react';
import type { AppDefinition, WindowInstance } from './types';
import { TerminalIcon, DashboardIcon } from './components/Icons';
import TerminalApp from './components/TerminalApp';
import DashboardApp from './components/DashboardApp';
import Window from './components/Window';

const bootMessages = [
  "Booting HumanMade OS...",
  "Initializing quantum core services...",
  "Calibrating neural interface...",
  "Loading cognitive drivers...",
  "Syncing with biodata stream...",
  "Authentication required.",
];

const apps: AppDefinition[] = [
  { id: 'terminal', title: 'Terminal', icon: TerminalIcon, component: TerminalApp },
  { id: 'dashboard', title: 'System Dashboard', icon: DashboardIcon, component: DashboardApp },
];

const App: React.FC = () => {
  const [bootStatus, setBootStatus] = useState<'booting' | 'login' | 'desktop'>('booting');
  const [bootLog, setBootLog] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);

  useEffect(() => {
    if (bootStatus === 'booting') {
      const bootInterval = setInterval(() => {
        setBootLog(prev => {
          if (prev.length < bootMessages.length) {
            return [...prev, bootMessages[prev.length]];
          }
          return prev;
        });
        setProgress(p => Math.min(p + 100 / (bootMessages.length + 1), 100));
      }, 700);

      const timeout = setTimeout(() => {
        clearInterval(bootInterval);
        setProgress(100);
        setTimeout(() => setBootStatus('login'), 500);
      }, 700 * (bootMessages.length + 1));
      
      return () => {
        clearInterval(bootInterval);
        clearTimeout(timeout);
      };
    }
  }, [bootStatus]);
  
  const handleLogin = () => {
    setBootStatus('desktop');
  };

  const openWindow = useCallback((app: AppDefinition) => {
    const existingWindow = windows.find(w => w.app.id === app.id);
    if (existingWindow) {
      focusWindow(existingWindow.id);
      return;
    }

    const newWindow: WindowInstance = {
      id: `${app.id}-${Date.now()}`,
      app,
      position: { x: window.innerWidth / 2 - 300 + (windows.length * 20), y: window.innerHeight / 2 - 200 + (windows.length * 20) },
      zIndex: nextZIndex,
    };
    setWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
  }, [windows, nextZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === id
          ? { ...w, zIndex: nextZIndex }
          : w
      )
    );
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  if (bootStatus === 'booting' || bootStatus === 'login') {
    return (
      <div className="fixed inset-0 bg-[#0A0F1A] flex flex-col items-center justify-center font-mono text-cyan-300 animate-fade-in">
        <div className="w-full max-w-2xl p-4">
          {bootLog.map((line, i) => (
            <p key={i} className="animate-line-in">{line}</p>
          ))}
        </div>
        <div className="w-full max-w-2xl mt-4">
          <div className="w-full bg-cyan-900/50 h-1">
            <div className="bg-cyan-300 h-1 transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        {bootStatus === 'login' && (
           <div className="mt-8 animate-fade-in-slow">
            <h1 className="text-3xl mb-4 text-white">Welcome, User</h1>
            <button 
              onClick={handleLogin}
              className="px-8 py-3 border border-cyan-300 text-cyan-300 text-lg hover:bg-cyan-300 hover:text-[#0A0F1A] transition-all duration-300"
            >
              I'M HUMAN
            </button>
           </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A0F1A]">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid"></div>
      <div className="absolute top-[-20%] left-[-20%] w-1/2 h-1/2 bg-cyan-500/30 rounded-full filter blur-3xl pulse-cyan"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-1/2 h-1/2 bg-fuchsia-500/30 rounded-full filter blur-3xl pulse-fuchsia"></div>
      
      {/* Desktop Icons */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex space-x-16">
          {apps.map(app => (
            <div 
              key={app.id} 
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => openWindow(app)}
            >
              <div className="w-20 h-20 p-4 border border-transparent group-hover:bg-white/5 group-hover:border-white/10 rounded-lg transition-all duration-300 flex items-center justify-center">
                <app.icon className="w-12 h-12 text-white group-hover:text-cyan-300 transition-colors" />
              </div>
              <span className="mt-2 text-sm text-white/80 group-hover:text-white transition-colors">{app.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Windows */}
      {windows.map(instance => (
        <Window 
          key={instance.id} 
          instance={instance} 
          onClose={closeWindow} 
          onFocus={focusWindow}
        />
      ))}
       <style>{`
        .bg-grid {
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        @keyframes fade-in-slow {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-slow { animation: fade-in-slow 1.5s ease-out; }

        @keyframes fade-in-scale {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale { animation: fade-in-scale 0.3s ease-out; }
        
        @keyframes line-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-line-in {
          display: block;
          overflow: hidden;
          white-space: nowrap;
          animation: line-in 0.5s forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
