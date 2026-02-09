import React from 'react';

const HomeHero = () => (
  <header className="relative mb-20 pt-10 transition-colors duration-300">
    {/* Updated Glow: Changed blue-100 to blue-600/20 for a subtle neon effect */}
    <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>
    
    <h1 className="relative text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9] text-[var(--text-color)]">
      Find Your <br />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
        Inner Circle.
      </span>
    </h1>
    
    {/* Updated Text: Changed slate-500 to var(--text-color) with opacity for better readability */}
    <p className="mt-6 text-[var(--text-color)] opacity-60 max-w-lg font-medium text-lg md:text-xl leading-relaxed">
      Connect with creators, hackers, and leaders. Join the most active communities on campus.
    </p>
  </header>
);

export default HomeHero;