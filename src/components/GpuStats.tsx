import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';


interface GpuStats {
  id: number;
  timestamp: string;
  gpu_name: string;
  temperature: number;
  fan_speed: number;
  memory_total: number;
  memory_used: number;
  utilization: number;
  power_draw: number;
  power_limit: number;
}

const supabase = createClient();


export function GpuStats() {
  const [stats, setStats] = useState<GpuStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // First, fetch the most recent stats
    const fetchLatestStats = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('gpu_stats')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(1)
          .single();

        if (fetchError) throw fetchError;
        if (data) setStats(data);
      } catch (err) {
        setError('Failed to fetch initial GPU stats');
      }
    };

    fetchLatestStats();

    // Subscribe to new inserts
    const subscription = supabase
      .channel('gpu_stats_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'gpu_stats',
        },
        (payload) => {
          setStats(payload.new as GpuStats);
        }
      )
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (error || !stats) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">GPU Stats</h2>
          <Activity className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-gray-400">
          {error || 'Loading GPU stats...'}
        </div>
      </div>
    );
  }

  const memoryPercentage = (stats.memory_used / stats.memory_total) * 100;
  
  return (
    <div className="bg-gray-800 p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">GPU Status</h2>
        <Activity className="w-5 h-5 text-blue-400" />
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span>Utilization</span>
            <span>{stats.utilization.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-400 rounded-full h-2 transition-all duration-500"
              style={{ width: `${stats.utilization}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span>Temperature</span>
            <span>{stats.temperature}°C</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className={`rounded-full h-2 transition-all duration-500 ${
                stats.temperature > 70 ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${(stats.temperature / 100) * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span>Memory</span>
            <span>{stats.memory_used}/{stats.memory_total} MB</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-400 rounded-full h-2 transition-all duration-500"
              style={{ width: `${memoryPercentage}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span>Power</span>
            <span>{stats.power_draw}/{stats.power_limit}W</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-400 rounded-full h-2 transition-all duration-500"
              style={{ width: `${(stats.power_draw / stats.power_limit) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}