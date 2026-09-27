import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Heart, Shield, Flame } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-red-950/40 bg-white dark:bg-[#060810] text-zinc-600 dark:text-zinc-400 text-xs pb-20 md:pb-0 transition-colors duration-300">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="space-y-3.5">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#ff2e63] to-[#d6004c] p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-white dark:bg-[#0a0204] rounded-[10px] flex items-center justify-center">
                  <Flame className="w-4 h-4 text-[#ff2e63]" />
                </div>
              </div>
              <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-white font-display">
                Fan Hub <span className="text-red-500 font-black">PLUS</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
              The premier destination for fandom culture across Anime, Gaming, Movies, TV Shows, K-Pop, Comics, Manga, and Cosplay.
            </p>
            <div className="pt-1">
              <Link
                to="/feedback"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-700 dark:text-zinc-200 bg-zinc-100 hover:bg-zinc-200 dark:bg-red-950/30 dark:hover:bg-red-900/40 border border-zinc-200 dark:border-red-500/30 transition-all shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5 text-red-500" />
                <span>Send Feedback</span>
              </Link>
            </div>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-3 font-display">
              Quick Links
            </h5>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">Explore</Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">Categories</Link>
              </li>
              <li>
                <Link to="/media" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">Media</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">About Us</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-3 font-display">
              Fandom Universe
            </h5>
            <ul className="space-y-2">
              <li>
                <Link to="/characters" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">Characters</Link>
              </li>
              <li>
                <Link to="/merchandise" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">Merchandise</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/fan-creations" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">Fan Articles</Link>
              </li>
              <li>
                <Link to="/bookmarks" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">Bookmarks</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-200 mb-3 font-display">
              Platform & Support
            </h5>
            <ul className="space-y-2">
              <li>
                <Link to="/feedback" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">Feedback & Support</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-red-500 dark:hover:text-red-400 transition-colors">Member Dashboard</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-red-500" />
                  <span>Admin Management</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-200 dark:border-red-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-zinc-500 dark:text-zinc-500">
            © 2026 Fan Hub Plus. All fandom logos and media properties belong to their respective creators.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-zinc-500 dark:text-zinc-500 font-medium">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> for Fandoms
            </span>
            <span>·</span>
            <span>Production Grade Frontend</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
