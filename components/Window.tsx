
import React, { useState, useRef, useEffect } from 'react';
import type { WindowInstance } from '../types';

interface WindowProps {
  instance: WindowInstance;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
}

const Window: React.FC<WindowProps> = ({ instance, onClose, onFocus }) => {
  const { id, app, position, zIndex } = instance;
  const [isDragging, setIsDragging] = useState(false);
  const [relPos, setRelPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState(position);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPos(position);
  }, [position]);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if (!windowRef.current) return;
    onFocus(id);
    const rect = windowRef.current.getBoundingClientRect();
    setRelPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
    e.preventDefault();
    e.stopPropagation();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setCurrentPos({
      x: e.clientX - relPos.x,
      y: e.clientY - relPos.y,
    });
    e.preventDefault();
    e.stopPropagation();
  };

  const onMouseUp = (e: MouseEvent) => {
    setIsDragging(false);
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  return (
    <div
      ref={windowRef}
      className="absolute w-[600px] h-[400px] bg-black/20 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl shadow-black/50 flex flex-col transition-all duration-300 animate-fade-in-scale"
      style={{
        left: `${currentPos.x}px`,
        top: `${currentPos.y}px`,
        zIndex,
      }}
      onMouseDown={() => onFocus(id)}
    >
      <div
        className="window-drag-handle h-8 flex items-center justify-between px-3 bg-white/10 rounded-t-lg"
        onMouseDown={onMouseDown}
      >
        <div className="flex items-center space-x-2">
          <app.icon className="w-4 h-4 text-cyan-300" />
          <span className="text-sm font-semibold text-white/90">{app.title}</span>
        </div>
        <button
          onClick={() => onClose(id)}
          className="w-5 h-5 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors flex items-center justify-center text-white text-xs"
        >
          &#10005;
        </button>
      </div>
      <div className="flex-grow overflow-hidden">
        <app.component />
      </div>
    </div>
  );
};

export default Window;
