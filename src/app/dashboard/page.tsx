'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import { PrimaryButton } from '@/components/PrimaryButton';
import { GigCard } from '@/components/GigCard';
import type { Gig } from '@/types/gig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Plus, Wallet, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getProvider, getRozgarContract, formatEthAmount } from '@/lib/blockchain';

export default function DashboardPage() {
  const router = useRouter();
  const { account, isConnected, shortAddress } = useWallet();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  // Load gigs from blockchain
  useEffect(() => {
    if (!isConnected || !account) {
      router.push('/');
      return;
    }

    const loadGigs = async () => {
      try {
        const provider = getProvider();
        const contract = getRozgarContract(provider);
        
        // Get total gig count
        const count = await contract.gigCount();
        const gigCount = Number(count);
        
        const loadedGigs: Gig[] = [];
        
        // Load each gig
        for (let i = 1; i <= gigCount; i++) {
          try {
            const gigData = await contract.getGig(i);
            
            // Only add gigs where user is client or freelancer
            const isUserGig = 
              gigData.client.toLowerCase() === account.toLowerCase() ||
              gigData.freelancer.toLowerCase() === account.toLowerCase();
            
            if (isUserGig) {
              // Determine status
              let status: 'Waiting' | 'In Progress' | 'Submitted' | 'Completed' = 'Waiting';
              if (gigData.isPaid) status = 'Completed';
              else if (gigData.workSubmitted) status = 'Submitted';
              else if (gigData.isAccepted) status = 'In Progress';
              
              loadedGigs.push({
                id: i.toString(),
                title: gigData.title,
                description: gigData.description,
                clientAddress: gigData.client,
                freelancerAddress: gigData.freelancer,
                paymentAmount: formatEthAmount(gigData.payment),
                paymentAmountWei: gigData.payment.toString(),
                status: status,
                createdAt: Date.now(),
                timeline: []
              });
            }
          } catch (err) {
            console.log(`Error loading gig ${i}:`, err);
          }
        }
        
        setGigs(loadedGigs);
        setLoading(false);
      } catch (error) {
        console.error('Error loading gigs:', error);
        setLoading(false);
      }
    };

    loadGigs();
  }, [account, isConnected, router]);

  // Calculate statistics
  const stats = {
    total: gigs.length,
    active: gigs.filter(g => g.status === 'In Progress' || g.status === 'Waiting').length,
    completed: gigs.filter(g => g.status === 'Completed').length,
    totalEarned: gigs
      .filter(g => g.status === 'Completed' && g.freelancerAddress.toLowerCase() === account?.toLowerCase())
      .reduce((sum, g) => sum + parseFloat(g.paymentAmount), 0)
      .toFixed(4)
  };

  if (!isConnected || !account) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 flex items-center gap-2 text-gray-600">
                <Wallet className="h-4 w-4" />
                Connected as <span className="font-mono font-semibold">{shortAddress}</span>
              </p>
            </div>
            <PrimaryButton onClick={() => router.push('/gigs/new')} className="sm:w-auto">
              <Plus className="mr-2 h-5 w-5" />
              Create New Gig
            </PrimaryButton>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Gigs</CardDescription>
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl font-bold">{stats.total}</CardTitle>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Active Gigs</CardDescription>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl font-bold text-blue-600">{stats.active}</CardTitle>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Completed</CardDescription>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl font-bold text-green-600">{stats.completed}</CardTitle>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription>Total Earned</CardDescription>
                <TrendingUp className="h-5 w-5 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-3xl font-bold text-purple-600">{stats.totalEarned} ETH</CardTitle>
            </CardContent>
          </Card>
        </div>

        {/* Gigs List */}
        <div>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Your Gigs</h2>
            {gigs.length > 0 && (
              <span className="text-sm text-gray-500">
                {gigs.length} {gigs.length === 1 ? 'gig' : 'gigs'} found
              </span>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : gigs.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <CardTitle className="mb-2">No gigs yet</CardTitle>
                <CardDescription className="mb-6">
                  Create your first gig to get started with Rozgar Chain
                </CardDescription>
                <PrimaryButton onClick={() => router.push('/gigs/new')}>
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Gig
                </PrimaryButton>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {gigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} currentAddress={account} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}