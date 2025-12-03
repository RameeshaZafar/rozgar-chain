'use client';

// Gig card component for displaying gig information
import Basename from '@/components/Basename';
import React from 'react';
import Link from 'next/link';
import type { Gig } from '@/types/gig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { shortenAddress } from '@/lib/blockchain';
import { Calendar, Coins, User } from 'lucide-react';

interface GigCardProps {
  gig: Gig;
  currentAddress: string;
}

export function GigCard({ gig, currentAddress }: GigCardProps) {
  const isClient = gig.clientAddress.toLowerCase() === currentAddress.toLowerCase();
  const isFreelancer = gig.freelancerAddress.toLowerCase() === currentAddress.toLowerCase();

  const getUserRole = () => {
    if (isClient) return { label: 'Client', color: 'bg-green-100 text-green-800 border-green-300' };
    if (isFreelancer) return { label: 'Freelancer', color: 'bg-blue-100 text-blue-800 border-blue-300' };
    return { label: 'Viewer', color: 'bg-gray-100 text-gray-800 border-gray-300' };
  };

  const role = getUserRole();
  const formattedDate = new Date(gig.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Link href={`/gigs/${gig.id}`}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <CardTitle className="text-xl font-bold group-hover:text-green-600 transition-colors">
                {gig.title}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {gig.description}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2">
              <StatusBadge status={gig.status} />
              <Badge variant="outline" className={role.color}>
                {role.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Payment Amount */}
            <div className="flex items-center gap-2 text-sm">
              <Coins className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-600">
                {gig.paymentAmount} ETH
              </span>
            </div>

            {/* Client & Freelancer Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Client</span>
                 <Basename address={gig.clientAddress} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Freelancer</span>
                 <Basename address={gig.freelancerAddress} />
                </div>
              </div>
            </div>

            {/* Created Date */}
            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
              <Calendar className="h-3 w-3" />
              <span>Created on {formattedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
