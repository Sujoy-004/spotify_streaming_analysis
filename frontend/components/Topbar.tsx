import React from 'react';
import { Github, ExternalLink } from 'lucide-react';

/**
 * Global navigation and branding header for the Spotify Elite Dashboard.
 */
const Topbar = () => {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-arctic-accent to-teal-600 flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.3)]">
          <span className="text-arctic-900 font-black text-xs">S24</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-white leading-none">Spotify Discovery</span>
          <span className="text-[10px] text-arctic-500 font-bold uppercase tracking-widest mt-0.5">Elite Intelligence</span>
        </div>
      </div>

      <nav className="flex items-center gap-10">
        <ul className="flex items-center gap-8 text-[11px] font-bold text-arctic-400 uppercase tracking-widest">
          <li><a href="#metrics" className="hover:text-arctic-accent transition-colors">Metrics</a></li>
          <li><a href="#discovery" className="hover:text-arctic-accent transition-colors">Manifold</a></li>
          <li><a href="#ledger" className="hover:text-arctic-accent transition-colors">Ledger</a></li>
        </ul>
        
        <div className="h-4 w-[1px] bg-arctic-700 mx-2" />
        
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/Sujoy-004/spotify_streaming_analysis" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-arctic-400 hover:text-white transition-colors"
            title="View Source on GitHub"
          >
            <Github size={16} />
          </a>
        </div>
      </nav>
    </>
  );
};

export default Topbar;
