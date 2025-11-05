import { cn } from '../utils/cn.js';

const StatsCard = ({ title, value, icon: Icon, trend, trendLabel, subtext, variant = 'emerald' }) => {
  const variantStyles = {
    emerald: 'from-brand-emerald/25 to-accent-aqua/25 border-brand-emerald/40 text-brand-emerald',
    aqua: 'from-accent-aqua/20 to-accent-indigo/20 border-accent-aqua/40 text-accent-aqua',
    purple: 'from-accent-purple/20 to-accent-indigo/20 border-accent-purple/40 text-accent-purple',
  };

  return (
    <div className={cn(
      'relative overflow-hidden rounded-3xl border bg-surface-slate/60 p-6 backdrop-blur-glass transition duration-500 hover:-translate-y-1 hover:border-brand-emerald/40',
      'shadow-inner-glow hover:shadow-emerald',
    )}>
      <div className="absolute inset-0 opacity-80" style={{
        background: 'linear-gradient(140deg, rgba(13, 17, 23, 0.4), rgba(13, 17, 23, 0.25))'
      }} />
      <div className={`absolute inset-0 bg-gradient-to-br ${variantStyles[variant] || variantStyles.emerald}`} />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-300/80">{title}</p>
          <p className="mt-4 font-poppins text-3xl font-semibold text-white">{value}</p>
          {subtext && <p className="mt-2 text-sm text-neutral-200/70">{subtext}</p>}
        </div>
        {Icon && (
          <div className="rounded-2xl border border-white/10 bg-black/30 p-3 shadow-inner-glow">
            <Icon className="h-6 w-6 text-brand-emerald" />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="relative z-10 mt-5 flex items-center gap-2 text-sm">
          <span className={`rounded-full px-2.5 py-1 font-semibold ${trend >= 0 ? 'bg-brand-emerald/20 text-brand-emerald' : 'bg-red-500/20 text-red-300'}`}>
            {trend >= 0 ? `▲ ${trend}%` : `▼ ${Math.abs(trend)}%`}
          </span>
          {trendLabel && <span className="text-neutral-200/60">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
};

export default StatsCard;
