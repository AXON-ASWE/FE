/**
 * AXON Healthcare Authentication Usage Guide
 * 
 * This file demonstrates how to use the updated authentication system
 * with the AXON Healthcare API and token management
 */

import { 
  setTokenCookie, 
  removeTokenCookie, 
  logout, 
  isAuthenticated, 
  getCurrentUserRole, 
  hasRole, 
  getRedirectPath, 
  canAccess 
} from "@/lib/auth-utils";

/**
 * 🔐 AUTHENTICATION EXAMPLES
 */

// Example: Check if user is logged in
export function checkAuthStatus() {
  const isLoggedIn = isAuthenticated();
  const userRole = getCurrentUserRole();
  
  console.log("Is authenticated:", isLoggedIn);
  console.log("User role:", userRole);
  
  if (isLoggedIn && userRole) {
    console.log(`User is logged in as ${userRole}`);
    console.log(`Should redirect to: ${getRedirectPath(userRole)}`);
  } else {
    console.log("User is not logged in");
  }
}

// Example: Role-based access control
export function checkPermissions() {
  // Check if user can access admin features
  if (hasRole('ADMIN')) {
    console.log("User has admin access");
  }
  
  // Check if user can access doctor features
  if (hasRole('DOCTOR')) {
    console.log("User has doctor access");
  }
  
  // Check if user can access patient features
  if (hasRole('PATIENT')) {
    console.log("User has patient access");
  }
  
  // Check general access
  if (canAccess()) {
    console.log("User has general access");
  }
  
  // Check specific role access
  if (canAccess('ADMIN')) {
    console.log("User can access admin-only features");
  }
}

/**
 * 🔄 LOGOUT EXAMPLES
 */

// Example: Programmatic logout
export async function performLogout() {
  try {
    const result = await logout("/auth/login");
    if (result.success) {
      console.log("Logout successful");
      // User will be redirected to login page
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

// Example: Logout with custom redirect
export async function logoutWithCustomRedirect() {
  try {
    const result = await logout("/");
    if (result.success) {
      console.log("Logout successful, redirected to home");
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

/**
 * 🛡️ ROUTE PROTECTION EXAMPLES
 */

// Example: Check authentication in a page component
export function checkPageAccess() {
  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    window.location.href = "/auth/login";
    return false;
  }
  return true;
}

// Example: Check admin access
export function checkAdminAccess() {
  if (!canAccess('ADMIN')) {
    // Redirect if not admin
    window.location.href = "/auth/login";
    return false;
  }
  return true;
}

/**
 * 🎯 REAL USAGE SCENARIOS
 */

// Example: Get navigation items based on role
export function getNavigationItems() {
  const userRole = getCurrentUserRole();
  const isLoggedIn = isAuthenticated();

  if (!isLoggedIn) {
    return [
      { href: "/auth/login", label: "Login" },
      { href: "/auth/signup", label: "Sign Up" }
    ];
  }

  const items = [
    { href: "/dashboard/home", label: "Dashboard" }
  ];

  if (hasRole('PATIENT')) {
    items.push(
      { href: "/appointments", label: "My Appointments" },
      { href: "/book-appointment", label: "Book Appointment" }
    );
  }

  if (hasRole('DOCTOR')) {
    items.push(
      { href: "/doctor/appointments", label: "Doctor Appointments" },
      { href: "/doctor/schedule", label: "My Schedule" }
    );
  }

  if (hasRole('ADMIN')) {
    items.push(
      { href: "/admin/doctors", label: "Manage Doctors" },
      { href: "/admin/departments", label: "Manage Departments" }
    );
  }

  return items;
}

// Example: Get dashboard content based on role
export function getDashboardContent() {
  const userRole = getCurrentUserRole();

  switch (userRole) {
    case 'PATIENT':
      return {
        title: "Patient Dashboard",
        description: "Book appointments, view medical history, etc."
      };
    case 'DOCTOR':
      return {
        title: "Doctor Dashboard", 
        description: "View appointments, manage patients, etc."
      };
    case 'ADMIN':
      return {
        title: "Admin Dashboard",
        description: "Manage doctors, departments, system settings, etc."
      };
    default:
      return {
        title: "Healthcare Dashboard",
        description: "Welcome to AXON Healthcare"
      };
  }
}

/**
 * 📱 SESSION MANAGEMENT EXAMPLES
 */

// Example: Token refresh handling
export function handleTokenRefresh() {
  // Check if token is expired
  if (!isAuthenticated()) {
    console.log("Token expired, redirecting to login");
    logout("/auth/login");
  }
}

// Example: Auto-logout on token expiration
export function setupAutoLogout() {
  setInterval(() => {
    if (!isAuthenticated()) {
      console.log("Session expired, logging out");
      logout("/auth/login");
    }
  }, 60000); // Check every minute
}

/**
 * 🔧 UTILITY USAGE EXAMPLES
 */

// Example: Manual token management (usually not needed)
export function manualTokenManagement() {
  // These functions are used internally by the auth forms
  // but can be used manually if needed
  
  const token = "your_jwt_token_here";
  const expiration = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
  
  // Set token
  setTokenCookie(token, expiration);
  
  // Remove token
  removeTokenCookie();
}

// Example: Get user info for display
export function getUserDisplayInfo() {
  const userRole = getCurrentUserRole();
  const isLoggedIn = isAuthenticated();

  return {
    isLoggedIn,
    userRole,
    displayRole: userRole ? userRole.charAt(0) + userRole.slice(1).toLowerCase() : null,
    redirectPath: userRole ? getRedirectPath(userRole) : "/auth/login"
  };
}

export default {
  checkAuthStatus,
  checkPermissions,
  performLogout,
  logoutWithCustomRedirect,
  checkPageAccess,
  checkAdminAccess,
  getNavigationItems,
  getDashboardContent,
  handleTokenRefresh,
  setupAutoLogout,
  manualTokenManagement,
  getUserDisplayInfo
};
