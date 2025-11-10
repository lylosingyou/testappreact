
import React, { useState, useCallback } from 'react';
import { AppID, WindowInstance, AppConfig } from '../types';
import Window from './Window';
import Icon from './Icon';
import { TerminalIcon, DashboardIcon, RestartIcon } from './icons';
import TerminalApp from './apps/TerminalApp';
import DashboardApp from './apps/DashboardApp';

const APPS: AppConfig[] = [
  {
    id: AppID.TERMINAL,
    title: 'Terminal',
    icon: <TerminalIcon />,
    component: <TerminalApp />,
    defaultSize: { width: 600, height: 400 },
  },
  {
    id: AppID.DASHBOARD,
    title: 'System Dashboard',
    icon: <DashboardIcon />,
    component: <DashboardApp />,
    defaultSize: { width: 700, height: 500 },
  },
];

interface DesktopProps {
  onRestart: () => void;
}

const Desktop: React.FC<DesktopProps> = ({ onRestart }) => {
  const [openWindows, setOpenWindows] = useState<WindowInstance[]>([]);
  const [nextZIndex, setNextZIndex] = useState(10);

  const openApp = useCallback((appId: AppID) => {
    const appConfig = APPS.find(app => app.id === appId);
    if (!appConfig) return;

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    let width: number;
    let height: number;

    // Make window sizes responsive
    if (appId === AppID.TERMINAL) {
      width = Math.round(Math.max(320, Math.min(screenW * 0.5, 600)));
      height = Math.round(Math.max(250, Math.min(screenH * 0.5, 400)));
    } else if (appId === AppID.DASHBOARD) {
      width = Math.round(Math.max(400, Math.min(screenW * 0.6, 700)));
      height = Math.round(Math.max(350, Math.min(screenH * 0.7, 500)));
    } else {
      // Fallback to default for any other apps
      ({ width, height } = appConfig.defaultSize);
    }
    
    const margin = 20; // Margin from the edge of the screen

    // Calculate a random centered position
    const randomOffsetX = (Math.random() - 0.5) * 200;
    const randomOffsetY = (Math.random() - 0.5) * 200;
    const initialX = (screenW / 2) - (width / 2) + randomOffsetX;
    const initialY = (screenH / 2) - (height / 2) + randomOffsetY;

    // Clamp position to be within screen bounds, considering the margin
    const clampedX = Math.max(
      margin,
      Math.min(initialX, screenW - width - margin)
    );
    const clampedY = Math.max(
      margin,
      Math.min(initialY, screenH - height - margin)
    );

    const newWindow: WindowInstance = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: appConfig.title,
      position: { x: clampedX, y: clampedY },
      size: { width, height },
      zIndex: nextZIndex,
    };
    
    setOpenWindows(prev => [...prev, newWindow]);
    setNextZIndex(prev => prev + 1);
  }, [nextZIndex]);

  const closeApp = useCallback((windowId: string) => {
    setOpenWindows(prev => prev.filter(win => win.id !== windowId));
  }, []);

  const focusWindow = useCallback((windowId: string) => {
    setOpenWindows(prev =>
      prev.map(win =>
        win.id === windowId && win.zIndex < nextZIndex -1
          ? { ...win, zIndex: nextZIndex }
          : win
      )
    );
    if (openWindows.find(win => win.id === windowId && win.zIndex < nextZIndex -1)) {
        setNextZIndex(prev => prev + 1);
    }
  }, [nextZIndex, openWindows]);

  const updateWindowPosition = useCallback((windowId: string, newPosition: { x: number; y: number }) => {
    setOpenWindows(prev => prev.map(win => win.id === windowId ? { ...win, position: newPosition } : win));
  }, []);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-black">
      {/* Background Elements */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(209, 213, 219, 0.05) 1px, transparent 1px), linear-gradient(to right, rgba(209, 213, 219, 0.05) 1px, transparent 1px)',
          backgroundSize: '2rem 2rem',
        }}
      />
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gray-200 rounded-full filter blur-3xl opacity-20 animate-pulse-cyan -translate-x-1/4 -translate-y-1/4"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gray-500 rounded-full filter blur-3xl opacity-20 animate-pulse-fuchsia translate-x-1/4 translate-y-1/4"></div>

      {/* Desktop Icons */}
      <div className="absolute inset-0 flex items-center justify-center z-1">
        <div className="flex space-x-16">
          {APPS.map(app => (
            <Icon
              key={app.id}
              icon={app.icon}
              label={app.title}
              onClick={() => openApp(app.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Windows */}
      {openWindows.map(win => {
        const appConfig = APPS.find(app => app.id === win.appId);
        if (!appConfig) return null;
        
        return (
          <Window
            key={win.id}
            instance={win}
            onClose={() => closeApp(win.id)}
            onFocus={() => focusWindow(win.id)}
            onDrag={pos => updateWindowPosition(win.id, pos)}
            isActive={win.zIndex === nextZIndex -1 || openWindows.length === 1}
          >
            {appConfig.component}
          </Window>
        )
      })}

      {/* Restart Button */}
      <button
        onClick={onRestart}
        className="absolute bottom-6 right-6 w-8 h-8 text-gray-500 hover:text-white transition-colors duration-300 z-50 group"
        aria-label="Restart System"
      >
        <RestartIcon />
        <span className="absolute bottom-full right-0 mb-2 whitespace-nowrap bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Restart
        </span>
      </button>
    </div>
  );
};

export default Desktop;
