import Link from 'next/link';
import { Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Clapperboard className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-headline text-foreground">
            VideoCraft AI
          </span>
        </Link>
        <nav>
          <Button variant="ghost" asChild>
            <Link href="/admin">
              Admin Panel
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
