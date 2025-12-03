"use client";

import { useState, useEffect } from "react";

export function useIsInFarcaster(): boolean {
  const [isInFarcaster, setIsInFarcaster] = useState(false);

  useEffect(() => {
    // Check if running inside Farcaster frame
    const checkFarcaster = () => {
      if (typeof window !== "undefined") {
        // Check for Farcaster context
        const isFarcaster =
          window.location.href.includes("farcaster") ||
          window.parent !== window ||
          document.referrer.includes("warpcast");
        setIsInFarcaster(isFarcaster);
      }
    };

    checkFarcaster();
  }, []);

  return isInFarcaster;
}