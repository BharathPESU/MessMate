import { NavLink } from 'react-router-dom';
import { Gauge, QrCode, Users, BarChart3, Settings } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: Gauge, to: '/admin' },
  { label: 'Scanner', icon: QrCode, to: '/admin/scanner' },
  { label: 'Users', icon: Users, to: '/admin?tab=users' },
  { label: 'Reports', icon: BarChart3, to: '/admin?tab=reports', disabled: true },
  { label: 'Settings', icon: Settings, to: '/admin?tab=settings', disabled: true },
];

const Sidebar = ({ className = '' }) => {
  return (
    <aside className={`glass-card relative z-20 hidden h-full min-h-[640px] w-72 flex-col border border-white/10 bg-surface-slate/70 pb-6 pt-8 lg:flex ${className}`}>
      <div className="px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-300/70">
          MessMate
        </p>
        <h2 className="mt-3 font-poppins text-2xl font-semibold text-white">Control</h2>
      </div>
      <div className="mt-8 flex-1 space-y-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return item.disabled ? (
            <div key={item.label} className="sidebar-link cursor-not-allowed opacity-40">
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              <span className="ml-auto rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-neutral-300/60">
                Soon
              </span>
            </div>
          ) : (
            <NavLink key={item.label} to={item.to} className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }>
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
      <div className="mt-auto px-6">
        <div className="rounded-3xl border border-brand-emerald/15 bg-surface-steel/70 p-4 text-xs text-neutral-300/70">
          <p className="font-semibold text-neutral-100">Shift Overview</p>
          <p className="mt-1 text-neutral-300/60">Monitor real-time scans, credit adjustments, and user activity from a single glass dashboard.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
