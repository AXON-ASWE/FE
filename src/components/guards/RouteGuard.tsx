/**
 * Route Guard Components
 * These components provide role-based access control for different routes
 */

"use client";

import { useAuth } from "@/context/Sessioncontext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RouteGuardProps {
    children: React.ReactNode;
    requiredRole?: 'ADMIN' | 'DOCTOR' | 'PATIENT';
    fallbackPath?: string;
}

/**
 * ProtectedRoute - Requires authentication
 */
export function ProtectedRoute({ children, requiredRole, fallbackPath = "/auth/login" }: RouteGuardProps) {
    const { isAuthenticated, isLoading, hasRole, userRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push(fallbackPath);
                return;
            }
            if (requiredRole && !hasRole(requiredRole)) {
                const redirectPaths = {
                    'ADMIN': '/admin',
                    'DOCTOR': '/doctor',
                    'PATIENT': '/'
                };
                router.push(redirectPaths[userRole!] || '/auth/login');
                return;
            }
        }
    }, [isAuthenticated, isLoading, hasRole, requiredRole, router, userRole, fallbackPath]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Không được phép truy cập</h1>
                    <p className="text-gray-600">Bạn cần đăng nhập để truy cập trang này.</p>
                </div>
            </div>
        );
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Không đủ quyền truy cập</h1>
                    <p className="text-gray-600">Bạn không có quyền truy cập trang này.</p>
                    <p className="text-sm text-gray-500 mt-2">Vai trò hiện tại: {userRole}</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

/**
 * AdminRoute - Requires ADMIN role
 */
export function AdminRoute({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requiredRole="ADMIN">
            {children}
        </ProtectedRoute>
    );
}

/**
 * DoctorRoute - Requires DOCTOR role
 */
export function DoctorRoute({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requiredRole="DOCTOR">
            {children}
        </ProtectedRoute>
    );
}

/**
 * PatientRoute - Requires PATIENT role
 */
export function PatientRoute({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedRoute requiredRole="PATIENT">
            {children}
        </ProtectedRoute>
    );
}

/**
 * PublicRoute - Redirects authenticated users to dashboard
 */
export function PublicRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, userRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            // Redirect authenticated users to their appropriate dashboard
            const redirectPaths = {
                'ADMIN': '/admin',
                'DOCTOR': '/doctor',
                'PATIENT': '/'
            };
            router.push(redirectPaths[userRole!] || '/auth/login');
        }
    }, [isAuthenticated, isLoading, userRole, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // If authenticated, show loading while redirecting
    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang chuyển hướng đến trang chủ...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
