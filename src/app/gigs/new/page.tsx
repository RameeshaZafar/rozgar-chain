'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { CreateGigFormData } from '@/types/gig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { isValidAddress, getSigner, getRozgarContract, parseEthAmount } from '@/lib/blockchain';
import { toast } from 'sonner';
import Link from 'next/link';

export default function CreateGigPage() {
  const router = useRouter();
  const { account, isConnected } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateGigFormData>({
    title: '',
    description: '',
    freelancerAddress: '',
    paymentAmount: ''
  });
  const [errors, setErrors] = useState<Partial<CreateGigFormData>>({});

  React.useEffect(() => {
    if (!isConnected || !account) {
      router.push('/');
    }
  }, [isConnected, account, router]);

  const handleChange = (field: keyof CreateGigFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateGigFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.freelancerAddress.trim()) {
      newErrors.freelancerAddress = 'Freelancer address is required';
    } else if (!isValidAddress(formData.freelancerAddress)) {
      newErrors.freelancerAddress = 'Invalid Ethereum address';
    } else if (formData.freelancerAddress.toLowerCase() === account?.toLowerCase()) {
      newErrors.freelancerAddress = 'Cannot create gig for yourself';
    }

    if (!formData.paymentAmount) {
      newErrors.paymentAmount = 'Payment amount is required';
    } else if (isNaN(parseFloat(formData.paymentAmount)) || parseFloat(formData.paymentAmount) <= 0) {
      newErrors.paymentAmount = 'Payment amount must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      // Real contract call
      const signer = await getSigner();
      const contract = getRozgarContract(signer);
      const paymentWei = parseEthAmount(formData.paymentAmount);
      
      const tx = await contract.createGig(
        formData.title,
        formData.description,
        formData.freelancerAddress,
        { value: paymentWei }
      );
      
      toast.info('Transaction sent! Waiting for confirmation...');
      
      await tx.wait();

      toast.success('Gig created successfully!', {
        description: `Payment of ${formData.paymentAmount} ETH deposited into escrow`
      });

      router.push('/dashboard');
    } catch (error: unknown) {
      const err = error as Error;
      console.error('Error creating gig:', err);
      toast.error('Failed to create gig', {
        description: err.message || 'Please try again'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected || !account) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/dashboard" className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Gig</CardTitle>
            <CardDescription>
              Fill in the details below. Your payment will be held in escrow until work is completed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Gig Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Build a Landing Page"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Describe the work needed..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={5}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="freelancerAddress">Freelancer Wallet Address <span className="text-red-500">*</span></Label>
                <Input
                  id="freelancerAddress"
                  type="text"
                  placeholder="0x..."
                  value={formData.freelancerAddress}
                  onChange={(e) => handleChange('freelancerAddress', e.target.value)}
                  className={`font-mono ${errors.freelancerAddress ? 'border-red-500' : ''}`}
                />
                {errors.freelancerAddress && (
                  <p className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {errors.freelancerAddress}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Payment Amount (ETH) <span className="text-red-500">*</span></Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder="0.01"
                  value={formData.paymentAmount}
                  onChange={(e) => handleChange('paymentAmount', e.target.value)}
                  className={errors.paymentAmount ? 'border-red-500' : ''}
                />
                {errors.paymentAmount && (
                  <p className="flex items-center gap-1 text-sm text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    {errors.paymentAmount}
                  </p>
                )}
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-900">How escrow works</p>
                    <p className="text-sm text-blue-700">
                      Your payment will be deposited into the smart contract. The freelancer can only receive payment after completing work and getting your approval.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <PrimaryButton
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard')}
                  disabled={loading}
                  className="sm:w-auto"
                >
                  Cancel
                </PrimaryButton>
                <PrimaryButton
                  type="submit"
                  loading={loading}
                  disabled={loading}
                  className="sm:w-auto"
                >
                  Create Gig & Deposit Payment
                </PrimaryButton>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}