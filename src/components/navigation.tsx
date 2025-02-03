'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  if (isHome) {
    return null;
  }

  return (
    <Link 
      href="/" 
      className="inline-flex items-center text-blue-500 hover:text-blue-600 mb-4 group"
    >
      <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
      Back to Home
    </Link>
  );
} 