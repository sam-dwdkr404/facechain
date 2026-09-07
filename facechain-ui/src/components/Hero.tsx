import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <div className="w-full min-h-[85vh] flex flex-col justify-center items-start px-8 lg:px-16 relative overflow-hidden">
      
      {/* Background Abstract Graphic (Devanagari inspired shape simulation) */}
      <div className="absolute top-1/4 right-[10%] opacity-20 pointer-events-none select-none z-0">
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50 H300 V100 H200 C200 150 250 200 300 200 V250 H150 C100 250 50 200 50 150 V50 Z" fill="#FF1688" />
          <path d="M250 300 H350 V350 H200 C150 350 100 300 100 250 V200 H150 V250 C150 280 180 300 250 300 Z" fill="#FF1688" />
          <circle cx="200" cy="150" r="30" fill="#FF1688" />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col"
        >
          <h1 className="font-serif text-[12vw] leading-[0.85] tracking-tighter text-fc-cream uppercase">
            Face
            <br />
            <span className="text-fc-yellow text-shadow-neon ml-[-0.05em]">Verification</span>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-12 flex flex-col lg:flex-row gap-8 lg:items-end justify-between"
        >
          <div className="max-w-xl">
            <p className="font-mono text-fc-pink text-xs tracking-[0.2em] mb-4">
              BIOMETRIC &rarr; SOCIAL &rarr; BLOCKCHAIN
            </p>
            <p className="font-sans text-lg lg:text-xl text-fc-cream opacity-80 leading-relaxed font-light border-l-2 border-fc-pink pl-6">
              Detect a face. Find its real-world image match. <br className="hidden lg:block"/>
              Commit the verification proof to an immutable ledger.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 mt-8 lg:mt-0">
            <Link 
              to="/verification"
              className="bg-fc-pink text-white px-8 py-5 font-mono font-bold text-sm tracking-widest hover:bg-fc-yellow hover:text-fc-emerald-dark transition-colors uppercase inline-flex items-center justify-center gap-4 group"
            >
              Start Verification
              <span className="group-hover:translate-x-2 transition-transform">&rarr;</span>
            </Link>
            
            <a 
              href="#pipeline-details"
              className="border border-fc-emerald-light text-fc-cream px-8 py-5 font-mono text-sm tracking-widest hover:border-fc-yellow hover:text-fc-yellow transition-colors uppercase inline-flex items-center justify-center text-center"
            >
              View Pipeline
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
