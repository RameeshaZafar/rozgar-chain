// Mock data for development and demonstration
// This will be replaced with real blockchain data once the contract is deployed

import type { Gig, TimelineEvent } from '@/types/gig';

export function generateMockGigs(currentAddress: string): Gig[] {
  const now = Date.now();
  
  return [
    {
      id: '1',
      title: 'Build a Landing Page',
      description: 'Need a modern landing page for a SaaS product. Must be responsive and include animations.',
      clientAddress: '0x1234567890123456789012345678901234567890',
      freelancerAddress: currentAddress,
      paymentAmount: '0.5',
      paymentAmountWei: '500000000000000000',
      status: 'In Progress',
      createdAt: now - 86400000 * 2, // 2 days ago
      timeline: [
        {
          id: 't1-1',
          timestamp: now - 86400000 * 2,
          action: 'Gig Created',
          description: 'Client deposited 0.5 ETH into escrow'
        },
        {
          id: 't1-2',
          timestamp: now - 86400000 * 1.5,
          action: 'Gig Accepted',
          description: 'Freelancer accepted the gig'
        }
      ]
    },
    {
      id: '2',
      title: 'Smart Contract Audit',
      description: 'Security audit for ERC-20 token contract. Need detailed report of vulnerabilities.',
      clientAddress: currentAddress,
      freelancerAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      paymentAmount: '2.0',
      paymentAmountWei: '2000000000000000000',
      status: 'Submitted',
      createdAt: now - 86400000 * 5, // 5 days ago
      timeline: [
        {
          id: 't2-1',
          timestamp: now - 86400000 * 5,
          action: 'Gig Created',
          description: 'Client deposited 2.0 ETH into escrow'
        },
        {
          id: 't2-2',
          timestamp: now - 86400000 * 4,
          action: 'Gig Accepted',
          description: 'Freelancer accepted the gig'
        },
        {
          id: 't2-3',
          timestamp: now - 86400000 * 0.5,
          action: 'Work Submitted',
          description: 'Freelancer submitted the completed work'
        }
      ]
    },
    {
      id: '3',
      title: 'Logo Design for Crypto Startup',
      description: 'Create a modern logo for a DeFi platform. Multiple revisions included.',
      clientAddress: '0x9876543210987654321098765432109876543210',
      freelancerAddress: currentAddress,
      paymentAmount: '0.3',
      paymentAmountWei: '300000000000000000',
      status: 'Waiting',
      createdAt: now - 86400000 * 1, // 1 day ago
      timeline: [
        {
          id: 't3-1',
          timestamp: now - 86400000 * 1,
          action: 'Gig Created',
          description: 'Client deposited 0.3 ETH into escrow'
        }
      ]
    },
    {
      id: '4',
      title: 'NFT Collection Development',
      description: 'Develop and deploy an NFT collection with 10,000 unique items on Base.',
      clientAddress: currentAddress,
      freelancerAddress: '0x5555555555555555555555555555555555555555',
      paymentAmount: '5.0',
      paymentAmountWei: '5000000000000000000',
      status: 'Completed',
      createdAt: now - 86400000 * 10, // 10 days ago
      timeline: [
        {
          id: 't4-1',
          timestamp: now - 86400000 * 10,
          action: 'Gig Created',
          description: 'Client deposited 5.0 ETH into escrow'
        },
        {
          id: 't4-2',
          timestamp: now - 86400000 * 9,
          action: 'Gig Accepted',
          description: 'Freelancer accepted the gig'
        },
        {
          id: 't4-3',
          timestamp: now - 86400000 * 3,
          action: 'Work Submitted',
          description: 'Freelancer submitted the completed work'
        },
        {
          id: 't4-4',
          timestamp: now - 86400000 * 2,
          action: 'Payment Released',
          description: 'Client approved work and released 5.0 ETH'
        }
      ]
    }
  ];
}

export function generateNewGig(
  id: string,
  title: string,
  description: string,
  clientAddress: string,
  freelancerAddress: string,
  paymentAmount: string
): Gig {
  const now = Date.now();
  const paymentAmountWei = (parseFloat(paymentAmount) * 1e18).toString();

  return {
    id,
    title,
    description,
    clientAddress,
    freelancerAddress,
    paymentAmount,
    paymentAmountWei,
    status: 'Waiting',
    createdAt: now,
    timeline: [
      {
        id: `${id}-timeline-1`,
        timestamp: now,
        action: 'Gig Created',
        description: `Client deposited ${paymentAmount} ETH into escrow`
      }
    ]
  };
}
