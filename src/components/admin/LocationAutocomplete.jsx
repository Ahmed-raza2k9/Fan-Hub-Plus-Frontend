import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';
import { adminApi } from '../../services/api';

export default function LocationAutocomplete({ initialValue, onSelect, placeholder = "Search venue or address...", required = false }) {
  const [query, setQuery] = useState(initialValue || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');
  
  const wrapperRef = useRef(null);

  // Update query if initialValue changes (like when opening edit modal)
  useEffect(() => {
    setQuery(initialValue || '');
  }, [initialValue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await adminApi.searchLocation(query);
        
        if (data.success && data.features) {
          setSuggestions(data.features);
          setShowDropdown(true);
        } else {
          setError('Failed to fetch locations');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (feature) => {
    const props = feature.properties;
    const venueName = props.name || props.address_line1 || '';
    const addressLine = props.formatted || '';
    const city = props.city || props.county || props.state || '';
    const lat = props.lat;
    const lon = props.lon;

    setQuery(addressLine || venueName);
    setShowDropdown(false);

    onSelect({
      venue: venueName,
      address: addressLine,
      city: city,
      latitude: lat,
      longitude: lon
    });
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    // If they change text after selecting, clear the coordinates until they select again
    onSelect({ venue: e.target.value, address: '', city: '', latitude: null, longitude: null });
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
          placeholder={placeholder}
          required={required}
          className="w-full pl-9 pr-9 py-2 bg-transparent border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-all"
        />
        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <Loader2 className="w-3.5 h-3.5 text-red-500 animate-spin" />
          </div>
        )}
      </div>

      {error && <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {error}</p>}

      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-[#120509] border border-red-500/30 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map((feature, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(feature)}
              className="px-4 py-2 hover:bg-red-500/20 cursor-pointer border-b border-white/5 last:border-0 flex flex-col"
            >
              <span className="text-xs font-bold text-white">{feature.properties.address_line1 || feature.properties.name}</span>
              <span className="text-[10px] text-zinc-400">{feature.properties.address_line2 || feature.properties.formatted}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
