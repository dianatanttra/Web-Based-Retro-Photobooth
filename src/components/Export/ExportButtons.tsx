import React from 'react';

interface ExportButtonsProps {
  stripImageUrl: string;
  stripId: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  stripImageUrl,
  stripId,
}) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = stripImageUrl;
    link.download = `photobooth-${stripId}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col space-y-3 w-full max-w-sm">
      <button
        onClick={handleDownload}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Download JPEG
      </button>
      
      <button
        onClick={handlePrint}
        className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
      >
        Print Strip
      </button>
    </div>
  );
};