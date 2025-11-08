/**
 * Authentication Utility Functions
 * Contains helper functions for authentication, logout, and token management
 */

import { getAccessToken, AxonHealthcareUtils } from "@/lib/BE-library/main";

/**
 * Set token in cookie with proper expiration
 */
export const setTokenCookie = (token: string, expiration: number) => {
  const currentTime = Math.floor(Date.now() / 1000);
  const maxAge = expiration - currentTime;
  
  if (typeof document !== 'undefined') {
    document.cookie = `access_token=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
  }
};

/**
 * Remove token from cookie (logout)
 */
export const removeTokenCookie = () => {
  if (typeof document !== 'undefined') {
    document.cookie = `access_token=; path=/; max-age=0; SameSite=Lax`;
  }
};

/**
 * Logout function - clears token and redirects
 */
export const logout = async (redirectPath: string = "/auth/login") => {
  try {
    // Remove token from cookie
    removeTokenCookie();
    
    // Clear any other stored auth data if needed
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
    }
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = redirectPath;
    }
    
    return { success: true, message: "Logout successful" };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, message: "Logout failed" };
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = getAccessToken();
  if (!token) return false;
  
  return !AxonHealthcareUtils.isTokenExpired();
};

/**
 * Get current user role
 */
export const getCurrentUserRole = (): 'ADMIN' | 'DOCTOR' | 'PATIENT' | null => {
  return AxonHealthcareUtils.getUserRole();
};

/**
 * Check if user has specific role
 */
export const hasRole = (role: 'ADMIN' | 'DOCTOR' | 'PATIENT'): boolean => {
  return AxonHealthcareUtils.hasRole(role);
};

/**
 * Get redirect path based on user role
 */
export const getRedirectPath = (role: 'ADMIN' | 'DOCTOR' | 'PATIENT'): string => {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard';
    case 'DOCTOR':
      return '/doctor/dashboard';
    case 'PATIENT':
    default:
      return '/';
  }
};

/**
 * Auth guard - check if user can access a route
 */
export const canAccess = (requiredRole?: 'ADMIN' | 'DOCTOR' | 'PATIENT'): boolean => {
  if (!isAuthenticated()) return false;
  
  if (requiredRole) {
    return hasRole(requiredRole);
  }
  
  return true;
};
