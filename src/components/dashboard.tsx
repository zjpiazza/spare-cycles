import Link from 'next/link';
import { ArrowLeft, Cpu, Zap, Shield, Clock } from 'lucide-react';

export default function Dashboard() {
  return (
    
      <div>
        <div>
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <Cpu className="w-16 h-16 text-blue-400 mx-auto" />
              <h1 className="text-4xl font-bold">About Spare Cycles</h1>
              <p className="text-xl text-gray-300">
                Access powerful AI models using my home GPU
              </p>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-gray-300 leading-relaxed">
                Spare Cycles is a personal service that allows you to access AI models running on my home GPU
                when it's not in use. Instead of relying on cloud services, you can leverage the power of a
                local GPU for running AI models, providing faster response times and more privacy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-semibold">Local Processing Power</h2>
                </div>
                <p className="text-gray-300">
                  Access a powerful GPU for AI processing when it's not being used for gaming
                  or other tasks. Get faster response times compared to cloud services.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-semibold">Secure & Private</h2>
                </div>
                <p className="text-gray-300">
                  Your data stays local and secure. All computations are sandboxed and
                  protected through advanced isolation techniques.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Clock className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-semibold">Smart Scheduling</h2>
                </div>
                <p className="text-gray-300">
                  The queue system ensures fair distribution of GPU resources while
                  maintaining optimal performance for all users.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-4">
                  <Cpu className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-semibold">Multiple AI Models</h2>
                </div>
                <p className="text-gray-300">
                  Access various AI models like GPT-3.5 Turbo and LLaMA 2, all running
                  locally on a high-performance GPU.
                </p>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Try It Out?</h2>
              <p className="text-gray-300 mb-6">
                Experience the power of local GPU-accelerated AI models with low latency and high privacy.
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Cpu className="w-5 h-5" />
                <span>Start Chatting</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}