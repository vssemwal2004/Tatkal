import { LayoutDashboard, ListChecks, Rocket, Settings, Users, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Requests', to: '/requests', icon: ListChecks },
  { label: 'Management', to: '/management', icon: Users },
  { label: 'Deployments', to: '/deployments', icon: Rocket },
  { label: 'Settings', to: '/settings', icon: Settings }
];

const navLinkClassName = (isActive) =>
  `flex items-center gap-3 rounded-2xl px-3 py-3 transition ${
    isActive ? 'bg-brand-500/20 text-brand-200' : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
  }`;

const SidebarLinks = ({ expanded = false, onNavigate }) => (
  <nav className="space-y-2">
    {menuItems.map((item) => {
      const Icon = item.icon;
      return (
        <NavLink key={item.to} to={item.to} onClick={onNavigate} className={({ isActive }) => navLinkClassName(isActive)}>
          <Icon className="h-5 w-5 shrink-0" />
          <span
            className={`whitespace-nowrap text-sm transition-opacity duration-200 ${
              expanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            {item.label}
          </span>
        </NavLink>
      );
    })}
  </nav>
);

const Sidebar = ({ mobileOpen, onClose }) => (
  <>
    <div
      className={`fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm transition md:hidden ${
        mobileOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
      onClick={onClose}
    />

    <aside className="group fixed left-4 top-4 z-20 hidden h-[calc(100vh-2rem)] w-20 overflow-hidden rounded-3xl border border-slate-700/60 bg-slate-900/85 p-3 shadow-glow backdrop-blur-md transition-all duration-300 hover:w-64 md:block">
      <div className="mb-6 flex h-14 items-center rounded-2xl border border-slate-700/70 bg-slate-800/80 px-3">
        <span className="text-lg font-semibold tracking-[0.24em] text-brand-300">T</span>
        <span className="ml-3 whitespace-nowrap text-sm font-semibold text-slate-100 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          TATKAL Admin
        </span>
      </div>
      <SidebarLinks />
    </aside>

    <aside
      className={`fixed inset-y-4 left-4 z-40 w-[min(18rem,calc(100vw-2rem))] rounded-3xl border border-slate-700/60 bg-slate-900/95 p-4 shadow-glow backdrop-blur-md transition duration-300 md:hidden ${
        mobileOpen ? 'translate-x-0 opacity-100' : '-translate-x-[120%] opacity-0'
      }`}
    >
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-700/70 bg-slate-800/80 px-4 py-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">TATKAL</p>
          <p className="text-sm font-semibold text-slate-100">Admin Panel</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-xl border border-white/10 p-2 text-slate-300">
          <X className="h-4 w-4" />
        </button>
      </div>
      <SidebarLinks expanded onNavigate={onClose} />
    </aside>
  </>
);

export default Sidebar;
