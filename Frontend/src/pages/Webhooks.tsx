import { useEffect, useState } from 'react';
import axios from 'axios';
import { JsonView, darkStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { RefreshCw, Code2, Clock } from 'lucide-react';

interface WebhookLog {
  id: number;
  method: string;
  headers: string;
  payload: string;
  receivedAt: string;
}

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState<WebhookLog[]>([]);
  const [selectedWebhook, setSelectedWebhook] = useState<WebhookLog | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWebhooks = async () => {
    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5099';
      const response = await axios.get(`${apiUrl}/api/webhook/latest`);
      setWebhooks(response.data);
      if (response.data.length > 0 && !selectedWebhook) {
        setSelectedWebhook(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const parseJson = (jsonStr: string) => {
    try {
      if (!jsonStr) return {};
      return JSON.parse(jsonStr);
    } catch {
      return { raw: jsonStr };
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Webhook Logs</h1>
          <p className="text-textMuted">Son gelen 10 webhook isteği</p>
        </div>
        <button 
          onClick={fetchWebhooks}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Yenile
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
        {/* Left Pane - List */}
        <div className="glass-panel overflow-y-auto flex flex-col p-2 gap-2 h-full">
          {webhooks.length === 0 && !loading && (
            <div className="flex-1 flex items-center justify-center text-textMuted">
              Kayıt bulunamadı.
            </div>
          )}
          
          {webhooks.map((wh) => (
            <div 
              key={wh.id}
              onClick={() => setSelectedWebhook(wh)}
              className={`p-4 rounded-xl cursor-pointer transition-all border ${
                selectedWebhook?.id === wh.id 
                  ? 'bg-primary/20 border-primary/50' 
                  : 'bg-surface border-transparent hover:bg-surfaceBorder'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                  wh.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {wh.method}
                </span>
                <span className="text-xs text-textMuted flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(wh.receivedAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-sm text-textMuted truncate">
                ID: {wh.id} • {new Date(wh.receivedAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Right Pane - Details */}
        <div className="lg:col-span-2 glass-panel flex flex-col h-full overflow-hidden">
          {selectedWebhook ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-surfaceBorder bg-surface/50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                    <Code2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Request Details</h3>
                    <p className="text-xs text-textMuted">ID: {selectedWebhook.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-textMuted mb-2 uppercase tracking-wider">Headers</h4>
                  <div className="bg-black/40 rounded-xl p-4 overflow-x-auto text-sm">
                    <JsonView data={parseJson(selectedWebhook.headers)} style={darkStyles} />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-textMuted mb-2 uppercase tracking-wider">Payload / Query</h4>
                  <div className="bg-black/40 rounded-xl p-4 overflow-x-auto text-sm">
                    <JsonView data={parseJson(selectedWebhook.payload)} style={darkStyles} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-textMuted gap-4">
              <Code2 className="w-12 h-12 opacity-20" />
              <p>Detayları görmek için soldan bir istek seçin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
