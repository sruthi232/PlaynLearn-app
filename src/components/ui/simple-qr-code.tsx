import React from 'react';

interface SimpleQRCodeProps {
  value: string;
  size?: number;
  level?: string;
  includeMargin?: boolean;
}

export function SimpleQRCode({ value, size = 200, level = "H", includeMargin = true }: SimpleQRCodeProps) {
  console.log('SimpleQRCode rendering with value:', value);
  
  // Use QR Server API as fallback when qrcode.react is not available
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&ecc=${level}`;
  
  console.log('QR URL generated:', qrUrl);
  
  return (
    <div className="flex items-center justify-center">
      <img
        src={qrUrl}
        alt="QR Code"
        width={size}
        height={size}
        className="border border-gray-200 rounded"
        style={{
          maxWidth: size,
          maxHeight: size,
          margin: includeMargin ? '8px' : '0'
        }}
        onLoad={() => console.log('QR image loaded successfully')}
        onError={(e) => {
          console.error('QR image failed to load, showing fallback');
          // Fallback to a simple text display if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent && !parent.querySelector('.qr-fallback')) {
            const fallback = document.createElement('div');
            fallback.className = 'qr-fallback flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded p-4';
            fallback.style.width = `${size}px`;
            fallback.style.height = `${size}px`;
            fallback.innerHTML = `
              <div class="text-center">
                <div class="text-2xl mb-2">📱</div>
                <div class="text-sm font-mono font-bold text-gray-700 break-all px-2">${value}</div>
                <div class="text-xs text-gray-500 mt-2">Show this code to teacher</div>
              </div>
            `;
            parent.appendChild(fallback);
          }
        }}
      />
    </div>
  );
}