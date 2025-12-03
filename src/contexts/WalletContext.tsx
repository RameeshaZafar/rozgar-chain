'use client';

// Wallet Context for global wallet state management
// Provides wallet connection status, account info, and connection methods

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { connectWallet, onAccountsChanged, onChainChanged, shortenAddress } from '@/lib/blockchain';
import { toast } from 'sonner';

interface WalletContextType {
  account: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  shortAddress: string;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Handle wallet connection
  const connect = async () => {
    if (isConnecting) return;

    setIsConnecting(true);
    try {
      const address = await connectWallet();
      setAccount(address);
      setIsConnected(true);
      toast.success('Wallet connected successfully!', {
        description: `Connected to ${shortenAddress(address)}`
      });
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Failed to connect wallet:', err);
      toast.error('Failed to connect wallet', {
        description: err.message || 'Please make sure MetaMask is installed and unlocked'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Handle wallet disconnection
  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
    toast.info('Wallet disconnected');
  };

  // Listen for account changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        toast.info('Account changed', {
          description: `Switched to ${shortenAddress(accounts[0])}`
        });
      }
    };

    const handleChainChanged = () => {
      // Reload the page when chain changes to avoid state inconsistencies
      window.location.reload();
    };

    onAccountsChanged(handleAccountsChanged);
    onChainChanged(handleChainChanged);

    // Check if wallet is already connected on mount
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          }) as string[];
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, [account]);

  const value: WalletContextType = {
    account,
    isConnecting,
    isConnected,
    shortAddress: account ? shortenAddress(account) : '',
    connect,
    disconnect
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// Custom hook to use wallet context
export function useWallet(): WalletContextType {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
