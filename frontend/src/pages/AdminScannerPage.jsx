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
    <div className="mx-auto max-w-3xl space-y-6 py-8">
      {/* HTTP Camera Access Info Banner */}
      {window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && (
        <div className="glass-dark rounded-2xl p-4 border-l-4 border-yellow-400">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-400">Camera Access Limited on HTTP</h3>
              <p className="mt-1 text-xs text-white/70">
                For camera scanner to work, access this page via{' '}
                <span className="font-mono bg-black/30 px-1.5 py-0.5 rounded text-green-400">http://localhost:5173</span>{' '}
                instead of the IP address. Or use Manual Entry mode below.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="glass-dark rounded-3xl p-6 shadow-2xl">
        <h1 className="text-xl font-semibold text-white">QR Scanner</h1>
        <p className="mt-1 text-sm text-white/60">
          Scan a student's QR code or enter manually to deduct credits.
        </p>

        <div className="mt-6 flex gap-2">
          <button
            onClick={() => setUseManual(false)}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
              !useManual
                ? 'bg-gradient-to-r from-messmate-primary to-messmate-secondary text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Camera Scanner
          </button>
          <button
            onClick={() => setUseManual(true)}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
              useManual
                ? 'bg-gradient-to-r from-messmate-primary to-messmate-secondary text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Manual Entry
          </button>
        </div>

        <div className="mt-6">
          {useManual ? (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80">QR Code Data</label>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Paste QR code data here"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 backdrop-blur-sm focus:border-messmate-primary focus:outline-none focus:ring-2 focus:ring-messmate-primary/50"
                />
              </div>
              <button
                type="submit"
                disabled={scanning || !manualInput.trim()}
                className="w-full rounded-xl bg-gradient-to-r from-messmate-primary to-messmate-secondary px-4 py-3 font-medium text-white shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
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

        <div className="mt-6 rounded-xl bg-white/5 p-4">
          <p className="text-sm font-medium text-white/80">Status</p>
          <p className="mt-2 text-sm text-white/70">{status}</p>
          {error && <p className="mt-2 rounded-xl bg-red-500/20 p-3 text-sm text-red-200">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminScannerPage;
