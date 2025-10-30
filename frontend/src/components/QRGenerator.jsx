import { QRCodeCanvas } from 'qrcode.react';

const QRGenerator = ({ value, label }) => {
  if (!value) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {label && <p className="text-sm text-slate-500">{label}</p>}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <QRCodeCanvas value={value} size={160} level="H" includeMargin />
      </div>
    </div>
  );
};

export default QRGenerator;
