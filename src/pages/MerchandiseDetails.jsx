import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Check,
  ArrowLeft
} from 'lucide-react';
import { useData } from '../context/DataContext';
import EmptyState from '../components/EmptyState';

export default function MerchandiseDetails() {
  const { slug } = useParams();
  const { merchandise } = useData();

  const item = merchandise.find((m) => m.slug === slug || m._id === slug || m.id === slug);

  if (!item) {
    return (
      <EmptyState
        title="Merchandise Item Not Found"
        description="The requested merchandise item could not be found or has been removed."
        actionText="Browse Merchandise"
        actionLink="/merchandise"
      />
    );
  }

  const galleryImages = item.gallery && item.gallery.length > 0 ? item.gallery : [item.image];
  const [activeImage, setActiveImage] = useState(galleryImages[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedNotification, setAddedNotification] = useState(false);

  const displayTitle = item.title || item.name;
  const displayPrice = typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : item.price;
  const originalPrice = item.originalPrice ? `$${item.originalPrice.toFixed(2)}` : null;

  const categoryName = typeof item?.category === 'object' ? item?.category?.name || 'Merchandise' : item?.category || 'Merchandise';
  const fandomName = typeof item?.fandom === 'object' ? item?.fandom?.name || categoryName : item?.fandom || categoryName;

  const handleAddToCart = () => {
    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 3000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>&gt;</span>
        <Link to="/merchandise" className="hover:text-white">Merchandise</Link>
        <span>&gt;</span>
        <span className="text-zinc-500">{categoryName}</span>
        <span>&gt;</span>
        <span className="text-white truncate">{displayTitle}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible shrink-0">
            {galleryImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(img)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeImage === img
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-[#1a253e] opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          <div className="flex-1 rounded-3xl overflow-hidden border border-[#1a253e] bg-[#0c1222] relative aspect-square shadow-2xl">
            <img
              src={activeImage}
              alt={displayTitle}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {item.discount && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-lg">
                {item.discount}
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
              {fandomName} • {categoryName}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
              {displayTitle}
            </h1>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-xs font-bold text-white ml-1.5">
                  {item.rating || 4.8} ({item.reviewCount || 124} reviews)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-white font-mono">{displayPrice}</span>
            {originalPrice && (
              <span className="text-lg text-zinc-500 line-through font-mono">
                {originalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>In Stock — Ready to dispatch</span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#1b263e] rounded-xl bg-[#0c1222] p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#151f38]"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-mono font-bold text-white">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#151f38]"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                className="p-3 rounded-xl border border-[#1b263e] hover:bg-[#151f38] text-zinc-400 hover:text-rose-500 transition-colors"
                title="Wishlist"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {addedNotification && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{quantity}x {displayTitle} added to your bag!</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-[#0c1222] border border-[#1a253e] text-center text-[11px] text-zinc-400">
            <div className="flex flex-col items-center gap-1">
              <Truck className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-white">Free Shipping</span>
              <span className="text-[10px] text-zinc-500">Orders over $50</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white">Secure Payment</span>
              <span className="text-[10px] text-zinc-500">100% encrypted</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RotateCcw className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-white">Easy Returns</span>
              <span className="text-[10px] text-zinc-500">7 days policy</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex border-b border-[#1a253e] gap-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('description')}
                className={`pb-2 transition-all ${
                  activeTab === 'description'
                    ? 'text-blue-400 border-b-2 border-blue-500'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Description
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specifications')}
                className={`pb-2 transition-all ${
                  activeTab === 'specifications'
                    ? 'text-blue-400 border-b-2 border-blue-500'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Specifications
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`pb-2 transition-all ${
                  activeTab === 'reviews'
                    ? 'text-blue-400 border-b-2 border-blue-500'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Reviews
              </button>
            </div>

            <div className="text-xs text-zinc-300 leading-relaxed">
              {activeTab === 'description' && (
                <p>{item.description}</p>
              )}

              {activeTab === 'specifications' && (
                <ul className="space-y-1.5 list-disc list-inside text-zinc-400">
                  {item.specifications ? (
                    item.specifications.map((spec, idx) => (
                      <li key={idx}><span className="text-zinc-200">{spec}</span></li>
                    ))
                  ) : (
                    <>
                      <li>High quality collector PVC material</li>
                      <li>Standard 1/8 scale anime replica</li>
                      <li>Includes base stand and collector box</li>
                    </>
                  )}
                </ul>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-[#090d16] border border-[#1b263e]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">Kenji M.</span>
                      <span className="text-amber-400 text-[10px]">★★★★★</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      The sculpting on the hair and smoke effects is insane in person. Arrived in mint box condition!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
