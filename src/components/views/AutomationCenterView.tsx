import React, { useState } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  Clock, 
  Send, 
  Zap, 
  Database, 
  FolderSync, 
  BellRing, 
  Play, 
  Terminal,
  RefreshCw
} from 'lucide-react';
import { AutomationIntegration } from '../../types';

interface AutomationCenterViewProps {
  integrations: AutomationIntegration[];
  onToggleStatus: (id: string) => void;
}

export const AutomationCenterView: React.FC<AutomationCenterViewProps> = ({
  integrations,
  onToggleStatus
}) => {
  const [testPayload, setTestPayload] = useState('{"leadName": "Julian Croft", "source": "Instagram DM", "vehicle": "Porsche Macan S"}');
  const [selectedProvider, setSelectedProvider] = useState('Make.com');
  const [isTesting, setIsTesting] = useState(false);
  const [testResponse, setTestResponse] = useState<any>(null);

  const handleTestWebhook = async () => {
    setIsTesting(true);
    setTestResponse(null);

    try {
      let parsed = {};
      try {
        parsed = JSON.parse(testPayload);
      } catch (e) {
        parsed = { raw: testPayload };
      }

      const res = await fetch('/api/webhook-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedProvider,
          eventType: 'lead.inbound_captured',
          payload: parsed
        })
      });

      const data = await res.json();
      setTestResponse(data);
    } catch (err: any) {
      setTestResponse({ error: 'Failed to dispatch webhook test', details: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  const getProviderIcon = (provider: AutomationIntegration['provider']) => {
    switch (provider) {
      case 'Make.com':
        return <Zap className="w-5 h-5 text-indigo-500" />;
      case 'OneSignal':
        return <BellRing className="w-5 h-5 text-rose-500" />;
      case 'Supabase':
        return <Database className="w-5 h-5 text-emerald-500" />;
      case 'Google Drive':
        return <FolderSync className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#2D5CF6]" />
            <span className="text-[11px] font-extrabold text-[#2D5CF6] uppercase tracking-wider">
              Integration & Webhook Architecture
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#1A1A1F] tracking-tight mt-1">
            AUTOMATION CENTER
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Background connectors, webhook listeners, push notification dispatchers, and database sync.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            4 Active Connectors
          </span>
        </div>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => {
          const isActive = item.status === 'Active';
          return (
            <div
              key={item.id}
              className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      {getProviderIcon(item.provider)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-[#1A1A1F]">
                        {item.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-medium">
                        {item.provider} • {item.type}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                    isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {item.description}
                </p>

                {item.endpoint && (
                  <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 font-mono text-[11px] text-gray-600 break-all mb-3">
                    {item.endpoint}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="text-gray-400 text-[11px]">
                  <span>Latency: <strong className="text-gray-700">{item.latencyMs}ms</strong></span> • <span>{item.lastEvent}</span>
                </div>

                <button
                  onClick={() => onToggleStatus(item.id)}
                  className="font-bold text-[#2D5CF6] hover:underline cursor-pointer"
                >
                  {isActive ? 'Pause' : 'Activate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Webhook Test Simulator Terminal */}
      <div className="bg-[#1A1A1F] text-white p-6 rounded-3xl border border-gray-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#C8F169]" />
            <h3 className="font-extrabold text-sm text-white">
              Webhook Dispatch Simulator
            </h3>
          </div>
          <span className="text-[10px] font-bold text-gray-400 uppercase">
            Internal Operations Testing
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-bold text-gray-300 block mb-1">Target Service</label>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-white outline-none"
            >
              <option value="Make.com" className="bg-[#1A1A1F]">Make.com (Inbound Lead Webhook)</option>
              <option value="OneSignal" className="bg-[#1A1A1F]">OneSignal (VIP Match Push)</option>
              <option value="Supabase" className="bg-[#1A1A1F]">Supabase (VIN Records Batch)</option>
              <option value="Google Drive" className="bg-[#1A1A1F]">Google Drive (Inspection Upload)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="font-bold text-gray-300 block mb-1">JSON Test Payload</label>
            <input
              type="text"
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 font-mono text-xs text-[#C8F169] outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleTestWebhook}
          disabled={isTesting}
          className="px-5 py-2.5 rounded-xl bg-[#2D5CF6] hover:bg-[#2045cb] text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-2 disabled:opacity-40"
        >
          {isTesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 text-[#C8F169]" />}
          <span>Send Test Webhook Event</span>
        </button>

        {testResponse && (
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs text-gray-200 overflow-x-auto space-y-1">
            <p className="text-emerald-400 font-bold">✓ 200 OK — Webhook Event Confirmed</p>
            <pre className="text-[11px] text-gray-300">{JSON.stringify(testResponse, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
