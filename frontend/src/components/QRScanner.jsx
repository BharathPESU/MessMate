import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScan, onError }) => {
  const [cameraError, setCameraError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const qrCodeScannerRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    
    const startScanner = async () => {
      hasStartedRef.current = true;
      
      try {
        // Check if we're in a secure context or localhost
        const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        console.log('Security context:', {
          isSecureContext: window.isSecureContext,
          hostname: window.location.hostname,
          protocol: window.location.protocol,
          canUseCamera: isSecureContext
        });

        // First check if camera is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API not supported in this browser');
        }

        // Request camera permission explicitly first
        console.log('Requesting camera permission...');
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        // Stop the test stream
        stream.getTracks().forEach(track => track.stop());
        console.log('Camera permission granted');

        // Now start the QR scanner
        const scanner = new Html5Qrcode('qr-reader');
        qrCodeScannerRef.current = scanner;

        const devices = await Html5Qrcode.getCameras();
        console.log('Available cameras:', devices);
        
        if (!devices || devices.length === 0) {
          throw new Error('No cameras found on this device');
        }

        // Find the best camera
        let cameraId = devices[0].id;
        
        // Try to find back camera
        const backCamera = devices.find(device => {
          const label = device.label.toLowerCase();
          return label.includes('back') || 
                 label.includes('rear') || 
                 label.includes('environment') ||
                 label.includes('facing back');
        });
        
        if (backCamera) {
          cameraId = backCamera.id;
          console.log('Using back camera:', backCamera.label);
        } else {
          console.log('Using first available camera:', devices[0].label);
        }

        // Start the scanner
        await scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            console.log('QR Code detected:', decodedText);
            onScan(decodedText);
          },
          () => {
            // Scan errors are normal and frequent
          }
        );
        
        console.log('Scanner started successfully');
        setCameraError(false);
        setIsScanning(true);
        
      } catch (err) {
        console.error('Scanner error:', err);
        hasStartedRef.current = false;
        setCameraError(true);
        setIsScanning(false);
        
        let message = 'Failed to access camera. ';
        
        // Check if we're on HTTP (not localhost)
        const isHTTP = window.location.protocol === 'http:';
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          if (isHTTP && !isLocalhost) {
            message = '⚠️ Camera blocked on HTTP! Please access via http://localhost:5173 instead of IP address, or use Manual Entry mode.';
          } else {
            message = 'Camera permission denied. Click the 🔒 icon in address bar → Site settings → Camera → Allow, then click Retry.';
          }
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          message = 'No camera found. Please make sure your device has a camera.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          message = 'Camera is already in use. Please close other apps (Zoom, Teams, etc.) and try again.';
        } else if (err.message?.includes('secure') || err.message?.includes('HTTPS')) {
          message = '⚠️ Camera requires secure context. Access via http://localhost:5173 or use Manual Entry mode.';
        } else if (err.message) {
          message += err.message;
        } else {
          message += 'Please try using Manual Entry mode instead.';
        }
        
        setErrorMessage(message);
        onError?.(err);
      }
    };

    startScanner();

    return () => {
      if (qrCodeScannerRef.current) {
        qrCodeScannerRef.current.stop().catch(err => {
          console.error('Error stopping scanner:', err);
        }).finally(() => {
          qrCodeScannerRef.current = null;
        });
      }
    };
  }, [onScan, onError]);

  const handleRetry = () => {
    setCameraError(false);
    setErrorMessage('');
    setIsScanning(false);
    hasStartedRef.current = false;
    
    // Force component remount
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (cameraError) {
    return (
      <div className="glass-dark neon-border text-center p-8 rounded-xl border-2 border-red-500/30 shadow-cyber">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-red-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-red-400 mb-2 font-semibold font-orbitron">Camera Access Error</p>
        <p className="text-neon-light/70 text-sm mb-6 max-w-md mx-auto font-rajdhani leading-relaxed">{errorMessage}</p>
        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="cyber-btn"
          >
            Retry Camera
          </button>
          <p className="text-xs text-neon-cyan/60 mt-4 font-rajdhani">
            💡 For HTTP camera access: Use <span className="font-mono text-neon-green px-1.5 py-0.5 bg-cyber-black/50 rounded">http://localhost:5173</span> instead of IP address
          </p>
          <p className="text-xs text-neon-cyan/60 font-rajdhani">
            🔒 Click lock icon in address bar → Camera → Allow
          </p>
        </div>
      </div>
    );
  }

  if (!isScanning) {
    return (
      <div className="glass-dark text-center p-10 rounded-xl border border-neon-green/20 shadow-cyber">
        <div className="mb-4">
          <div className="cyber-loader mx-auto"></div>
        </div>
        <p className="text-neon-green mb-2 font-semibold font-orbitron">Starting Camera...</p>
        <p className="text-neon-light/70 text-sm font-rajdhani">Please allow camera access when prompted</p>
      </div>
    );
  }

  return (
    <div className="qr-scanner-container">
      <div 
        id="qr-reader" 
        className="neon-border rounded-xl overflow-hidden shadow-neon-lg bg-cyber-black animate-glow-pulse"
        style={{ width: '100%', maxWidth: '500px', margin: '0 auto' }}
      />
      <p className="text-center text-sm text-neon-light/70 mt-6 flex items-center justify-center gap-2 font-rajdhani tracking-wide">
        <svg className="w-5 h-5 animate-pulse text-neon-green" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Camera Active - Position QR code in frame
      </p>
    </div>
  );
};

export default QRScanner;
