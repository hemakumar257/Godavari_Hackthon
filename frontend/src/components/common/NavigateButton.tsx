import React from 'react';
import { Navigation } from 'lucide-react';
import { Coordinates } from '../../types/phase2';
import { useLanguage } from '../../hooks/useLanguage';

interface NavigateButtonProps {
  coordinates: Coordinates;
  label?: string;
  travelMode?: 'walking' | 'driving';
  userCoords?: Coordinates | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const NavigateButton: React.FC<NavigateButtonProps> = ({
  coordinates,
  label,
  travelMode = 'walking',
  userCoords,
  className = '',
  size = 'md',
}) => {
  const { isTe } = useLanguage();

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    let url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}&travelmode=${travelMode}`;
    if (userCoords) {
      url += `&origin=${userCoords.lat},${userCoords.lng}`;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const defaultLabel = isTe ? 'నావిగేట్ చేయండి' : 'Navigate';
  const displayLabel = label || defaultLabel;

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      onClick={handleNavigate}
      className={`inline-flex items-center justify-center font-medium rounded-lg bg-godavari-blue-600 hover:bg-godavari-blue-700 text-white shadow-sm transition-all duration-150 active:scale-[0.98] ${sizeStyles[size]} ${className}`}
      title={isTe ? 'గూగుల్ మ్యాప్స్‌లో దిశలను తెరవండి' : 'Open directions in Google Maps'}
    >
      <Navigation className="w-4 h-4 shrink-0 text-white" />
      <span>{displayLabel}</span>
    </button>
  );
};
