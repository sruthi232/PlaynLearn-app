import React, { useState } from 'react';

interface RobustQRCodeProps {
  value: string;
  size?: number;
  level?: string;
  includeMargin?: boolean;
}

export function RobustQRCode({ value, size = 200, level = "H", includeMargin = true }: RobustQRCodeProps) {
  const [imageError, setImageError] = useState(false);
  
  console.log('RobustQRCode rendering with value:', value);
  
  // Multiple QR service options
  const qrServices = [
    `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&ecc=${level}`,
    `https://chart.googleapis.com/chart?chs=${size}x${size}&cht=qr&chl=${encodeURIComponent(value)}`,
    `https://quickchart.io/qr?text=${encodeURIComponent(value)}&size=${size}`
  ];
  
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  
  const handleImageError = () => {
    console.error('QR service failed, trying next service or fallback');
    if (currentServiceIndex < qrServices.length - 1) {
      setCurrentServiceIndex(currentServiceIndex + 1);
    } else {
      setImageError(true);
    }
  };
  
  if (imageError) {
    // Final fallback - show the code directly
    return (
      <div 
        className="flex flex-col items-center justify-center bg-white border-2 border-gray-300 rounded p-4"
        style={{ width: size, height: size }}
      >
        <div className="text-center">
          <div className="text-3xl mb-3">📱</div>
          <div className="text-lg font-mono font-bold text-gray-800 break-all px-2 mb-2">
            {value}
          </div>
          <div className="text-xs text-gray-600">
            Show this code to your teacher
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center">
      <img
        src={qrServices[currentServiceIndex]}
        alt="QR Code"
        width={size}
        height={size}
        className="border border-gray-200 rounded shadow-sm"
        style={{
          maxWidth: size,
          maxHeight: size,
          margin: includeMargin ? '8px' : '0'
        }}
        onLoad={() => console.log('QR image loaded successfully from service', currentServiceIndex)}
        onError={handleImageError}
      />
    </div>
  );
}