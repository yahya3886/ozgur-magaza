import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, MessageCircle, Trash2, Loader2, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
}

interface ChatScreenProps {
  user: User;
  onClose: () => void;
}

export function ChatScreen({ user, onClose }: ChatScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const displayName = 'Misafir';
  const isAnon = user.is_anonymous === true;

  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  }, []);

  // Load initial messages
  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, error: err } = await supabase
        .from('chat_messages')
        .select('id, user_id, username, content, is_anonymous, created_at')
        .order('created_at', { ascending: true })
        .limit(100);

      if (err) {
        setError('Mesajlar yuklenemedi.');
      } else if (data) {
        setMessages(data as ChatMessage[]);
      }
      setLoading(false);
      setTimeout(() => scrollToBottom(false), 100);
    })();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          setTimeout(() => scrollToBottom(), 50);
        },
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'chat_messages' },
        (payload) => {
          const deletedId = (payload.old as ChatMessage).id;
          setMessages((prev) => prev.filter((m) => m.id !== deletedId));
        },
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setOnlineCount((c) => Math.max(c, 1));
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [scrollToBottom]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMessage.trim();
    if (!trimmed || sending) return;
    if (trimmed.length > 500) {
      setError('Mesaj en fazla 500 karakter olabilir.');
      return;
    }

    setSending(true);
    setError(null);
    const { error: err } = await supabase.from('chat_messages').insert({
      content: trimmed,
      username: displayName,
      is_anonymous: isAnon,
    });

    setSending(false);
    if (err) {
      setError('Mesaj gonderilemedi. Tekrar deneyin.');
    } else {
      setNewMessage('');
    }
  };

  const handleDelete = async (msgId: string) => {
    const { error: err } = await supabase
      .from('chat_messages')
      .delete()
      .eq('id', msgId);
    if (err) {
      setError('Mesaj silinemedi.');
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  };

  const isOwnMessage = (msg: ChatMessage) => msg.user_id === user.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/20">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Topluluk Sohbeti</h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Users className="h-3.5 w-3.5" />
                <span>Acik kaynak toplulugu</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-5 mt-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-xs font-medium underline">
              Kapat
            </button>
          </div>
        )}

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 space-y-3 overflow-y-auto px-5 py-4"
        >
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <MessageCircle className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Henuz mesaj yok
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Ilk mesaji sen gonder!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const own = isOwnMessage(msg);
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${own ? 'flex-row-reverse' : 'flex-row'}`}
                  style={{ animation: 'fadeIn 0.2s ease-out' }}
                >
                  {/* Avatar */}
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                    msg.is_anonymous
                      ? 'bg-gradient-to-br from-slate-400 to-slate-500'
                      : own
                        ? 'bg-gradient-to-br from-teal-500 to-emerald-600'
                        : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  }`}>
                    {msg.username.charAt(0).toUpperCase()}
                  </div>

                  {/* Message bubble */}
                  <div className={`group max-w-[75%] ${own ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-center gap-2 mb-0.5 ${own ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {msg.username}
                        {msg.is_anonymous && (
                          <span className="ml-1 text-[10px] font-normal text-slate-400">(misafir)</span>
                        )}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 ${own ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`rounded-2xl px-3.5 py-2 text-sm break-words ${
                        own
                          ? 'rounded-tr-sm bg-teal-600 text-white'
                          : 'rounded-tl-sm bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100'
                      }`}>
                        {msg.content}
                      </div>
                      {own && (
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="opacity-0 transition-opacity group-hover:opacity-100 text-slate-400 hover:text-red-500"
                          aria-label="Mesaji sil"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-800">
          <form onSubmit={handleSend} className="flex items-center gap-2.5">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mesajinizi yazin..."
              maxLength={500}
              className="h-12 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:focus:border-teal-400"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-white transition-all hover:bg-teal-700 active:scale-95 disabled:opacity-40 disabled:hover:bg-teal-600"
              aria-label="Gonder"
            >
              {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </button>
          </form>
          <div className="mt-1.5 text-right text-[10px] text-slate-400 dark:text-slate-500">
            {newMessage.length}/500
          </div>
        </div>
      </div>
    </div>
  );
}
