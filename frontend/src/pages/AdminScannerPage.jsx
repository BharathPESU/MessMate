import { useState } from 'react';
import QRScanner from '../components/QRScanner.jsx';
import { scanAndDeduct } from '../api/adminApi.js';

const AdminScannerPage = () => {
  const [status, setStatus] = useState('Align the QR code within the frame to process a meal.');
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [useManual, setUseManual] = useState(false);

  const handleScan = async (data) => {
    if (!data || scanning) return;
    setScanning(true);
    setError('');
    setStatus('Processing scan...');

    try {
      const response = await scanAndDeduct({ qrData: data, amount: 1 });
      setStatus(`✅ Success! User now has ${response.newBalance} credits remaining.`);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deduct credits');
      setStatus('Scan failed. Please try again.');
    } finally {
      setTimeout(() => setScanning(false), 2000);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    await handleScan(manualInput.trim());
    setManualInput('');
  };

  return (
    <div className="relative mx-auto max-w-3xl space-y-6 py-8">
      {/* HTTP Camera Access Info Banner */}
      {window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && (
        <div className="glass-card border-l-4 border-yellow-400 rounded-2xl p-4 shadow-cyber">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold font-rajdhani text-yellow-400">Camera Access Limited on HTTP</h3>
              <p className="mt-1 text-xs text-neon-light/70 font-rajdhani">
                For camera scanner to work, access this page via{' '}
                <span className="font-mono bg-cyber-black/50 px-1.5 py-0.5 rounded text-neon-green">http://localhost:5173</span>{' '}
                instead of the IP address. Or use Manual Entry mode below.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card neon-border rounded-3xl p-8 shadow-cyber animate-float">
        <h1 className="text-2xl font-semibold font-orbitron neon-glow">QR Scanner</h1>
        <p className="mt-2 text-sm text-neon-light/70 font-rajdhani tracking-wide">
          Scan a student's QR code or enter manually to deduct credits.
        </p>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => setUseManual(false)}
            className={`rounded-full px-6 py-3 text-sm font-medium font-rajdhani tracking-wide transition-all duration-300 ${
              !useManual
                ? 'bg-gradient-to-r from-neon-emerald to-neon-green text-cyber-black shadow-neon-lg'
                : 'bg-white/5 text-neon-light/70 border border-neon-green/20 hover:border-neon-green/50 hover:text-neon-green'
            }`}
          >
            Camera Scanner
          </button>
          <button
            onClick={() => setUseManual(true)}
            className={`rounded-full px-6 py-3 text-sm font-medium font-rajdhani tracking-wide transition-all duration-300 ${
              useManual
                ? 'bg-gradient-to-r from-neon-emerald to-neon-green text-cyber-black shadow-neon-lg'
                : 'bg-white/5 text-neon-light/70 border border-neon-green/20 hover:border-neon-green/50 hover:text-neon-green'
            }`}
          >
            Manual Entry
          </button>
        </div>

        <div className="mt-8">
          {useManual ? (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium font-rajdhani tracking-wide text-neon-green">
                  QR Code Data
                </label>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Paste QR code data here"
                  className="cyber-input mt-2 w-full"
                />
              </div>
              <button
                type="submit"
                disabled={scanning || !manualInput.trim()}
                className="cyber-btn w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {scanning ? 'Processing...' : 'Deduct Credit'}
              </button>
            </form>
          ) : (
            <QRScanner
              onScan={handleScan}
              onError={(err) => {
                setError(err?.message || 'Camera access denied');
                setStatus('Camera error. Try manual entry instead.');
              }}
            />
          )}
        </div>

        <div className="mt-8 glass-dark rounded-xl border border-neon-green/20 p-5">
          <p className="text-sm font-medium font-rajdhani tracking-wide text-neon-cyan">Status</p>
          <p className="mt-3 text-sm text-neon-light/80 font-rajdhani">{status}</p>
          {error && (
            <div className="status-error mt-3">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminScannerPage;
