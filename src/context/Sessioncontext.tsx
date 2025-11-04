'use client';

import { getAuthenticatedInfo } from '@/app/api/user';
import { usePathname, useRouter } from 'next/navigation';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

interface UserSession {
  id: string;
  name: string;
  email: string;
  avaUrl?: string;
  role: 'user' | 'doctor' | 'admin' | string; // Thêm role
}

interface SessionContextType {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  session: UserSession | null;
  setSession: Dispatch<SetStateAction<UserSession | null>>;
}

const SessionContext = createContext<SessionContextType>({
  status: 'loading',
  session: null,
  setSession: () => {},
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<
    'loading' | 'authenticated' | 'unauthenticated'
  >('loading');
  const [session, setSession] = useState<UserSession | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getAuthenticatedInfo();

        //Không hợp lệ
        if (!res || res.status !== 200) {
          setSession(null);
          setStatus('unauthenticated');

          if (!pathname.startsWith('/auth')) {
            router.push('/auth/login');
          }
          return;
        }

        const raw = res.data;

        const userData: UserSession = {
          id: raw.id ?? '',
          name: raw.name ?? 'Người dùng',
          email: raw.email ?? '',
          avaUrl: raw.avaUrl ?? '',
          role: raw.role ?? 'user', // fallback
        };

        setSession(userData);
        setStatus('authenticated');
      } catch (error) {
        console.error('Error fetching user info:', error);

        setSession(null);
        setStatus('unauthenticated');

        if (!pathname.startsWith('/auth')) {
          router.push('/auth/login');
        }
      }
    };

    fetchUserInfo();
  }, [pathname]);

  return (
    <SessionContext.Provider value={{ status, session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
