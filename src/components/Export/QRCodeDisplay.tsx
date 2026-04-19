import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  dataUrl: string;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ dataUrl }) => {
  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">
        Scan to Download
      </h3>
      <QRCodeSVG
        value={dataUrl}
        size={200}
        level="M"
        includeMargin={true}
      />
      <p className="text-sm text-gray-600 text-center max-w-xs">
        Scan this code with your phone's camera to download the photo strip
      </p>
    </div>
  );
};