'use client'
// Home page - Landing page with hero section and features
import { StatsSection } from '@/components/StatsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@/contexts/WalletContext';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Zap, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sdk } from "@farcaster/miniapp-sdk";
import { useAddMiniApp } from "@/hooks/useAddMiniApp";
import { useQuickAuth } from "@/hooks/useQuickAuth";
import { useIsInFarcaster } from "@/hooks/useIsInFarcaster";

export default function HomePage() {
    const { addMiniApp } = useAddMiniApp();
    const isInFarcaster = useIsInFarcaster()
    useQuickAuth(isInFarcaster)
    useEffect(() => {
      const tryAddMiniApp = async () => {
        try {
          await addMiniApp()
        } catch (error) {
          console.error('Failed to add mini app:', error)
        }

      }

    

      tryAddMiniApp()
    }, [addMiniApp])
    useEffect(() => {
      const initializeFarcaster = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100))
          
          if (document.readyState !== 'complete') {
            await new Promise<void>(resolve => {
              if (document.readyState === 'complete') {
                resolve()
              } else {
                window.addEventListener('load', () => resolve(), { once: true })
              }

            })
          }

    

          await sdk.actions.ready()
          console.log('Farcaster SDK initialized successfully - app fully loaded')
        } catch (error) {
          console.error('Failed to initialize Farcaster SDK:', error)
          
          setTimeout(async () => {
            try {
              await sdk.actions.ready()
              console.log('Farcaster SDK initialized on retry')
            } catch (retryError) {
              console.error('Farcaster SDK retry failed:', retryError)
            }

          }, 1000)
        }

      }

    

      initializeFarcaster()
    }, [])
  const { isConnected, isConnecting, connect } = useWallet();

  return (
    <div className="min-h-screen scroll-smooth">
      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden dark-gradient-bg px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            {/* Hero Content */}
            <h1 className="animate-fade-in-up text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="block">Rozgar Chain</span>
              <span className="mt-3 block gradient-text-green-blue text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                Secure Freelance Payments
              </span>
              <span className="mt-2 block gradient-text-green-blue text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
                
              </span>
            </h1>
            
            <p className="animate-fade-in-up animation-delay-200 mx-auto mt-8 max-w-3xl text-lg text-gray-300 sm:text-xl lg:text-2xl leading-relaxed">
              On-chain escrow for Pakistan's freelancers and clients. <br className="hidden sm:block" />
              <span className="font-semibold text-green-400">No "trust me bro" payments</span> — the smart contract holds the funds until the work is done.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up animation-delay-400 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {isConnected ? (
                <Link href="/dashboard">
                  <PrimaryButton className="btn-scale-hover px-10 py-6 text-lg shadow-2xl shadow-green-500/30">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </PrimaryButton>
                </Link>
              ) : (
                <>
                  <PrimaryButton
                    onClick={connect}
                    loading={isConnecting}
                    className="btn-scale-hover px-10 py-6 text-lg shadow-2xl shadow-green-500/30"
                  >
                    Connect Wallet
                  </PrimaryButton>
                  <Link href="/dashboard">
                    <PrimaryButton
                      variant="outline"
                      disabled={true}
                      className="btn-scale-hover px-10 py-6 text-lg !opacity-100 !bg-transparent !text-green-400 !border-green-400 hover:!light-green-400 hover:!text-white hover:!border-green-400 !cursor-pointer !pointer-events-auto"
                    >
                      Go to Dashboard
                    </PrimaryButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Neon Glows */}
        <div className="absolute left-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-green-500/20 to-transparent opacity-40 blur-3xl" />
        <div className="absolute bottom-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-blue-500/20 to-transparent opacity-40 blur-3xl" />
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="dark-gradient-bg px-4 py-16 sm:px-6 sm:py-24 lg:px-8 border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center animate-fade-in-up">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              How 
              <span className="gradient-text-green-blue"> Rozgar Chain Works</span>
            </h2>
            <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto">
              Spin up a gig, ship the work, and let the contract handle the payout.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <Card className="animate-fade-in-up animation-delay-200 dark-card-bg neon-border-green neon-glow-green border-2 transition-all duration-300">
              <CardHeader>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg shadow-green-500/40">
                  <span className="text-2xl font-extrabold">1</span>
                </div>
                <CardTitle className="text-2xl font-bold text-white">Spin Up a Gig</CardTitle>
                <CardDescription className="text-base text-gray-300 mt-3">
                  Create a gig, lock the payment into escrow, and define the terms up front.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span>Funds locked safely on-chain</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <span>Terms clearly defined</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="animate-fade-in-up animation-delay-400 dark-card-bg neon-border-blue neon-glow-blue border-2 transition-all duration-300">
              <CardHeader>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40">
                  <span className="text-2xl font-extrabold">2</span>
                </div>
                <CardTitle className="text-2xl font-bold text-white">Ship the Work</CardTitle>
                <CardDescription className="text-base text-gray-300 mt-3">
                  Your freelancer accepts the gig and delivers work with full on-chain transparency.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="h-5 w-5 text-blue-400" />
                    <span>Work with confidence</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="h-5 w-5 text-blue-400" />
                    <span>Submit when ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="animate-fade-in-up animation-delay-600 dark-card-bg neon-border-green neon-glow-green border-2 transition-all duration-300">
              <CardHeader>
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/40">
                  <span className="text-2xl font-extrabold">3</span>
                </div>
                <CardTitle className="text-2xl font-bold text-white">Trustless Payout</CardTitle>
                <CardDescription className="text-base text-gray-300 mt-3">
                  Approve the work and the smart contract instantly releases funds — no middleman, no drama.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="h-5 w-5 text-purple-400" />
                    <span>Instant payment release</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="h-5 w-5 text-purple-400" />
                    <span>No middleman fees</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Rozgar Chain Section */}
      <section id="why-rozgar" className="dark-gradient-bg px-4 py-16 sm:px-6 sm:py-24 lg:px-8 border-t border-gray-800/50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center animate-fade-in-up">
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
              Why Choose <span className="gradient-text-green-blue">Rozgar Chain?</span>
            </h2>
            <p className="mt-6 text-xl text-gray-400 max-w-3xl mx-auto">
              Designed for Pakistan's freelance economy, powered by Base.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <Card className="animate-fade-in-up animation-delay-200 dark-card-bg neon-border-green hover:neon-glow-green border-2 transition-all duration-300">
              <CardHeader>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
                  <Shield className="h-10 w-10 text-green-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">On-Chain Escrow</CardTitle>
                <CardDescription className="text-base text-gray-300 mt-3 leading-relaxed">
                  Funds sit in a smart contract — not in someone's inbox. <span className="font-semibold text-green-400">No screenshots, no excuses.</span>
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="animate-fade-in-up animation-delay-400 dark-card-bg neon-border-blue hover:neon-glow-blue border-2 transition-all duration-300">
              <CardHeader>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
                  <DollarSign className="h-10 w-10 text-blue-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">Fair for Both Sides</CardTitle>
                <CardDescription className="text-base text-gray-300 mt-3 leading-relaxed">
                  Clients only release payment when work is delivered. Freelancers know <span className="font-semibold text-blue-400">the money is already locked in.</span>
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="animate-fade-in-up animation-delay-600 dark-card-bg neon-border-green hover:neon-glow-green border-2 transition-all duration-300">
              <CardHeader>
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
                  <Zap className="h-10 w-10 text-purple-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-white">Built on Base</CardTitle>
                <CardDescription className="text-base text-gray-300 mt-3 leading-relaxed">
                  Low fees, fast confirmations, and a <span className="font-semibold text-purple-400">modern L2 experience</span> tuned for on-chain apps.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      
      {/* Stats Section */}
      <section id="stats" className="dark-gradient-bg border-t border-gray-800/50">
  <StatsSection />
</section>

      {/* Testimonials Section */}
      <section className="dark-gradient-bg">
        <TestimonialsSection />
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 dark-gradient-bg px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-blue-500 shadow-lg shadow-green-500/30">
                <span className="text-2xl font-extrabold text-white">RC</span>
              </div>
              <span className="text-xl font-bold text-white">Rozgar Chain</span>
            </div>
            <p className="text-center text-sm text-gray-400">
              Built for <span className="font-semibold text-green-400">Base Pakistan Mini App Hyperthon 2025</span>
            </p>
          </div>
          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Powered by Base Sepolia • Smart Contracts • Decentralized Escrow</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
