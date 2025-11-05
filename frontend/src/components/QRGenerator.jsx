import { QRCodeCanvas } from 'qrcode.react';

const QRGenerator = ({ value, label }) => {
  if (!value) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {label && <p className="text-sm font-medium text-white/60">{label}</p>}
      <div className="glass-dark rounded-2xl p-6 shadow-2xl">
        <QRCodeCanvas value={value} size={180} level="H" includeMargin />
      </div>
    </div>
  );
};

export default QRGenerator;
