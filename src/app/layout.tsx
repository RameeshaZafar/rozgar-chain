import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/contexts/WalletContext';
import { Navbar } from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';
import FarcasterWrapper from "@/components/FarcasterWrapper";

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <WalletProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <FarcasterWrapper>
                {children}
              </FarcasterWrapper>
            </main>
          </div>
          <Toaster position="top-right" />
        </WalletProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Rozgar Chain Escrow dApp",
  description: "Rozgar Chain enables secure freelance payments on the Base blockchain. Connect your wallet, manage gigs, and ensure fair transactions between clients and freelancers. Built for Base Pakistan's Mini App Hyperthon 2025.",
  other: { 
    "fc:frame": JSON.stringify({
      "version": "next",
      "imageUrl": "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_ad5592ae-ddd5-4c9b-8640-9d1b72ba1abe-eBqAMOTMebVQlqBYlhFNYiBwiIaiTc",
      "button": {
        "title": "Open with Ohara",
        "action": {
          "type": "launch_frame",
          "name": "Rozgar Chain Escrow dApp",
          "url": "https://circus-row-879.app.ohara.ai",
          "splashImageUrl": "https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg",
          "splashBackgroundColor": "#ffffff"
        }
      }
    }) 
  }
};