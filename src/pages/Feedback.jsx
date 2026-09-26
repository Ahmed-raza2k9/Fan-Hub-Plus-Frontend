import React, { useState } from 'react';
import { MessageSquare, Check, Send, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Feedback() {
  const { currentUser } = useAuth();
  const { addFeedback } = useData();

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || message.length < 10) {
      setError('Message must be at least 10 characters.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const res = await addFeedback({
      type: 'suggestion',
      message: message.trim()
    });
    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
    } else {
      setError(res.error || 'Failed to submit feedback.');
    }
  };

  const handleReset = () => {
    setMessage('');
    setIsSubmitted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-20 pt-6 selection:bg-red-500/30">
      <div className="text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/40 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.15)]">
          <Sparkles className="w-4 h-4 text-red-500" />
          <span>Community Voice</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight font-display">
          Direct <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400 drop-shadow-sm">Message</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-medium max-w-xl mx-auto leading-relaxed">
          Share your thoughts, suggestions, or simply drop a line. Your voice shapes the future of Fan Hub Plus.
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-10 rounded-3xl bg-[#0a0204] border border-green-500/30 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-950/80 border border-green-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-white font-display">Message Sent Successfully!</h3>
            <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Thank you for reaching out. Your message has been safely delivered to our community team.
            </p>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="mt-8 px-8 py-3 text-sm font-bold text-white bg-transparent border border-red-500/50 hover:bg-red-950/50 rounded-full transition-all hover:scale-105 active:scale-95"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <div className="relative p-1">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-red-900/10 to-transparent blur-xl rounded-3xl pointer-events-none" />
          <form onSubmit={handleSubmit} className="relative p-8 sm:p-12 rounded-3xl bg-[#0a0204] border border-white/5 space-y-8 shadow-2xl">
            <div>
              <label className="block text-sm font-bold tracking-wider text-white mb-4">
                What would you like to share?
              </label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full px-5 py-4 bg-[#150508] border border-red-500/30 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none shadow-inner"
              />
              {error && <p className="text-xs text-red-400 mt-2 font-medium flex items-center gap-1.5"><span className="w-1 h-1 rounded-full bg-red-400" />{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-4 px-8 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Send className="w-5 h-5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
