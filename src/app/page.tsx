'use client';

import { useEffect, useState } from 'react';
import Dashboard from '@/components/dashboard';

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
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        if (response.ok) {
          setModels(data.models);
        }
      } catch (error) {
        console.error('Health check failed:', error);
      }
    }
    
    fetchModels();
    const interval = setInterval(fetchModels, 30000);
    return () => clearInterval(interval);
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

  return <Dashboard />;
}