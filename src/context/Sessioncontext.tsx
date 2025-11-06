'use client';

import { getAuthenticatedInfo } from '@/app/api/user';
import { createContext, useContext, useEffect, useState } from 'react';

interface UserSession {
  id: string;
  name: string;
  email: string;
  avaUrl?: string;
  role: 'patient' | 'doctor' | 'admin' | string;
}

interface SessionContextType {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  session: UserSession | null;
  setSession: (value: UserSession | null) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextType>({
  status: 'loading',
  session: null,
  setSession: () => {},
  logout: () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<
    'loading' | 'authenticated' | 'unauthenticated'
  >('loading');

  const [session, setSessionState] = useState<UserSession | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getAuthenticatedInfo();

        if (!res || res.status !== 200) {
          // ❌ BE rejected → clear
          setSessionState(null);
          localStorage.removeItem('session');
          setStatus('unauthenticated');
          return;
        }

        const raw = res.data;
        const userData: UserSession = {
          id: raw.id ?? '',
          name: raw.name ?? 'User',
          email: raw.email ?? '',
          avaUrl: raw.avaUrl ?? '',
          role: raw.role ?? 'patient',
        };

        // ✅ save
        setSessionState(userData);
        localStorage.setItem('session', JSON.stringify(userData));
        setStatus('authenticated');
      } catch {
        setSessionState(null);
        localStorage.removeItem('session');
        setStatus('unauthenticated');
      }
    };

    fetchUserInfo();
  }, []);

  const setSession = (data: UserSession | null) => {
    setSessionState(data);

    if (data) {
      localStorage.setItem('session', JSON.stringify(data));
      setStatus('authenticated');
    } else {
      localStorage.removeItem('session');
      setStatus('unauthenticated');
    }
  };

  const logout = () => setSession(null);

  return (
    <SessionContext.Provider value={{ status, session, setSession, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
