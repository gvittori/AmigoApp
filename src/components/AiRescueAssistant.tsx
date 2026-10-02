import React, { useState } from 'react';
import { AiChatMessage } from '../types/amigo';
import { Bot, Send, User } from 'lucide-react';

export const AiRescueAssistant: React.FC = () => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: '¡Hola! Soy AMIGO AI, tu experto en rescate de perros y gatos en Uruguay. ¿Perdiste a tu mascota en Pocitos o Carrasco, encontraste un animal o necesitas tips de búsqueda?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userMsg: AiChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: inputVal,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const promptToSend = inputVal;
    setInputVal('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptToSend, language: 'es' }),
      });
      const data = await res.json();

      const aiMsg: AiChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-130px)] bg-amber-50/40 flex flex-col max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Amigo AI Rescate</h2>
            <p className="text-xs text-slate-600">Pregúntame tips de búsqueda en Uruguay, cómo calmar a un animal o verificar huellas.</p>
          </div>
        </div>
      </div>

      {/* Chat Box */}
      <div className="flex-1 bg-white border border-amber-200 rounded-3xl p-4 overflow-y-auto space-y-4 mb-4 shadow-md">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === 'user' ? 'bg-amber-600 text-white shadow-sm' : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-amber-600 text-white rounded-tr-none shadow-md'
                  : 'bg-amber-50 border border-amber-200 text-slate-800 rounded-tl-none shadow-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
              <span className={`block text-[9px] mt-1 text-right ${m.sender === 'user' ? 'text-amber-200' : 'text-slate-500'}`}>
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-slate-600">
              AMIGO AI está pensando consejos...
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Escribe tu consulta sobre rescate..."
          className="flex-1 bg-white border border-amber-200 rounded-2xl px-4 py-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold text-xs flex items-center justify-center shadow-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
