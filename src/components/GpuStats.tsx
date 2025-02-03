import { useEffect, useState, useCallback, useRef } from 'react';
import { Activity } from 'lucide-react';

interface GpuStats {
  gpu_name: string;
  temperature: number;
  fan_speed: number;
  memory: {
    total: number;
    used: number;
  };
  utilization: number;
  power: {
    draw: number;
    limit: number;
  };
}

const WS_URL = process.env.NEXT_PUBLIC_GPU_STATS_WS_URL || 'ws://stats.sparecycles.dev';

export function GpuStats() {
  const [stats, setStats] = useState<GpuStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    if (isConnecting || wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    setIsConnecting(true);
    setError(null);

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnecting(false);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setStats(data);
      } catch (err) {
        setError('Failed to parse GPU stats');
      }
    };

    ws.onerror = () => {
      setError('Failed to connect to GPU stats service');
      setIsConnecting(false);
      wsRef.current = null;
    };

    ws.onclose = () => {
      setIsConnecting(false);
      wsRef.current = null;
      reconnectTimeoutRef.current = setTimeout(() => {
        if (!wsRef.current) {
          connect();
        }
      }, 5000);
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  if (error || !stats) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">GPU Stats</h2>
          <Activity className="w-5 h-5 text-blue-400" />
        </div>
        <div className="text-gray-400">
          {error || (isConnecting ? 'Connecting...' : 'Loading GPU stats...')}
        </div>
      </div>
    );
  }

  const memoryPercentage = (stats.memory.used / stats.memory.total) * 100;
  
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
            <span>{stats.memory.used}/{stats.memory.total} MB</span>
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
            <span>{stats.power.draw}/{stats.power.limit}W</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-400 rounded-full h-2 transition-all duration-500"
              style={{ width: `${(stats.power.draw / stats.power.limit) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}