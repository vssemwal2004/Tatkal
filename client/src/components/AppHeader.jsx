import { ArrowRight, LogOut, User } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const AppHeader = () => {
  const { client, isAuthenticated, role, logout, user } = useAuth();
  const isClient = isAuthenticated && role === 'client';
  const profileName = useMemo(() => client?.name || user?.name || 'Client', [client?.name, user?.name]);
  const profileEmail = useMemo(() => client?.email || user?.email || '', [client?.email, user?.email]);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link className="flex items-center" to={isClient ? '/client/dashboard' : '/'}>
          <img src="/logo.png" alt="Tatkal" className="h-10 w-auto select-none" draggable="false" />
        </Link>

        <div className="flex items-center gap-2">
          {isClient ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-[color:var(--color-secondary)] shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)] focus:outline-none focus:ring-4 focus:ring-[color:rgba(178,75,243,0.18)]"
              >
                <User className="h-5 w-5" />
              </button>

              {open ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.14)]"
                >
                  <div className="px-4 py-4">
                    <p className="text-sm font-semibold text-slate-950">{profileName}</p>
                    {profileEmail ? <p className="mt-1 text-sm text-slate-600">{profileEmail}</p> : null}
                  </div>

                  <div className="border-t border-slate-200 p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      role="menuitem"
                    >
                      <span>Logout</span>
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-[color:var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(178,75,243,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(178,75,243,0.34)]"
            >
              <span>Login</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
