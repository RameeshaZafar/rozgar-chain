"use client";

import { useCallback } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export function useAddMiniApp() {
  const addMiniApp = useCallback(async () => {
    try {
      // Check if we're in Farcaster context
      if (typeof window !== "undefined") {
        await sdk.actions.addMiniApp();
      }
    } catch (error) {
      console.log("Not in Farcaster context or already added:", error);
    }
  }, []);

  return { addMiniApp };
}