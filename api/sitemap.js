/**
 * Dynamic sitemap for Fan Hub Plus (Vercel Serverless Function).
 *
 * Served at /sitemap.xml via the rewrite in vercel.json.
 * Static pages are listed below; dynamic pages (categories, content,
 * characters, merchandise, events) are pulled from the same public backend
 * endpoints the frontend uses, so new admin-created items show up without a redeploy.
 *
 * Optional environment variables (Vercel -> Project Settings -> Environment Variables):
 *   SITE_URL  Canonical origin, e.g. https://www.example.com (no trailing slash).
 *             If unset, the origin is derived from the request host.
 *   API_URL   Backend base URL. Falls back to VITE_API_URL, then the default below.
 */

const DEFAULT_API_URL = 'https://msgsixxcrewfanhubbackend.vercel.app/api';
const FETCH_TIMEOUT_MS = 8000;
const MAX_URLS = 50000; // sitemap protocol limit per file

// Public, indexable static routes (mirrors the public <Route>s in src/App.jsx).
// `lastmodFrom` lists the collections whose newest item dates the page;
// pages with no data signal fall back to today's date.
const STATIC_PAGES = [
    { path: '/', priority: '1.0', changefreq: 'daily', lastmodFrom: ['content', 'events', 'characters', 'merchandise', 'categories'] },
    { path: '/explore', priority: '0.9', changefreq: 'daily', lastmodFrom: ['content'] },
    { path: '/categories', priority: '0.8', changefreq: 'weekly', lastmodFrom: ['categories'] },
    { path: '/characters', priority: '0.8', changefreq: 'weekly', lastmodFrom: ['characters'] },
    { path: '/events', priority: '0.8', changefreq: 'daily', lastmodFrom: ['events'] },
    { path: '/merchandise', priority: '0.7', changefreq: 'weekly', lastmodFrom: ['merchandise'] },
    { path: '/media', priority: '0.7', changefreq: 'weekly', lastmodFrom: ['content'] },
    { path: '/fan-creations', priority: '0.6', changefreq: 'weekly', lastmodFrom: [] },
    { path: '/about', priority: '0.5', changefreq: 'monthly', lastmodFrom: [] },
];

// Dynamic routes: backend endpoint -> response key -> frontend URL base.
const COLLECTIONS = [
    { name: 'categories', endpoint: '/categories', key: 'categories', base: '/category', priority: '0.8', changefreq: 'weekly' },
    { name: 'content', endpoint: '/content', key: 'content', base: '/content', priority: '0.9', changefreq: 'weekly' },
    { name: 'characters', endpoint: '/characters', key: 'characters', base: '/characters', priority: '0.7', changefreq: 'weekly' },
    { name: 'merchandise', endpoint: '/merchandise', key: 'merchandise', base: '/merchandise', priority: '0.6', changefreq: 'weekly' },
    { name: 'events', endpoint: '/events', key: 'events', base: '/events', priority: '0.7', changefreq: 'daily' },
];

const CLEAN_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function getOrigin(req) {
    const fromEnv = (process.env.SITE_URL || '').trim().replace(/\/+$/, '');
    if (/^https?:\/\//i.test(fromEnv)) return fromEnv;

    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
    return `${proto}://${host}`;
}

function getApiBase() {
    const raw = process.env.API_URL || process.env.VITE_API_URL || DEFAULT_API_URL;
    return raw.replace(/\/+$/, '');
}

// Same tolerant parsing as extractArray() in src/context/DataContext.jsx
function extractArray(res, key) {
    if (!res) return [];
    if (Array.isArray(res[key])) return res[key];
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res)) return res;
    return [];
}

async function fetchCollection(apiBase, collection) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        const response = await fetch(`${apiBase}${collection.endpoint}`, {
            headers: { Accept: 'application/json' },
            signal: controller.signal,
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        return { items: extractArray(json, collection.key), ok: true };
    } catch (err) {
        console.error(`[sitemap] Failed to load ${collection.endpoint}: ${err.message}`);
        return { items: [], ok: false };
    } finally {
        clearTimeout(timer);
    }
}

function toDate(value) {
    if (!value) return undefined;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

function newest(dates) {
    const valid = dates.filter(Boolean).sort();
    return valid.length ? valid[valid.length - 1] : undefined;
}

function escapeXml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function renderUrl({ loc, lastmod, changefreq, priority }) {
    return [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
    ].join('\n');
}

export default async function handler(req, res) {
    const origin = getOrigin(req);
    const apiBase = getApiBase();
    const today = new Date().toISOString().slice(0, 10);

    const results = await Promise.all(COLLECTIONS.map((c) => fetchCollection(apiBase, c)));
    const allLoaded = results.every((r) => r.ok);

    const byName = {};
    COLLECTIONS.forEach((c, i) => {
        byName[c.name] = results[i].items;
    });

    const urls = new Map(); // keyed by loc so duplicates can never appear

    // 1. Static pages
    for (const page of STATIC_PAGES) {
        const dates = page.lastmodFrom.flatMap((name) =>
            (byName[name] || []).map((item) => toDate(item.updatedAt || item.createdAt))
        );
        const loc = `${origin}${page.path}`;
        urls.set(loc, {
            loc,
            lastmod: newest(dates) || today,
            changefreq: page.changefreq,
            priority: page.priority,
        });
    }

    // 2. Dynamic pages (slug-based, matching /category/:slug, /content/:slug, etc.)
    COLLECTIONS.forEach((collection) => {
        for (const item of byName[collection.name]) {
            const slug = typeof item.slug === 'string' ? item.slug.trim() : '';
            if (!slug) continue; // no slug -> no canonical URL; skip rather than expose /_id duplicates

            if (!CLEAN_SLUG.test(slug)) {
                console.warn(`[sitemap] Non-standard slug "${slug}" in ${collection.name}; consider fixing it in the admin panel.`);
            }

            const loc = `${origin}${collection.base}/${encodeURIComponent(slug)}`;
            urls.set(loc, {
                loc,
                lastmod: toDate(item.updatedAt || item.createdAt) || today,
                changefreq: collection.changefreq,
                priority: collection.priority,
            });
        }
    });

    const entries = Array.from(urls.values()).slice(0, MAX_URLS);

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        entries.map(renderUrl).join('\n'),
        '</urlset>',
        '',
    ].join('\n');

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    // Cache at the edge for an hour; if the backend was unreachable, retry sooner.
    res.setHeader(
        'Cache-Control',
        allLoaded
            ? 'public, s-maxage=3600, stale-while-revalidate=86400'
            : 'public, s-maxage=60, stale-while-revalidate=300'
    );
    res.end(xml);
}