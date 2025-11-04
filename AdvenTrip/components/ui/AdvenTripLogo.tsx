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
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <img 
        src="/AdvenTrip Logo.png" 
        alt="AdvenTrip Logo" 
        className="w-full h-full object-cover rounded-lg scale-170"
        style={{ objectFit: 'cover', borderRadius: '10px', scale: '1.8', border: '3px solid #2b8061' }}
      />
    </div>
  );
};