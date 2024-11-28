import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 text-center gradient-bg">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          Developer Tools Hub
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
          A collection of essential tools for developers. Simple, elegant, and efficient.
        </p>
      </div>
      <div className="flex space-x-4">
        <Link href="/tools/data-conversion/json-yaml">
          <div className="gradient-border">
            <Button size="lg" variant="ghost" className="relative group">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </Link>
      </div>
    </div>
  );
}