import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScan, onError, onStop }) => {
  const [cameraError, setCameraError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState('');
  const qrCodeScannerRef = useRef(null);
  const hasStartedRef = useRef(false);
  const scanCooldownRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    
    const startScanner = async () => {
      hasStartedRef.current = true;
      
      try {
        // Wait for DOM element to be available
        const waitForElement = () => {
          return new Promise((resolve, reject) => {
            const checkElement = () => {
              const element = document.getElementById('qr-reader');
              if (element) {
                resolve(element);
              } else {
                setTimeout(checkElement, 100);
              }
            };
            checkElement();
            // Timeout after 5 seconds
            setTimeout(() => reject(new Error('QR reader element not found after timeout')), 5000);
          });
        };

        // Wait for the element to exist
        await waitForElement();
        console.log('QR reader element found');

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

        // Start the scanner with configuration to show video
        await scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.777778, // 16:9 ratio
            disableFlip: false,
            videoConstraints: {
              facingMode: 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          },
          (decodedText) => {
            console.log('QR Code detected:', decodedText);
            
            // Prevent multiple scans in quick succession
            if (scanCooldownRef.current) {
              console.log('Scan cooldown active, ignoring');
              return;
            }
            
            scanCooldownRef.current = true;
            setLastScanned(decodedText);
            
            // Call the onScan callback with the decoded text
            onScan(decodedText);
            
            // Reset cooldown after 3 seconds
            setTimeout(() => {
              scanCooldownRef.current = false;
              setLastScanned('');
            }, 3000);
          },
          () => {
            // Scan errors are normal and frequent
          }
        );
        
        console.log('Scanner started successfully');
        setCameraError(false);
        setIsScanning(true);
        
        // Debug: Check if video element exists
        setTimeout(() => {
          const videoElements = document.querySelectorAll('#qr-reader video');
          console.log('Video elements found:', videoElements.length);
          videoElements.forEach((video, idx) => {
            console.log(`Video ${idx}:`, {
              width: video.videoWidth,
              height: video.videoHeight,
              style: video.style.cssText,
              display: getComputedStyle(video).display,
              visibility: getComputedStyle(video).visibility
            });
          });
        }, 1000);
        
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

  const handleStopCamera = async () => {
    try {
      if (qrCodeScannerRef.current) {
        await qrCodeScannerRef.current.stop();
        qrCodeScannerRef.current = null;
        hasStartedRef.current = false;
        setIsScanning(false);
        setCameraError(false);
        onStop?.();
      }
    } catch (err) {
      console.error('Error stopping camera:', err);
    }
  };

  if (cameraError) {
    return (
      <div className="text-center p-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
        <div className="mb-4">
          <svg className="w-16 h-16 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-red-400 mb-2 font-medium">Camera Access Error</p>
        <p className="text-gray-300 text-sm mb-4 max-w-md mx-auto">{errorMessage}</p>
        <div className="space-y-2">
          <button
            onClick={handleRetry}
            className="bg-gradient-to-r from-messmate-primary to-messmate-secondary hover:from-messmate-primary/80 hover:to-messmate-secondary/80 text-white px-6 py-2 rounded-lg transition-all duration-300 shadow-lg"
          >
            Retry Camera
          </button>
          <p className="text-xs text-gray-400 mt-3">
            💡 For HTTP camera access: Use <span className="font-mono text-green-400">http://localhost:5173</span> instead of IP address
          </p>
          <p className="text-xs text-gray-400">
            🔒 Click lock icon in address bar → Camera → Allow
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-scanner-container space-y-4">
      {!isScanning && (
        <div className="text-center p-8 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
          <div className="mb-4">
            <div className="w-16 h-16 mx-auto border-4 border-messmate-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-300 mb-2 font-medium">Starting Camera...</p>
          <p className="text-gray-400 text-sm">Please allow camera access when prompted</p>
        </div>
      )}
      
      {/* Camera Preview */}
      <div className="relative">
        <div 
          id="qr-reader" 
          className={`rounded-xl overflow-hidden shadow-2xl border-2 border-white/10 bg-black ${!isScanning ? 'hidden' : ''}`}
          style={{ width: '100%', maxWidth: '500px', minHeight: '400px', margin: '0 auto' }}
        />
        
        {/* Last Scanned Indicator */}
        {lastScanned && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-pulse">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">QR Code Detected!</span>
          </div>
        )}
      </div>
      
      {isScanning && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
            <svg className="w-5 h-5 animate-pulse text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Camera Active - Position QR code in frame</span>
          </div>
          
          {/* Stop Camera Button */}
          <div className="flex justify-center">
            <button
              onClick={handleStopCamera}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 flex items-center gap-2 hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Stop Camera
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
