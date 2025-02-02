import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Cpu, MessageSquare, Activity, Settings, Power, Info } from 'lucide-react';
import { Chat } from './components/chat';
import { About } from './components/about';

interface SystemStats {
  gpuUsage: number;
  temperature: number;
  memoryUsage: number;
  isAvailable: boolean;
}

function App() {
  const [systemStats, setSystemStats] = React.useState<SystemStats>({
    gpuUsage: 0,
    temperature: 0,
    memoryUsage: 0,
    isAvailable: true,
  });
  const [isSharing, setIsSharing] = React.useState(false);

  // Simulate system stats updates
  React.useEffect(() => {
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
              to="/about"
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

        <Routes>
          <Route path="/" element={
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-2">
                <Chat />
              </div>

              <div className="space-y-6">
                <div className="bg-gray-800 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">GPU Status</h2>
                    <Activity className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Usage</span>
                        <span>{systemStats.gpuUsage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-400 rounded-full h-2 transition-all duration-500"
                          style={{ width: `${systemStats.gpuUsage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Temperature</span>
                        <span>{systemStats.temperature.toFixed(1)}°C</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`rounded-full h-2 transition-all duration-500 ${
                            systemStats.temperature > 70 ? 'bg-red-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(systemStats.temperature / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Chat Models</h2>
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span>GPT-3.5 Turbo</span>
                      <span className="px-2 py-1 text-sm bg-green-500 rounded">Active</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <span>LLaMA 2</span>
                      <span className="px-2 py-1 text-sm bg-gray-600 rounded">Disabled</span>
                    </div>
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
          } />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;