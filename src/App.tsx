import React, { useState } from 'react';
import { PhotoData, PhotoStrip, FilterType } from './types';
import { CameraView } from './components/Camera/CameraView';
import { PhotoStripPreview } from './components/PhotoStrip/PhotoStripPreview';
import { ExportButtons } from './components/Export/ExportButtons';
import { QRCodeDisplay } from './components/Export/QRCodeDisplay';
import { AlbumGrid } from './components/Album/AlbumGrid';
import { useIndexedDB } from './hooks/useIndexedDB';
import { composePhotoStrip } from './utils/imageProcessing';
import './components/Export/PrintStyles.css';

type Screen = 'home' | 'camera' | 'preview' | 'export' | 'album';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [capturedPhotos, setCapturedPhotos] = useState<PhotoData[]>([]);
  const [currentStrip, setCurrentStrip] = useState<PhotoStrip | null>(null);
  const [filter, setFilter] = useState<FilterType>('color');
  const [customText, setCustomText] = useState('');
  
  const { strips, saveStrip } = useIndexedDB();

  const handleStartPhotobooth = () => {
    setCurrentScreen('camera');
    setCapturedPhotos([]);
    setCustomText('');
    setFilter('color');
    setCurrentStrip(null);
  };

  const handleCaptureComplete = (photos: PhotoData[]) => {
    setCapturedPhotos(photos);
    setCurrentScreen('preview');
  };

  const handleContinueToExport = async () => {
    const date = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const composedUrl = await composePhotoStrip(
      capturedPhotos,
      customText,
      date,
      filter
    );

    const strip: PhotoStrip = {
      id: `strip-${Date.now()}`,
      photos: capturedPhotos,
      customText,
      date,
      filter,
      composedImageUrl: composedUrl,
      createdAt: Date.now(),
    };

    await saveStrip(strip);
    setCurrentStrip(strip);
    setCurrentScreen('export');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-5xl font-bold mb-4">Photobooth</h1>
            <p className="text-xl text-gray-600 mb-8">Capture 4 photos in classic strip style</p>
            <button
              onClick={handleStartPhotobooth}
              className="px-12 py-4 bg-red-600 text-white text-xl font-bold rounded-full hover:bg-red-700 transition"
            >
              Start Photobooth
            </button>
            {strips.length > 0 && (
              <button
                onClick={() => setCurrentScreen('album')}
                className="mt-4 px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
              >
                View Album ({strips.length})
              </button>
            )}
          </div>
        );

      case 'camera':
        return (
          <CameraView
            onCaptureComplete={handleCaptureComplete}
            onCancel={() => setCurrentScreen('home')}
          />
        );

      case 'preview':
        return (
          <PhotoStripPreview
            photos={capturedPhotos}
            filter={filter}
            customText={customText}
            onFilterChange={setFilter}
            onTextChange={setCustomText}
            onRetake={() => setCurrentScreen('camera')}
            onContinue={handleContinueToExport}
          />
        );

      case 'export':
        if (!currentStrip) {
          return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
              <div className="text-center">
                <p className="text-xl text-gray-600 mb-4">No photo strip available</p>
                <button
                  onClick={handleStartPhotobooth}
                  className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Start New Photobooth
                </button>
              </div>
            </div>
          );
        }

        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
            <h2 className="text-3xl font-bold mb-8">Your Photo Strip</h2>
            
            <img
              src={currentStrip.composedImageUrl}
              alt="Photo strip"
              className="max-w-sm shadow-2xl mb-8"
            />

            <ExportButtons
              stripImageUrl={currentStrip.composedImageUrl}
              stripId={currentStrip.id}
            />

            <div className="mt-8">
              <QRCodeDisplay value={`strip:${currentStrip.id}`} />
            </div>

            <div className="mt-8 flex space-x-4">
              <button
                onClick={handleStartPhotobooth}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Take Another
              </button>
              <button
                onClick={() => setCurrentScreen('album')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View Album
              </button>
            </div>

            {/* Hidden printable div */}
            <div id="printable-strip">
              <img src={currentStrip.composedImageUrl} alt="Photo strip for printing" />
            </div>
          </div>
        );

      case 'album':
        return (
          <AlbumGrid
            strips={strips}
            onSelectStrip={(strip) => {
              setCurrentStrip(strip);
              setCurrentScreen('export');
            }}
            onBack={() => setCurrentScreen('home')}
          />
        );

      default:
        return null;
    }
  };

  return <div className="App">{renderScreen()}</div>;
}

export default App;