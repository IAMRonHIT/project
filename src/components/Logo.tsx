import React from 'react';

interface LogoProps {
  className?: string;
  isCollapsed?: boolean;
}

const Logo = ({ className = '', isCollapsed = false }: LogoProps) => {
  return (
    <div className={`inline-flex ml-2 ${className}`}>
      <img 
        src={isCollapsed ? "/Crosss.png" : "/Ron Ai.png"}
        alt="Ron AI Logo" 
        className={`${
          isCollapsed ? 'w-12 h-12' : 'w-[550px]'
        } object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] filter hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.7)] transition-all duration-300`}
      />
    </div>
  );
};

export default Logo;