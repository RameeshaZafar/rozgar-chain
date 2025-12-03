"use client";

import { useEffect } from "react";

export function useQuickAuth(isInFarcaster: boolean) {
  useEffect(() => {
    if (!isInFarcaster) return;

    const initAuth = async () => {
      try {
        // Quick auth initialization for Farcaster
        console.log("Quick auth initialized for Farcaster context");
      } catch (error) {
        console.error("Quick auth error:", error);
      }
    };

    initAuth();
  }, [isInFarcaster]);
}