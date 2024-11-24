import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo = ({ className = '' }: LogoProps) => {
  return (
    <div className={`inline-flex ${className}`}>
      <img 
        src="/src/components/dd8ed488-9284-4452-9259-cf3f451e09bb.png"
        alt="Ron AI Logo" 
        className={`object-contain ${className}`}
      />
    </div>
  );
};

export default Logo;