"use client";

import { 
    isAuthenticated, 
    getCurrentUserRole,
    logout 
} from "@/lib/auth-utils";
import { getAccessToken, symptomDepartmentOperation } from "@/lib/BE-library/main";
import { usePathname, useRouter } from "next/navigation";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

interface userSession {
    id?: string;
    name?: string;
    email?: string;
    avaUrl?: string;
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
    token: string;
}

interface SessionContextType {
    status: "loading" | "authenticated" | "unauthenticated";
    session: null | userSession;
    setSession: Dispatch<SetStateAction<null | userSession>>;
}

const SessionContext = createContext<SessionContextType>({
    status: "loading",
    session: null,
    setSession: () => {},
});

// Helper function to extract user data from JWT token
function extractUserFromToken(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        
        return {};
    }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
    const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
    const [session, setSession] = useState<null | userSession>(null);
    const pathName = usePathname();
    const router = useRouter();

    useEffect(() => {
        const checkAuthentication = async () => {
            // Skip authentication check for login and signup pages
            const publicRoutes = ["/auth/login", "/auth/signup"];
            const isPublicRoute = publicRoutes.includes(pathName);
            
            if (isPublicRoute) {
                setStatus("unauthenticated");
                return;
            }

            try {
                // Get token from cookie first
                const token = getAccessToken();
                
                if (!token) {
                    
                    router.push("/auth/login");
                    setStatus("unauthenticated");
                    return;
                }

                // Check if user is authenticated using symptoms API (requires authentication)
                const response = await symptomDepartmentOperation.getAllSymptoms();
                
                if (!response.success || response.status !== 200) {
                    
                    router.push("/auth/login");
                    setStatus("unauthenticated");
                    return;
                }

                // Extract user data from JWT token
                const userData = extractUserFromToken(token);
                
                // Create session object with data from JWT token
                const userSessionData: userSession = {
                    role: userData.role || 'PATIENT',
                    token: token,
                    id: userData.userId ? userData.userId.toString() : userData.sub || "unknown",
                    name: userData.name || userData.fullName || userData.email?.split('@')[0] || "User",
                    email: userData.email || "unknown@email.com",
                    avaUrl: "/default-avatar.png"
                };

                setSession(userSessionData);
                setStatus("authenticated");
                
            } catch (error) {
                
                
                // Only redirect to login if not on public routes
                if (!isPublicRoute) {
                    router.push("/auth/login");
                }
                
                setStatus("unauthenticated");
            }
        };

        checkAuthentication();
    }, [pathName, router]);

    // Show loading spinner while checking authentication
    if (status === "loading") {
        return (
            <SessionContext.Provider value={{ status, session, setSession }}>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </SessionContext.Provider>
        );
    }

    // Don't render protected content if user is not authenticated (except on public routes)
    const publicRoutes = ["/auth/login", "/auth/signup"];
    const isPublicRoute = publicRoutes.includes(pathName);
    
    if (!isPublicRoute && status === "unauthenticated") {
        return (
            <SessionContext.Provider value={{ status, session, setSession }}>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Đang chuyển hướng...</h1>
                        <p className="text-gray-600">Vui lòng đợi trong khi chúng tôi đăng nhập cho bạn.</p>
                    </div>
                </div>
            </SessionContext.Provider>
        );
    }

    return (
        <SessionContext.Provider value={{ status, session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    return useContext(SessionContext);
}

// Custom hook for authentication utilities
export function useAuth() {
    const { status, session, setSession } = useSession();
    const router = useRouter();
    
    const handleLogout = async () => {
        try {
            await logout("/auth/login");
            setSession(null);
        } catch (error) {
            
            // Force redirect even if logout fails
            router.push("/auth/login");
            setSession(null);
        }
    };
    
    const hasRole = (role: 'ADMIN' | 'DOCTOR' | 'PATIENT') => {
        return session?.role === role;
    };
    
    const isAdmin = () => hasRole('ADMIN');
    const isDoctor = () => hasRole('DOCTOR');
    const isPatient = () => hasRole('PATIENT');
    
    return {
        status,
        session,
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        logout: handleLogout,
        hasRole,
        isAdmin,
        isDoctor,
        isPatient,
        userRole: session?.role || null,
        userName: session?.name || null,
        userEmail: session?.email || null
    };
}