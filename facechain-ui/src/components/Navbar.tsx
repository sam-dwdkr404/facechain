import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="w-full flex justify-between items-center py-6 px-8 lg:px-16 border-b border-fc-emerald-light">
      <Link to="/" className="flex flex-col items-start hover:opacity-80 transition-opacity">
        <span className="font-serif text-3xl font-black text-fc-pink leading-none tracking-tighter">FC</span>
        <span className="font-mono text-xs text-fc-yellow uppercase tracking-widest mt-1">Facechain</span>
      </Link>

      <div className="flex gap-8 items-center font-mono text-sm tracking-wider">
        <Link 
          to="/verification" 
          className={`hover:text-fc-pink transition-colors ${location.pathname === '/verification' ? 'text-fc-pink border-b border-fc-pink pb-1' : 'text-fc-cream'}`}
        >
          PIPELINE
        </Link>
        <span className="text-fc-emerald-light">/</span>
        <a href="#" className="text-fc-cream hover:text-fc-pink transition-colors line-through opacity-50" title="Coming soon">
          RECORDS
        </a>
        <span className="text-fc-emerald-light">/</span>
        <a href="#" className="text-fc-cream hover:text-fc-pink transition-colors line-through opacity-50" title="Coming soon">
          VERIFY
        </a>
      </div>

      <div className="hidden md:block">
        <Link 
          to="/verification"
          className="bg-fc-yellow text-fc-emerald-dark px-6 py-3 font-mono font-bold text-sm tracking-widest hover:bg-white transition-colors uppercase"
        >
          Run Verification
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
