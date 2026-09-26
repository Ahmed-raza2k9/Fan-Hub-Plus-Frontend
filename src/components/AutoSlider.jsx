import React, { useRef, useEffect, useState } from 'react';

export default function AutoSlider({
  children,
  autoPlayInterval = 3200,
  itemClassName = 'w-[260px] xs:w-[280px] sm:w-[300px] shrink-0',
  className = ''
}) {
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || isHovered || isInteracting) return;

    const interval = setInterval(() => {
      if (!el) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      // If at or near the end, loop back smoothly to start
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Find approximate single item width + gap
        const firstChild = el.querySelector(':scope > div');
        const scrollAmount = firstChild ? firstChild.clientWidth + 16 : 300;
        el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isHovered, isInteracting, autoPlayInterval]);

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsInteracting(true)}
      onTouchEnd={() => {
        setTimeout(() => setIsInteracting(false), 2000);
      }}
    >
      <div
        ref={scrollRef}
        className="flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {React.Children.map(children, (child, idx) => (
          <div key={idx} className={`snap-start shrink-0 ${itemClassName}`}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
