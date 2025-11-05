import { Layers } from 'lucide-react';
import { useState } from 'react';
import ModernDashboard from './ModernDashboard.jsx';
import LegacyDashboard from './LegacyDashboard.jsx';

const AdminDashboard = () => {
  const [view, setView] = useState('modern');

  return (
    <div className="relative space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-surface-slate/70 p-5 backdrop-blur-glass shadow-inner-glow sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-300/60">View Mode</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Choose your dashboard experience</h2>
          <p className="mt-1 text-sm text-neutral-300/60">
            Switch between the brand-new modern console and the legacy dashboard at any time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView('legacy')}
            className={`cyber-btn-outline ${view === 'legacy' ? 'border-brand-emerald text-brand-emerald' : 'opacity-70'} w-full sm:w-auto`}
          >
            Legacy
          </button>
          <button
            type="button"
            onClick={() => setView('modern')}
            className={`cyber-btn w-full sm:w-auto ${view === 'modern' ? '' : 'opacity-70'}`}
          >
            <Layers className="h-4 w-4" />
            Modern
          </button>
        </div>
      </div>

      <div className="relative z-10">
        {view === 'modern' ? <ModernDashboard /> : <LegacyDashboard />}
      </div>
    </div>
  );
};

export default AdminDashboard;
