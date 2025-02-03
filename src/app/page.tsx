'use client';

import { Cpu, MessageSquare, Activity, Settings, Power, Info } from 'lucide-react';
import Link from 'next/link';
import { Chat } from '@/components/chat';
import { useEffect, useState } from 'react';
import { GpuStats } from '@/components/GpuStats';

interface SystemStats {
  gpuUsage: number;
  temperature: number;
  memoryUsage: number;
  isAvailable: boolean;
}

export default function Home() {
  const [systemStats, setSystemStats] = useState<SystemStats>({
    gpuUsage: 0,
    temperature: 0,
    memoryUsage: 0,
    isAvailable: true,
  });
  const [isSharing, setIsSharing] = useState(false);
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/models')
      .then(res => res.json())
      .then(data => setModels(data));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        gpuUsage: Math.random() * 100,
        temperature: 40 + Math.random() * 40,
        memoryUsage: Math.random() * 100,
        isAvailable: prev.gpuUsage < 80,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <Cpu className="w-8 h-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Spare Cycles</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/about"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Info className="w-5 h-5" />
              <span>About</span>
            </Link>
            <button 
              onClick={() => setIsSharing(!isSharing)}
              className={`px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                isSharing 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              <Power className="w-5 h-5" />
              <span>{isSharing ? 'Stop Sharing' : 'Start Sharing'}</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Chat models={models} />
          </div>

          <div className="space-y-6">
            <GpuStats />
            
            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Chat Models</h2>
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div className="space-y-3">
                {models.map((model) => (
                  <div key={model} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span>{model}</span>
                    <span className="px-2 py-1 text-sm bg-green-500 rounded">Active</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Settings</h2>
                <Settings className="w-5 h-5 text-blue-400" />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Max GPU Usage</span>
                  <input 
                    type="range" 
                    className="w-32"
                    min="0"
                    max="100"
                    defaultValue="80"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Auto-shutdown Temperature</span>
                  <input 
                    type="number" 
                    className="w-20 px-2 py-1 bg-gray-700 rounded"
                    defaultValue="85"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}