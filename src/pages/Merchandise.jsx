import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, ShoppingCart, Check, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import MerchandiseCard from '../components/MerchandiseCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';

export default function Merchandise() {
  const { merchandise } = useData();

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartModalItem, setCartModalItem] = useState(null);

  const categories = ['All', 'Figures', 'Apparel', 'Accessories', 'Home Decor', 'Posters', 'Collectibles'];

  const filteredMerch = merchandise.filter((item) => {
    const catName = typeof item.category === 'object' ? item.category?.name : item.category;
    const matchesCategory =
      selectedCategory === 'All' ||
      String(catName || '').toLowerCase() === selectedCategory.toLowerCase();
    const title = item.title || item.name || '';
    const matchesSearch =
      title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      (item.fandom && item.fandom.toLowerCase().includes(searchTerm.toLowerCase().trim()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10 pb-20">
      <div className="relative rounded-3xl overflow-hidden border border-red-900/40 bg-gradient-to-r from-[#150508] via-[#0a0b12] to-[#0e0609] p-6 sm:p-12 shadow-[0_0_60px_rgba(220,38,38,0.15)]">
        {/* Glow orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-red-900/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider">
            Official Fandom Store
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
            Official <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-400 to-red-300">Merchandise</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300">
            Bring your favorite fandoms to life. High-quality merch, for true fans.
          </p>

          <div className="pt-2">
            <a
              href="#store-grid"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-xl shadow-red-600/35 transition-all hover:scale-105"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Now</span>
            </a>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 sm:opacity-50 pointer-events-none overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1000&auto=format&fit=crop&q=80"
            alt="Merch Collection"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#150508] via-transparent to-transparent" />
        </div>
      </div>

      <div id="store-grid" className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1 sm:mx-0 sm:px-0 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-white dark:bg-black/40 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-white/10 hover:border-red-500/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search gear, statues, hoodies..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-black/50 border border-zinc-200 dark:border-white/10 rounded-xl text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors shadow-sm dark:shadow-none"
            />
          </div>
        </div>

        {filteredMerch.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
            {filteredMerch.map((item) => (
              <MerchandiseCard
                key={item.id}
                item={item}
                onAddToCart={(addedItem) => setCartModalItem(addedItem)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Merchandise Found"
            description="No merchandise items found matching your filter criteria."
          />
        )}
      </div>

      <Modal
        isOpen={!!cartModalItem}
        onClose={() => setCartModalItem(null)}
        title="Item Added to Cart"
      >
        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-50 dark:bg-[#090d16] border border-zinc-200 dark:border-[#1b263e]">
            <img
              src={cartModalItem?.image}
              alt={cartModalItem?.title || cartModalItem?.name}
              className="w-14 h-14 rounded-xl object-cover"
            />
            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
                {cartModalItem?.title || cartModalItem?.name}
              </h4>
              <p className="text-red-600 dark:text-red-400 font-mono font-bold">
                {typeof cartModalItem?.price === 'number'
                  ? `$${cartModalItem?.price.toFixed(2)}`
                  : cartModalItem?.price}
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                <Check className="w-3 h-3" />
                Reserved for checkout
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-[#1b263e]">
            <button
              type="button"
              onClick={() => setCartModalItem(null)}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-[#22304d] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:text-white"
            >
              Continue Browsing
            </button>
            <a
              href={cartModalItem?.buyUrl || 'https://store.crunchyroll.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-md shadow-red-600/30 transition-all"
            >
              Proceed to Checkout
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}
