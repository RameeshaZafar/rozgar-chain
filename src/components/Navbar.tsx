'use client';

// Navigation bar component with logo and wallet connection
import Basename from '@/components/Basename';
import React from 'react';
import Link from 'next/link';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function Navbar() {
  const { account, isConnecting, isConnected, shortAddress, connect } = useWallet();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-[#020617]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-blue-500 shadow-lg">
              <span className="text-xl font-extrabold text-white">RC</span>
            </div>
            <span className="text-xl font-bold text-white">Rozgar Chain</span>
          </Link>

          {/* Navigation Links + Connect Wallet Button - All grouped on right */}
          <div className="flex items-center gap-6">
            <a href="#hero" className="hidden md:block text-gray-300 hover:text-green-400 font-medium transition-colors">
              Home
            </a>
            <a href="#how-it-works" className="hidden md:block text-gray-300 hover:text-green-400 font-medium transition-colors">
              Features
            </a>
            <a href="#why-rozgar" className="hidden md:block text-gray-300 hover:text-green-400 font-medium transition-colors">
              Benefits
            </a>
            // Find the navigation links and add this:
<a 
  href="#stats" 
  className="hidden md:block text-gray-300 hover:text-green-400 font-medium transition-colors"
>
  Stats
</a>
            
            {/* Connect Wallet Button */}
            {isConnected && account ? (
              <Link href="/dashboard">
                <Button variant="outline" className="font-medium">
                 <Basename address={account || ''} />
                </Button>
              </Link>
            ) : (
              <Button
                onClick={connect}
                disabled={isConnecting}
                className="bg-gradient-to-r from-green-500 to-blue-500 font-medium text-white hover:from-green-600 hover:to-blue-600"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect Wallet'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
