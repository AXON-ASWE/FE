/**
 * Logout Component
 * A reusable component for handling logout functionality
 */

"use client";

import { useState } from "react";
import { logout, getCurrentUserRole } from "@/lib/auth-utils";

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: "button" | "link";
  showConfirm?: boolean;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = "",
  children = "Logout",
  variant = "button",
  showConfirm = false
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (showConfirm) {
      const confirmed = window.confirm("Are you sure you want to logout?");
      if (!confirmed) return;
    }

    setIsLoading(true);
    
    try {
      const result = await logout();
      if (result.success) {
        console.log("Logout successful");
      } else {
        console.error("Logout failed:", result.message);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    setIsLoading(false);
  };

  const baseStyles = variant === "button" 
    ? "px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
    : "text-red-500 hover:text-red-700 underline cursor-pointer";

  if (variant === "button") {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`${baseStyles} ${className}`}
      >
        {isLoading ? "Logging out..." : children}
      </button>
    );
  }

  return (
    <span
      onClick={handleLogout}
      className={`${baseStyles} ${className}`}
    >
      {isLoading ? "Logging out..." : children}
    </span>
  );
};

/**
 * User Info Component
 * Shows current user role and logout option
 */
export const UserInfo: React.FC<{ className?: string }> = ({ className = "" }) => {
  const userRole = getCurrentUserRole();

  if (!userRole) return null;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="text-sm text-gray-600">
        Logged in as: <strong>{userRole}</strong>
      </span>
      <LogoutButton variant="link" />
    </div>
  );
};

export default LogoutButton;
