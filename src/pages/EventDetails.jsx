import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Clock,
  Ticket,
  Share2,
  CalendarPlus,
  Check,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';

export default function EventDetails() {
  const { slug } = useParams();
  const { events } = useData();

  const event = events.find((e) => e.slug === slug || e._id === slug || e.id === slug);

  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [calendarAdded, setCalendarAdded] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [ticketConfirmed, setTicketConfirmed] = useState(false);

  if (!event) {
    return (
      <EmptyState
        title="Event Not Found"
        description="The event you requested could not be found or has been removed."
        actionText="Browse All Events"
        actionLink="/events"
      />
    );
  }

  const handleAddToCalendar = () => {
    setCalendarAdded(true);
    setTimeout(() => setCalendarAdded(false), 3000);
  };

  const handleConfirmTicket = (e) => {
    e.preventDefault();
    setTicketConfirmed(true);
    setTimeout(() => {
      setTicketConfirmed(false);
      setTicketModalOpen(false);
    }, 2000);
  };

  const defaultHighlights = [
    'Cosplay Competition with international judges',
    'Gaming Zone featuring tournament setups',
    'Guest Appearances & Voice Actor Q&As',
    'Panel Discussions and World Premieres',
    'Merchandise Stalls & Artist Alley'
  ];

  const highlights = event.highlights || defaultHighlights;

  const gallery = event.gallery && event.gallery.length > 0 ? event.gallery : [event.image].filter(Boolean);

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>&gt;</span>
        <Link to="/events" className="hover:text-red-400">Events</Link>
        <span>&gt;</span>
        <span className="text-white truncate">{event.title}</span>
      </div>

      <div className="relative rounded-3xl overflow-hidden border border-red-950/60 bg-gradient-to-b from-[#14080c] via-[#090b10] to-[#050608] shadow-[0_0_50px_rgba(220,38,38,0.18)]">
        <div className="relative h-64 sm:h-96 w-full">
          <img
            src={event.image}
            alt={event.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/60 to-transparent" />
        </div>

        <div className="p-6 sm:p-10 -mt-24 relative z-10 space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/40 border border-red-400/30">
              Featured Event
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-200">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-red-500" />
                <span className="font-mono font-bold text-white">
                  {event.startDate ? new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  {event.endDate && event.endDate !== event.startDate ? ` — ${new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>{[event.venue, event.city].filter(Boolean).join(', ')}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {event.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-xl bg-white text-zinc-950 text-xs font-bold shadow-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setTicketModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-red-600/30 flex items-center gap-2 transition-all hover:scale-105 border border-red-400/40"
            >
              <Ticket className="w-4 h-4" />
              <span>Get Tickets & Passes</span>
            </button>

            <button
              type="button"
              onClick={handleAddToCalendar}
              className="px-6 py-3 rounded-2xl border border-white/20 hover:border-red-500 hover:bg-white/[0.04] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all"
            >
              <CalendarPlus className="w-4 h-4 text-red-400" />
              <span>{calendarAdded ? 'Added to Calendar!' : 'Add to Calendar'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-[#13080c] dark:via-[#090b10] dark:to-[#06070a] shadow-[0_4px_20px_rgba(225,29,72,0.05)] dark:shadow-none space-y-4">
            <h2 className="text-xl font-black text-zinc-900 dark:text-white font-display">About This Event</h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-normal">
              {event.description}
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-[#13080c] dark:via-[#090b10] dark:to-[#06070a] shadow-[0_4px_20px_rgba(225,29,72,0.05)] dark:shadow-none space-y-4">
            <h2 className="text-xl font-black text-zinc-900 dark:text-white font-display">Event Highlights</h2>
            <div className="space-y-2.5">
              {highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-200">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">

          {/* Map Panel — shown only when coordinates exist */}
          {event.latitude && event.longitude && (
            <div className="rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-[#13080c] dark:via-[#090b10] dark:to-[#06070a] shadow-[0_4px_20px_rgba(225,29,72,0.05)] dark:shadow-none overflow-hidden">
              <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <h2 className="text-lg font-black text-zinc-900 dark:text-white font-display flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Venue Location
                </h2>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${event.latitude}&mlon=${event.longitude}#map=15/${event.latitude}/${event.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-red-400 hover:text-red-300 font-bold transition-colors"
                >
                  Open in Maps ↗
                </a>
              </div>
              <div className="relative w-full" style={{ height: '240px' }}>
                <iframe
                  title="Event Venue Map"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${event.longitude - 0.01},${event.latitude - 0.01},${event.longitude + 0.01},${event.latitude + 0.01}&layer=mapnik&marker=${event.latitude},${event.longitude}`}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
              <div className="px-5 py-3 border-t border-zinc-100 dark:border-white/[0.06]">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">{event.venue}</span>
                  {event.address && <span> · {event.address}</span>}
                  {event.city && <span> · {event.city}</span>}
                </p>
              </div>
            </div>
          )}

          {/* Event Atmosphere Gallery */}
          <div className="p-5 sm:p-6 rounded-3xl border border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-gradient-to-b dark:from-[#13080c] dark:via-[#090b10] dark:to-[#06070a] shadow-[0_4px_20px_rgba(225,29,72,0.05)] dark:shadow-none space-y-4">
            <h2 className="text-xl font-black text-zinc-900 dark:text-white font-display">Event Atmosphere</h2>
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((img, i) => (
                <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200 dark:border-white/10 ring-1 ring-black/5 dark:ring-white/5">
                  <img src={img} alt="Convention scene" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        title="Reserve Event Passes"
      >
        <form onSubmit={handleConfirmTicket} className="space-y-4 text-xs">
          <p className="text-zinc-600 dark:text-zinc-300">
            Booking passes for <strong className="text-zinc-900 dark:text-white">{event.title}</strong> in {event.city}.
          </p>

          <div>
            <label className="block text-zinc-700 dark:text-zinc-300 mb-1 font-bold">Pass Tier</label>
            <select className="w-full px-3 py-2 bg-zinc-50 dark:bg-black/80 border border-zinc-200 dark:border-white/20 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:border-red-500">
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Weekend VIP Pass (All 3 Days + Fast Track) - Rs. 4,500</option>
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Single Day Saturday Pass - Rs. 2,000</option>
              <option className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Single Day Sunday Pass - Rs. 1,500</option>
            </select>
          </div>

          <div>
            <label className="block text-zinc-700 dark:text-zinc-300 mb-1 font-bold">Number of Passes</label>
            <input
              type="number"
              min="1"
              max="10"
              value={ticketCount}
              onChange={(e) => setTicketCount(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-black/80 border border-zinc-200 dark:border-white/20 rounded-xl text-zinc-900 dark:text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {ticketConfirmed ? (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-500 text-red-600 dark:text-white font-bold text-center flex items-center justify-center gap-2 shadow-lg">
              <Check className="w-4 h-4 text-red-500 dark:text-red-400" />
              <span>Passes Reserved Successfully!</span>
            </div>
          ) : (
            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-white/10">
              <button
                type="button"
                onClick={() => setTicketModalOpen(false)}
                className="px-3 py-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black shadow-lg shadow-red-600/40 transition-all"
              >
                Confirm Reservation
              </button>
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
}
