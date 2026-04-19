import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value }) => {
  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">
        Strip QR Code
      </h3>

      <QRCodeSVG
        value={value}
        size={200}
        level="M"
        includeMargin={true}
      />

      <p className="text-sm text-gray-600 text-center max-w-xs">
        This QR stores the strip ID, not the full image.
      </p>
    </div>
  );
};