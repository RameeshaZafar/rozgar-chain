"use client";

import { useState, useEffect } from 'react';

interface BasenameProps {
  address: string;
}

export default function Basename({ address }: BasenameProps) {
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBasename() {
      if (!address) {
        setLoading(false);
        return;
      }

      try {
        // Fetch Basename from Base API
        const response = await fetch(
          `https://resolver-api.basename.app/v1/addresses/${address}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.name) {
            setName(data.name);
          }
        }
      } catch (error) {
        console.log("No basename found for address");
      }
      
      setLoading(false);
    }

    fetchBasename();
  }, [address]);

  // Show shortened address if no basename
  function shortAddress(addr: string): string {
    if (!addr) return '';
    return addr.slice(0, 6) + "..." + addr.slice(-4);
  }

  if (loading) {
    return <span className="text-gray-400 animate-pulse">Loading...</span>;
  }

  return (
    <span className="font-medium">
      {name ? (
        <span className="text-green-500 flex items-center gap-1">
          🔷 {name}
        </span>
      ) : (
        <span className="font-mono">
          {shortAddress(address)}
        </span>
      )}
    </span>
  );
}