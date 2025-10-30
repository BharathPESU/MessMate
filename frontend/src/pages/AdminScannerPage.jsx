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
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow">
        <h1 className="text-lg font-semibold text-slate-800">QR Scanner</h1>
        <p className="mt-1 text-sm text-slate-500">
          Scan a student's QR code or enter manually to deduct credits.
        </p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setUseManual(false)}
            className={`rounded px-4 py-2 text-sm font-medium transition ${
              !useManual
                ? 'bg-messmate-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Camera Scanner
          </button>
          <button
            onClick={() => setUseManual(true)}
            className={`rounded px-4 py-2 text-sm font-medium transition ${
              useManual
                ? 'bg-messmate-primary text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Manual Entry
          </button>
        </div>

        <div className="mt-4">
          {useManual ? (
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-600">QR Code Data</label>
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Paste QR code data here"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-messmate-secondary focus:outline-none focus:ring"
                />
              </div>
              <button
                type="submit"
                disabled={scanning || !manualInput.trim()}
                className="w-full rounded-lg bg-messmate-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-messmate-secondary disabled:cursor-not-allowed disabled:opacity-50"
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

        <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-4 text-sm">
          <p className="font-medium text-slate-600">Status</p>
          <p className="mt-1 text-slate-500">{status}</p>
          {error && <p className="mt-2 rounded bg-red-50 p-2 text-red-600">{error}</p>}
        </div>
      </section>
    </div>
  );
};

export default AdminScannerPage;
