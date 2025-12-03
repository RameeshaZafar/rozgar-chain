// Blockchain utilities for Rozgar Chain dApp
// @ts-nocheck
import { ethers, type BrowserProvider, type Eip1193Provider } from 'ethers';

// ⚠️ PASTE YOUR CONTRACT ADDRESS HERE
export const ROZGAR_CONTRACT_ADDRESS = '0xF67bF71D9Bb8c7B48994DE38b3FfBc7eEdAB2Bb8';

// Contract ABI
export const ROZGAR_CONTRACT_ABI = [
  {
    "inputs": [
      {"name": "_title", "type": "string"},
      {"name": "_description", "type": "string"},
      {"name": "_freelancer", "type": "address"}
    ],
    "name": "createGig",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_gigId", "type": "uint256"}],
    "name": "acceptGig",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_gigId", "type": "uint256"}],
    "name": "submitWork",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_gigId", "type": "uint256"}],
    "name": "approveAndPay",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_gigId", "type": "uint256"}],
    "name": "getGig",
    "outputs": [
      {
        "components": [
          {"name": "id", "type": "uint256"},
          {"name": "client", "type": "address"},
          {"name": "freelancer", "type": "address"},
          {"name": "title", "type": "string"},
          {"name": "description", "type": "string"},
          {"name": "payment", "type": "uint256"},
          {"name": "isAccepted", "type": "bool"},
          {"name": "workSubmitted", "type": "bool"},
          {"name": "isCompleted", "type": "bool"},
          {"name": "isPaid", "type": "bool"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gigCount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Base Sepolia network configuration
export const BASE_SEPOLIA_CONFIG = {
  chainId: '0x14A34',
  chainName: 'Base Sepolia',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://sepolia.base.org'],
  blockExplorerUrls: ['https://sepolia.basescan.org']
};

// Connect to MetaMask wallet
export async function connectWallet(): Promise<string> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed.');
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    }) as string[];

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found.');
    }

    const chainId = await window.ethereum.request({ method: 'eth_chainId' }) as string;
    
    if (chainId !== BASE_SEPOLIA_CONFIG.chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: BASE_SEPOLIA_CONFIG.chainId }],
        });
      } catch (switchError: unknown) {
        const error = switchError as { code?: number };
        if (error.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BASE_SEPOLIA_CONFIG],
          });
        } else {
          throw switchError;
        }
      }
    }

    return accounts[0];
  } catch (error: unknown) {
    const err = error as Error;
    throw new Error(err.message || 'Failed to connect wallet');
  }
}

// Get provider
export function getProvider(): BrowserProvider {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }
  return new ethers.BrowserProvider(window.ethereum as Eip1193Provider);
}

// Get signer
export async function getSigner() {
  const provider = getProvider();
  return await provider.getSigner();
}

// Get contract instance
export function getRozgarContract(signerOrProvider: ethers.Signer | ethers.Provider) {
  return new ethers.Contract(
    ROZGAR_CONTRACT_ADDRESS,
    ROZGAR_CONTRACT_ABI,
    signerOrProvider
  );
}

// Listen for account changes
export function onAccountsChanged(callback: (accounts: string[]) => void): void {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    (window as any).ethereum.on('accountsChanged', (...args: unknown[]) => {
      // MetaMask sends accounts as the first argument
      const accounts = args[0] as string[];
      callback(accounts);
    });
  }
}

// Listen for chain changes
export function onChainChanged(callback: (chainId: string) => void): void {
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('chainChanged', callback);
  }
}

// Format Wei to ETH
export function formatEthAmount(wei: string | bigint): string {
  return ethers.formatEther(wei);
}

// Parse ETH to Wei
export function parseEthAmount(eth: string): bigint {
  return ethers.parseEther(eth);
}

// Shorten address
export function shortenAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Validate address
export function isValidAddress(address: string): boolean {
  try {
    ethers.getAddress(address);
    return true;
  } catch {
    return false;
  }
}

// TypeScript types for window.ethereum
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}