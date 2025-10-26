import React from 'react';

interface AdvenTripLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const AdvenTripLogo: React.FC<AdvenTripLogoProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg', 
    lg: 'text-2xl'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} font-black text-green-500`}>
      {/* Replace with your app name or initials */}
      AT
    </div>
  );
};
