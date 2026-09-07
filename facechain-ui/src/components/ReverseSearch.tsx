import React from 'react';
import { motion } from 'framer-motion';

interface ReverseSearchProps {
  stage: string;
}

const ReverseSearch: React.FC<ReverseSearchProps> = ({ stage }) => {
  if (stage === 'upload' || stage === 'detect' || stage === 'encode') {
    return null;
  }

  const isSearching = stage === 'search';
  const isDemo = import.meta.env.VITE_API_MODE === 'demo';

  return (
    <section className="w-full mt-12 border-t border-fc-emerald-light pt-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
        <div>
          <h2 className="font-serif text-4xl md:text-5xl text-fc-cream uppercase tracking-tight">
            Reverse<br/>
            <span className="text-fc-emerald-light">Search</span>
          </h2>
        </div>
        <div className="mt-4 md:mt-0">
          <span className={`font-mono text-sm px-4 py-2 border ${isSearching ? 'bg-fc-pink text-white animate-pulse border-fc-pink' : 'bg-fc-emerald-dark text-fc-yellow border-fc-yellow'}`}>
            {isSearching ? 'SEARCHING NETWORKS...' : 'SEARCH COMPLETE'}
          </span>
        </div>
      </div>
      
      {isSearching ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-fc-pink/50 bg-fc-emerald-dark/30">
          <div className="w-full h-1 bg-fc-emerald-dark overflow-hidden mb-8 relative max-w-2xl">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-fc-pink"
              initial={{ width: "0%", left: "0%" }}
              animate={{ width: ["20%", "40%", "10%"], left: ["0%", "100%", "0%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
          <p className="font-mono text-sm text-fc-pink tracking-[0.2em] uppercase">Querying Intelligence Networks...</p>
          <p className="font-mono text-xs text-fc-emerald-light mt-4 tracking-widest">{isDemo ? 'ENGINE: DEMO PROVIDER' : 'ENGINE: REAL PROVIDER'}</p>
        </div>
      ) : (
        <div className="relative w-full border border-fc-emerald-light bg-fc-emerald-dark/20 p-8">
          
          {isDemo && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-fc-yellow text-fc-emerald-dark font-mono text-[10px] font-bold px-4 py-1 border border-fc-emerald-dark z-20">
              DEMO / MOCK SEARCH RESULTS
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => {
              const isMatch = i === 1;
              return (
                <div key={i} className={`flex flex-col border ${isMatch ? 'border-fc-yellow shadow-[0_0_15px_rgba(255,229,0,0.2)]' : 'border-fc-emerald-light opacity-50'} bg-fc-emerald-dark`}>
                  <div className="flex justify-between items-center p-2 border-b border-fc-emerald-light/50 bg-fc-emerald-dark/80">
                    <span className="font-mono text-[10px] text-fc-emerald-light tracking-widest uppercase">Candidate 0{i}</span>
                    {isMatch && <span className="font-mono text-[10px] text-fc-emerald-dark bg-fc-yellow px-2 py-0.5 font-bold">MATCH</span>}
                  </div>
                  <div className="aspect-square relative overflow-hidden bg-fc-emerald">
                    {/* Mock image placeholder pattern */}
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fc-cream to-transparent" />
                    
                    {isMatch && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-serif text-4xl text-fc-yellow opacity-20">94.2%</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col gap-1">
                    <span className="font-mono text-xs text-fc-cream">{isMatch ? 'Instagram' : 'Database ' + i}</span>
                    {isMatch && <span className="font-mono text-[9px] text-fc-yellow">SIMILARITY: 94.2%</span>}
                    {!isMatch && <span className="font-mono text-[9px] text-fc-emerald-light">SIMILARITY: {60 - (i*5)}%</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default ReverseSearch;
