import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Inbox, Loader2, RefreshCw, Search, Trash2, Pencil, Upload, X } from 'lucide-react';
import Modal from '../Modal';

export function AdminPageHeader({ kicker, title, description, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div className="min-w-0">
        {kicker && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ff2e63] mb-1.5">
            {kicker}
          </p>
        )}
        <h1 className="text-[1.55rem] sm:text-[1.85rem] font-semibold tracking-tight text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-sm text-stone-400 max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div> : null}
    </div>
  );
}

export function AdminStatCard({ title, value, hint, icon: Icon, to, accent, dense }) {
  const inner = (
    <div
      className={`admin-card h-full transition-colors ${dense ? 'p-4' : 'p-5'} ${
        to ? 'admin-card-hover' : ''
      } ${accent ? 'border-[#ff2e63]/45' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">{title}</p>
        {Icon ? (
          <span
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              accent ? 'bg-[#ff2e63] text-white' : 'bg-[#ff2e63]/10 text-[#ff2e63]'
            }`}
          >
            <Icon className="w-4 h-4" />
          </span>
        ) : null}
      </div>
      <p className={`mt-3 font-semibold tabular-nums text-white tracking-tight ${dense ? 'text-xl' : 'text-2xl sm:text-[1.75rem]'}`}>
        {value}
      </p>
      {hint ? <p className="mt-1.5 text-xs text-stone-500">{hint}</p> : null}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="block h-full">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function AdminBarList({ items, emptyLabel = 'No data yet' }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-stone-500 py-8 text-center">{emptyLabel}</p>;
  }

  const max = Math.max(...items.map((i) => Number(i.value) || 0), 1);

  return (
    <div className="space-y-3.5">
      {items.map((item) => {
        const pct = Math.round(((Number(item.value) || 0) / max) * 100);
        return (
          <div key={item.id || item.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="text-stone-200 font-medium truncate">{item.label}</span>
              <span className="tabular-nums text-stone-400 shrink-0">{item.display ?? item.value}</span>
            </div>
            <div className="h-1.5 rounded-full bg-black/50 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#ff2e63]"
                style={{ width: `${Math.max(pct, item.value > 0 ? 3 : 0)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AdminAreaChart({ items, emptyLabel = 'No data yet' }) {
  const fillId = React.useId().replace(/:/g, '');
  if (!items || items.length === 0) {
    return <p className="text-sm text-stone-500 py-10 text-center">{emptyLabel}</p>;
  }

  const w = 640;
  const h = 196;
  const padX = 16;
  const padY = 28;
  const max = Math.max(...items.map((i) => Number(i.value) || 0), 1);
  const pts = items.map((item, i) => {
    const x = padX + (i * (w - padX * 2)) / Math.max(items.length - 1, 1);
    const y = h - padY - ((Number(item.value) || 0) / max) * (h - padY * 1.6);
    return { x, y, label: item.label, value: item.value };
  });
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${line} L${pts[pts.length - 1].x},${h - 8} L${pts[0].x},${h - 8} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full min-w-[420px] h-[196px]" role="img" aria-label="Trend chart">
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={padX}
            x2={w - padX}
            y1={padY + (h - padY * 1.6) * (1 - t)}
            y2={padY + (h - padY * 1.6) * (1 - t)}
            stroke="rgba(255,255,255,0.06)"
          />
        ))}
        <path d={area} fill={`url(#${fillId})`} />
        <path d={line} fill="none" stroke="#ff2e63" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p) => (
          <circle key={p.label} cx={p.x} cy={p.y} r="3.2" fill="#0a0204" stroke="#ff2e63" strokeWidth="1.6" />
        ))}
        {pts.map((p) => (
          <text key={`${p.label}-l`} x={p.x} y={h - 6} textAnchor="middle" fill="#78716c" fontSize="10">
            {p.label}
          </text>
        ))}
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff2e63" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ff2e63" stopOpacity="0.02" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function AdminDonut({ items, emptyLabel = 'No data yet', centerLabel, centerValue }) {
  const list = (items || []).filter((i) => Number(i.value) > 0);
  const total = list.reduce((s, i) => s + (Number(i.value) || 0), 0);
  if (!total) {
    return <p className="text-sm text-stone-500 py-10 text-center">{emptyLabel}</p>;
  }

  const r = 52;
  const c = 2 * Math.PI * r;
  const palette = ['#ff2e63', '#d6004c', '#9f1239', '#a8a29e', '#57534e'];
  let offset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
          <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
          {list.map((item, i) => {
            const len = (Number(item.value) / total) * c;
            const el = (
              <circle
                key={item.id || item.label}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={palette[i % palette.length]}
                strokeWidth="14"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-lg font-semibold tabular-nums text-white">{centerValue ?? total}</span>
          {centerLabel ? <span className="text-[10px] text-stone-500 uppercase tracking-wider">{centerLabel}</span> : null}
        </div>
      </div>
      <ul className="space-y-2 w-full min-w-0">
        {list.map((item, i) => (
          <li key={item.id || item.label} className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: palette[i % palette.length] }} />
              <span className="text-stone-300 truncate">{item.label}</span>
            </span>
            <span className="tabular-nums text-stone-400">{item.display ?? item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AdminStatus({ value }) {
  const v = String(value || '').toLowerCase();
  const styles = {
    pending: 'bg-white/5 text-stone-300 border-white/10',
    reviewed: 'bg-[#ff2e63]/10 text-[#ffb0c4] border-[#ff2e63]/25',
    resolved: 'bg-[#ff2e63]/15 text-[#ff2e63] border-[#ff2e63]/30',
    approved: 'bg-[#ff2e63]/15 text-[#ff2e63] border-[#ff2e63]/30',
    rejected: 'bg-white/5 text-stone-500 border-white/10',
    featured: 'bg-[#ff2e63] text-white border-[#ff2e63]',
    standard: 'bg-white/5 text-stone-400 border-white/10',
    available: 'bg-white/5 text-stone-300 border-white/10',
    upcoming: 'bg-[#ff2e63]/10 text-[#ffb0c4] border-[#ff2e63]/25',
    admin: 'bg-[#ff2e63]/15 text-[#ff2e63] border-[#ff2e63]/30',
    user: 'bg-white/5 text-stone-400 border-white/10'
  };
  const cls = styles[v] || 'bg-white/5 text-stone-400 border-white/10';
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide border ${cls}`}>
      {value || '—'}
    </span>
  );
}

export function AdminLoading({ label = 'Loading…' }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="admin-card p-5 space-y-3">
            <div className="admin-skel h-3 w-20" />
            <div className="admin-skel h-8 w-16" />
            <div className="admin-skel h-3 w-28" />
          </div>
        ))}
      </div>
      <div className="admin-card px-6 py-14 text-center">
        <Loader2 className="w-7 h-7 text-[#ff2e63] animate-spin mx-auto" />
        <p className="mt-3 text-sm text-stone-400">{label}</p>
      </div>
    </div>
  );
}

export function AdminError({ message, onRetry }) {
  return (
    <div className="admin-card px-6 py-12 text-center border-[#ff2e63]/25">
      <AlertCircle className="w-8 h-8 text-[#ff2e63] mx-auto" />
      <p className="mt-3 text-sm font-medium text-white">Could not load this view</p>
      <p className="mt-1 text-xs text-stone-400 max-w-md mx-auto">{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry} className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold admin-btn-primary">
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      ) : null}
    </div>
  );
}

export function AdminEmpty({ title, description, action }) {
  return (
    <div className="admin-card px-6 py-14 text-center">
      <Inbox className="w-8 h-8 text-stone-600 mx-auto" />
      <p className="mt-3 text-sm font-medium text-white">{title}</p>
      {description ? <p className="mt-1 text-xs text-stone-500">{description}</p> : null}
      {action}
    </div>
  );
}

export function AdminAlert({ children }) {
  if (!children) return null;
  return (
    <div className="p-3 rounded-xl bg-[#ff2e63]/10 border border-[#ff2e63]/30 text-[#ffb0c4] text-xs flex items-center gap-2">
      <AlertCircle className="w-4 h-4 text-[#ff2e63] shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function AdminToast({ children }) {
  if (!children) return null;
  return (
    <div className="p-3 rounded-xl bg-[#ff2e63]/10 border border-[#ff2e63]/25 text-stone-200 text-xs font-medium">
      {children}
    </div>
  );
}

export function AdminToolbar({ children }) {
  return <div className="admin-card p-3 sm:p-4 flex flex-col sm:flex-row gap-3">{children}</div>;
}

export function AdminSearch({ value, onChange, placeholder }) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 text-xs"
      />
    </div>
  );
}

export function AdminTableWrap({ children }) {
  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export function AdminIconBtn({ title, onClick, danger, children, disabled }) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
        danger
          ? 'text-stone-500 hover:text-[#ff2e63] hover:bg-[#ff2e63]/10'
          : 'text-stone-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {children}
    </button>
  );
}

export function AdminEditBtn(props) {
  return (
    <AdminIconBtn title="Edit" {...props}>
      <Pencil className="w-4 h-4" />
    </AdminIconBtn>
  );
}

export function AdminDeleteBtn({ loading, ...props }) {
  return (
    <AdminIconBtn title="Delete" danger {...props}>
      {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#ff2e63]" /> : <Trash2 className="w-4 h-4" />}
    </AdminIconBtn>
  );
}

export function AdminField({ label, children, hint }) {
  return (
    <div>
      {label ? <label className="block text-xs font-semibold text-stone-300 mb-1.5">{label}</label> : null}
      {children}
      {hint ? <p className="mt-1 text-[11px] text-stone-500">{hint}</p> : null}
    </div>
  );
}

export function AdminFilePick({ fileLabel, accept, multiple, onChange }) {
  return (
    <label className="admin-file">
      <Upload className="w-4 h-4 text-[#ff2e63] shrink-0" />
      <span className="truncate">{fileLabel}</span>
      <input type="file" accept={accept} multiple={multiple} onChange={onChange} className="hidden" />
    </label>
  );
}

export function AdminFormActions({ onCancel, submitting, submitLabel }) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button type="button" onClick={onCancel} className="px-3.5 py-2 text-xs font-medium admin-btn-ghost">
        Cancel
      </button>
      <button type="submit" disabled={submitting} className="px-4 py-2 text-xs font-semibold admin-btn-primary inline-flex items-center gap-1.5">
        {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        <span>{submitLabel}</span>
      </button>
    </div>
  );
}

export function AdminConfirm({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel, loading }) {
  return (
    <Modal isOpen={open} onClose={onCancel} title={title}>
      <p className="text-sm text-stone-400 leading-relaxed">{message}</p>
      <div className="flex justify-end gap-2 mt-5">
        <button type="button" onClick={onCancel} className="px-3.5 py-2 text-xs font-medium admin-btn-ghost">
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-2 text-xs font-semibold admin-btn-primary inline-flex items-center gap-1.5"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export function AdminSection({ title, action, children }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function AdminClose({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="p-1 rounded-lg text-stone-500 hover:text-white" aria-label="Close">
      <X className="w-4 h-4" />
    </button>
  );
}
