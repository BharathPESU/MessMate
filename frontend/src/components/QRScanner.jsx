import { useCallback, useState } from 'react';
import { QrReader } from 'react-qr-reader';

const QRScanner = ({ onScan, onError }) => {
  const [cameraError, setCameraError] = useState(null);

  const handleResult = useCallback(
    (result, error) => {
      if (result) {
        onScan(result?.text);
      }
      if (error) {
        setCameraError(error?.message || 'Camera access error');
        onError?.(error);
      }
    },
    [onError, onScan]
  );

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-black text-white shadow">
      {cameraError ? (
        <div className="bg-slate-800 p-6 text-center">
          <p className="text-red-400 mb-4">{cameraError}</p>
          <p className="text-sm text-slate-400">
            Please ensure camera permissions are granted or use a different browser.
          </p>
          <button
            onClick={() => setCameraError(null)}
            className="mt-4 rounded bg-messmate-primary px-4 py-2 text-sm text-white hover:bg-messmate-secondary"
          >
            Retry
          </button>
        </div>
      ) : (
        <QrReader
          constraints={{ 
            facingMode: 'environment',
            video: true
          }}
          onResult={handleResult}
          videoContainerStyle={{ paddingTop: '100%' }}
          videoStyle={{ objectFit: 'cover' }}
        />
      )}
    </div>
  );
};

export default QRScanner;
