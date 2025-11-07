"use client";

import { logout } from "@/lib/auth-utils"; // Import the logout utility function
import { useState } from "react";

export const Logout = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      const result = await logout("/auth/login"); // Call logout and redirect to login
      if (result.success) {
        console.log("Logout successful");
      } else {
        console.error("Logout failed:", result.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
    
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="rounded-md flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground hover:bg-accent px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span>{isLoading ? "Logging out..." : "Log out"}</span>
    </button>
  );
};
