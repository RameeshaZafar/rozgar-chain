'use client';
import Basename from '@/components/Basename';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import { PrimaryButton } from '@/components/PrimaryButton';
import { StatusBadge } from '@/components/StatusBadge';
import type { Gig, UserRole } from '@/types/gig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { shortenAddress, getProvider, getRozgarContract, getSigner, formatEthAmount } from '@/lib/blockchain';
import { ArrowLeft, User, Coins, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

export default function GigDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const gigId = params?.id as string;
  const { account, isConnected } = useWallet();
  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Load gig from blockchain
  const loadGig = async () => {
    try {
      const provider = getProvider();
      const contract = getRozgarContract(provider);
      const gigData = await contract.getGig(gigId);
      
      let status: 'Waiting' | 'In Progress' | 'Submitted' | 'Completed' = 'Waiting';
      if (gigData.isPaid) status = 'Completed';
      else if (gigData.workSubmitted) status = 'Submitted';
      else if (gigData.isAccepted) status = 'In Progress';
      
      setGig({
        id: gigId,
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
      setLoading(false);
    } catch (error) {
      console.error('Error loading gig:', error);
      setGig(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isConnected || !account) {
      router.push('/');
      return;
    }
    loadGig();
  }, [gigId, account, isConnected, router]);

  const getUserRole = (): UserRole => {
    if (!gig || !account) return 'None';
    if (gig.clientAddress.toLowerCase() === account.toLowerCase()) return 'Client';
    if (gig.freelancerAddress.toLowerCase() === account.toLowerCase()) return 'Freelancer';
    return 'None';
  };

  const userRole = getUserRole();

  // Accept gig
  const handleAcceptGig = async () => {
    setActionLoading(true);
    try {
      const signer = await getSigner();
      const contract = getRozgarContract(signer);
      const tx = await contract.acceptGig(gigId);
      toast.info('Accepting gig...');
      await tx.wait();
      toast.success('Gig accepted!');
      loadGig();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error('Failed to accept gig', { description: err.message });
    }
    setActionLoading(false);
  };

  // Submit work
  const handleSubmitWork = async () => {
    setActionLoading(true);
    try {
      const signer = await getSigner();
      const contract = getRozgarContract(signer);
      const tx = await contract.submitWork(gigId);
      toast.info('Submitting work...');
      await tx.wait();
      toast.success('Work submitted!');
      loadGig();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error('Failed to submit work', { description: err.message });
    }
    setActionLoading(false);
  };

  // Approve and pay
  const handleApproveAndPay = async () => {
    setActionLoading(true);
    try {
      const signer = await getSigner();
      const contract = getRozgarContract(signer);
      const tx = await contract.approveAndPay(gigId);
      toast.info('Releasing payment...');
      await tx.wait();
      toast.success('Payment released!');
      loadGig();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error('Failed to release payment', { description: err.message });
    }
    setActionLoading(false);
  };

  const renderActions = () => {
    if (!gig || userRole === 'None') return null;

    if (userRole === 'Freelancer') {
      if (gig.status === 'Waiting') {
        return (
          <PrimaryButton onClick={handleAcceptGig} loading={actionLoading} disabled={actionLoading} fullWidth>
            Accept Gig
          </PrimaryButton>
        );
      }
      if (gig.status === 'In Progress') {
        return (
          <PrimaryButton onClick={handleSubmitWork} loading={actionLoading} disabled={actionLoading} fullWidth>
            Submit Work
          </PrimaryButton>
        );
      }
    }

    if (userRole === 'Client' && gig.status === 'Submitted') {
      return (
        <PrimaryButton onClick={handleApproveAndPay} loading={actionLoading} disabled={actionLoading} fullWidth>
          Approve & Release Payment
        </PrimaryButton>
      );
    }

    return null;
  };

  if (!isConnected || !account) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="mb-6 h-6 w-32" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
              <CardTitle className="mb-2">Gig not found</CardTitle>
              <Link href="/dashboard">
                <PrimaryButton>Go to Dashboard</PrimaryButton>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl sm:text-3xl">{gig.title}</CardTitle>
                <CardDescription className="mt-2 text-base">{gig.description}</CardDescription>
              </div>
              <div className="flex flex-col gap-2">
                <StatusBadge status={gig.status} />
                <Badge variant="outline" className={userRole === 'Client' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                  You are the {userRole}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gig Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Coins className="h-4 w-4" />
                  <span>Payment Amount</span>
                </div>
                <span className="text-lg font-bold text-green-600">{gig.paymentAmount} ETH</span>
              </div>
              <Separator />
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Client</span>
                </div>
<Basename address={gig.clientAddress} />              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Freelancer</span>
                </div>
<Basename address={gig.freelancerAddress} />              </div>
            </CardContent>
          </Card>

          {renderActions() && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Actions</CardTitle>
              </CardHeader>
              <CardContent>
                {renderActions()}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}