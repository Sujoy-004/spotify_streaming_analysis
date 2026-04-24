import React from 'react';

const Topbar = () => {
  return (
    <>
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm tracking-tight text-white">Spotify 2024 Discovery</span>
        <span className="px-1.5 py-0.5 rounded bg-arctic-accent text-[11px] text-arctic-900 font-bold uppercase tracking-wider">Elite</span>
      </div>
      <nav className="flex items-center gap-8 text-[11px] font-medium text-arctic-400">
        <a href="#discovery" className="hover:text-white transition-colors">Discovery</a>
        <a href="#oracle" className="hover:text-white transition-colors">Oracle</a>
        <a href="#ledger" className="hover:text-white transition-colors">Ledger</a>
      </nav>
    </>
  );
};

export default Topbar;
