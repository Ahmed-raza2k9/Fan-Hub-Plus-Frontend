import React, { useState } from 'react';
import { MessageSquare, X, Bot, Sparkles, Send, ArrowRight } from 'lucide-react';

export default function ExternalChatbotWidget({ isOpen: propIsOpen, onClose: propOnClose, onOpen: propOnOpen }) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am your Fan Hub Plus fandom guide. Ask me about anime releases, trending movies, convention tickets, or lore!' }
  ]);

  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const handleOpen = () => {
    if (propOnOpen) propOnOpen();
    else setInternalIsOpen(true);
  };
  const handleClose = () => {
    if (propOnClose) propOnClose();
    else setInternalIsOpen(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setInputMessage('');

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let reply = 'Check out our Explore catalog and Categories section for all official series and character lore!';
      if (lower.includes('anime') || lower.includes('one piece') || lower.includes('luffy')) {
        reply = 'One Piece Episode 1120 is trending #1 right now! You can watch trailers and read full character breakdowns in the Media and Characters tabs.';
      } else if (lower.includes('event') || lower.includes('expo') || lower.includes('ticket')) {
        reply = 'The next premier convention is Anime Expo Karachi 2025 & Global Fandom Expo. Pass reservations are open under the Events section!';
      } else if (lower.includes('merch') || lower.includes('figure')) {
        reply = 'The Luffy Gear 5 Collector Figure ($49.99) and Attack on Titan limited posters are currently showcased in the Merchandise section!';
      }
      setMessages((prev) => [...prev, { role: 'bot', text: reply }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-18 md:bottom-5 right-3 sm:right-5 z-40">
      {isOpen ? (
        <div className="w-[calc(100vw-24px)] xs:w-80 sm:w-96 bg-[#0c1222] border border-[#1b253d] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 flex flex-col h-[400px] xs:h-[440px] sm:h-[480px] max-h-[75vh]">
          <div className="p-3.5 sm:p-4 bg-[#10182c] border-b border-[#1b253d] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-none">Fan Hub AI Assistant</h4>
                <p className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-[#1a253e]"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3 text-xs bg-[#090d16]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-[#12192c] text-zinc-200 border border-[#1d273f]'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-2.5 sm:p-3 bg-[#10182c] border-t border-[#1b253d] flex gap-2 shrink-0">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about anime, merch, events..."
              className="flex-1 px-3 py-2 bg-[#090d16] border border-[#1b253d] rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shrink-0 active:scale-95"
              aria-label="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className="group flex items-center gap-2 sm:gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-full shadow-xl shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 border border-white/20"
          aria-label="Open Fandom Assistant"
        >
          <div className="relative">
            <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold tracking-wide">Ask AI Chatbot</span>
        </button>
      )}
    </div>
  );
}
