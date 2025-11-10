import React from 'react';

interface IconProps {
  icon: React.ReactElement;
  label: string;
  onClick: () => void;
}

const Icon: React.FC<IconProps> = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-28 h-28 group transition-all duration-300 rounded-lg hover:bg-white/10"
    >
      <div className="w-12 h-12 text-gray-200 transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">
        {icon}
      </div>
      <span className="mt-2 text-sm text-gray-300 transition-colors duration-300 group-hover:text-white">
        {label}
      </span>
    </button>
  );
};

export default Icon;