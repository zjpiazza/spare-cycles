import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { Cpu, Info, Power } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spare Cycles - Share GPU Power',
  description: 'Access powerful AI models using my home GPU',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">

        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <Cpu className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Spare Cycles</h1>
          </div>
        </header>
        <div>
          {children}
        </div>
      </div>
      </div>
      </body>
    </html>
  );
}