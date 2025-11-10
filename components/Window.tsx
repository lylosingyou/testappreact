import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { WindowInstance } from '../types';

interface WindowProps {
  instance: WindowInstance;
  onClose: () => void;
  onFocus: () => void;
  onDrag: (position: { x: number; y: number }) => void;
  children: React.ReactNode;
  isActive: boolean;
}

const Window: React.FC<WindowProps> = ({ instance, onClose, onFocus, onDrag, children, isActive }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!windowRef.current) return;
    onFocus();
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const newPos = {
      x: e.clientX - dragOffsetRef.current.x,
      y: e.clientY - dragOffsetRef.current.y,
    };
    onDrag(newPos);
  }, [isDragging, onDrag]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      ref={windowRef}
      className={`absolute flex flex-col rounded-lg shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-xl bg-gray-900/40 border transition-all duration-300 ease-out ${isActive ? 'border-gray-300/60 shadow-[0_0_30px_rgba(255,255,255,0.2)]' : 'border-gray-500/20'} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      style={{
        left: instance.position.x,
        top: instance.position.y,
        width: instance.size.width,
        height: instance.size.height,
        zIndex: instance.zIndex,
      }}
      onMouseDown={onFocus}
    >
      <div
        className={`flex items-center justify-between px-3 h-8 bg-black/30 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-bold text-gray-300">{instance.title}</span>
        <button
          onClick={handleClose}
          className="w-4 h-4 rounded-full bg-gray-400/80 flex items-center justify-center text-black font-bold text-xs transition-all duration-200 hover:bg-gray-200"
        >
          &times;
        </button>
      </div>
      <div className="flex-grow p-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default Window;