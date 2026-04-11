import { ArrowRight, ChevronDown, LogOut, UserCircle2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const AppHeader = () => {
  const { client, isAuthenticated, role, logout } = useAuth();
  const showDashboardLink = isAuthenticated && role === 'client';
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    if (!profileOpen) {
      return undefined;
    }

    const handleClickOutside = (event) => {
      if (!profileRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  return (
    <header className="client-header sticky top-0 z-40">
      <div className="flex w-full items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link className="flex items-center" to={showDashboardLink ? '/client/dashboard' : '/'}>
          <div className="client-logo-mark flex h-11 w-11 items-center justify-center rounded-2xl text-xs font-bold tracking-[0.22em] text-white">
            TK
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {showDashboardLink ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(13,67,97,0.12)] bg-white px-3 py-2 text-sm text-[var(--color-secondary)] shadow-[0_12px_28px_rgba(13,67,97,0.08)] transition hover:border-[rgba(178,75,243,0.24)] hover:bg-[rgba(178,75,243,0.04)]"
              >
                <UserCircle2 className="h-5 w-5 text-[var(--color-primary)]" />
                <ChevronDown className={`h-4 w-4 transition ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen ? (
                <div className="absolute right-0 mt-3 w-72 rounded-[24px] border border-[rgba(13,67,97,0.12)] bg-white p-4 shadow-[0_24px_50px_rgba(13,67,97,0.12)]">
                  <div className="rounded-[20px] bg-[linear-gradient(135deg,rgba(178,75,243,0.12),rgba(13,67,97,0.07))] p-4">
                    <p className="text-sm font-semibold text-slate-950">{client?.name || 'Client'}</p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">{client?.email || 'No email available'}</p>
                  </div>

                  <button className="button-secondary mt-4 w-full justify-center" onClick={logout} type="button">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <Link to="/login" className="button-primary">
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
