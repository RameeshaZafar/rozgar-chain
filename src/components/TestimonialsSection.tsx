'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  emoji: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Payment came instantly after approval. No more waiting for bank transfers or chasing clients!",
    name: "Ahmad",
    role: "Graphic Designer",
    emoji: "🎨"
  },
  {
    quote: "As a client, I feel safe knowing my money is locked until work is done. Finally, a trustworthy platform!",
    name: "Sara",
    role: "Startup Founder",
    emoji: "🚀"
  },
  {
    quote: "First time using blockchain for payments. Surprisingly simple! Even my non-tech friends understood it.",
    name: "Ali",
    role: "Content Writer",
    emoji: "✍️"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
             What Users Say
          </h2>
          <p className="text-gray-400 text-lg">
            Real feedback from real users
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="dark-card-bg neon-border-blue border-2 hover:neon-glow-blue transition-all duration-300"
            >
              <CardContent className="p-6">
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="h-8 w-8 text-green-500/50" />
                </div>
                
                {/* Quote Text */}
                <p className="text-gray-300 italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-lg">
                    {testimonial.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}