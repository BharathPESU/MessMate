import { QRCodeCanvas } from 'qrcode.react';

const QRGenerator = ({ value, label }) => {
  if (!value) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {label && (
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-300/60">
          {label}
        </p>
      )}
      <div className="relative overflow-hidden rounded-3xl border border-brand-emerald/30 bg-surface-steel/80 p-6 shadow-emerald">
        <div className="absolute inset-[-40%] bg-gradient-to-r from-brand-emerald/10 via-transparent to-accent-indigo/10" />
        <div className="relative rounded-2xl border border-white/10 bg-black/40 p-4">
          <QRCodeCanvas value={value} size={180} level="H" includeMargin />
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
