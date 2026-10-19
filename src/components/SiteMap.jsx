import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap = () => {
    const sitemapData = [
        {
            title: 'Main Pages',
            links: [
                { name: 'Home', path: '/' },
                { name: 'Explore', path: '/explore' },
                { name: 'Categories', path: '/categories' },
                { name: 'Characters Hub', path: '/characters' },
                { name: 'Events', path: '/events' },
                { name: 'Merchandise Store', path: '/merchandise' },
                { name: 'Media Center', path: '/media' },
                { name: 'Fan Creations', path: '/fan-creations' },
                { name: 'About Us', path: '/about' },
            ],
        },
        {
            title: 'Categories',
            links: [
                { name: 'K-Pop', path: '/category/k-pop' },
                { name: 'Comics', path: '/category/comics' },
                { name: 'Movies', path: '/category/movies' },
                { name: 'Gaming', path: '/category/gaming' },
                { name: 'Anime', path: '/category/anime' },
                { name: 'Manga', path: '/category/manga' },
                { name: 'TV Shows', path: '/category/tv-shows' },
                { name: 'Cosplay', path: '/category/cosplay' },
            ],
        },
        {
            title: 'Featured Content',
            links: [
                { name: 'Game of Thrones', path: '/content/game-of-thrones' },
                { name: 'Death Note', path: '/content/death-note' },
                { name: 'Stranger Things S1 Ep1', path: '/content/stranget-things-s1-ep1' },
                { name: 'Peaky Blinders S1: Thomas Shelby', path: '/content/peaky-blinders-s1-the-goat-thomas-shelby' },
                { name: 'Welcome To My Crib Sound', path: '/content/welcome-to-my-crib-sound' },
                { name: 'The Godfather', path: '/content/the-god-father' },
                { name: 'Comic Book', path: '/content/comic-book' },
                { name: 'K-Pop Artists: Demon Hunter', path: '/content/k-pop-artists-demon-hunter' },
            ],
        },
        {
            title: 'Characters',
            links: [
                { name: 'Naruto Uzumaki', path: '/characters/naruto-uzumaki' },
                { name: 'Kratos', path: '/characters/kratos' },
                { name: 'Arthur Shelby', path: '/characters/arthur-shelby' },
                { name: 'Luffy', path: '/characters/luffy' },
                { name: 'Peaky Blinders', path: '/characters/peaky%20blinders' },
                { name: 'Don Vito Corleone', path: '/characters/don-vito-corleone' },
                { name: 'Baki', path: '/characters/baki' },
                { name: 'Spider-Man', path: '/characters/spider-man' },
                { name: 'Eleven (Millie Bobby Brown)', path: '/characters/eleven-milly-bobby-brown' },
                { name: 'Patrick Jane', path: '/characters/patrick-jane' },
            ],
        },
        {
            title: 'Events',
            links: [
                { name: 'Peaky Blinders Karachi 2026', path: '/events/peaky-blinders-karachi-2026' },
                { name: 'Stranger Things Event', path: '/events/stranger-things-event-' },
                { name: 'Lahore Gaming League Championship', path: '/events/lahore-gaming-league-championship' },
                { name: 'Spider-Man Cosplay Event', path: '/events/spiderman-cosplay-event' },
                { name: 'AnimeCon Karachi 2024', path: '/events/animecon-karachi-2024' },
                { name: 'Patrick Jane Arriving in Karachi', path: '/events/patrick-jane-arriving-in-karachi' },
                { name: 'Cosplay of Jon Snow', path: '/events/cosplay-of-john-snow' },
            ],
        },
        {
            title: 'Merchandise',
            links: [
                { name: 'Thomas Shelby Cap', path: '/merchandise/thomas-shelby-cap' },
                { name: 'Naruto T-Shirt', path: '/merchandise/naruto-t-shirt' },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-12 text-center border-b border-gray-800 pb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                        Fan Hub Plus Sitemap
                    </h1>
                    <p className="mt-3 text-lg text-gray-400">
                        Explore all categories, content, characters, events, and merchandise across our platform.
                    </p>
                </div>

                {/* Sitemap Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sitemapData.map((section, idx) => (
                        <div
                            key={idx}
                            className="bg-gray-900/80 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors shadow-lg"
                        >
                            <h2 className="text-xl font-bold text-indigo-400 border-b border-gray-800 pb-3 mb-4 flex items-center justify-between">
                                <span>{section.title}</span>
                                <span className="text-xs bg-indigo-950 text-indigo-300 font-medium px-2.5 py-1 rounded-full border border-indigo-800/50">
                                    {section.links.length}
                                </span>
                            </h2>
                            <ul className="space-y-2.5">
                                {section.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <Link
                                            to={link.path}
                                            className="text-gray-300 hover:text-indigo-300 hover:translate-x-1 transition-all duration-150 inline-block text-sm font-medium"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sitemap;