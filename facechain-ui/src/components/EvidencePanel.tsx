import React from 'react';
import { VerificationResult } from '../types/verification';
import { motion } from 'framer-motion';

interface EvidencePanelProps {
  result: VerificationResult | null;
  stage: string;
}

const EvidencePanel: React.FC<EvidencePanelProps> = ({ result, stage }) => {
  if (!result || (stage !== 'match' && stage !== 'blockchain')) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="mb-12">
        <h2 className="font-serif text-5xl md:text-[5rem] text-fc-yellow uppercase leading-none tracking-tighter">
          Match<br/>
          <span className="text-fc-cream">Confirmed</span>
        </h2>
      </div>

      <div className="flex flex-col xl:flex-row items-center justify-center gap-12 xl:gap-8 bg-fc-emerald-dark p-8 md:p-16 border border-fc-emerald-light">
        
        {/* Input */}
        <div className="flex-1 w-full max-w-sm flex flex-col items-center">
          <span className="font-mono text-sm text-fc-emerald-light mb-4 tracking-widest uppercase self-start">Input Image</span>
          <div className="w-full aspect-square bg-fc-emerald border border-fc-emerald-light overflow-hidden p-2">
            <img src={result.match.image_url} alt="Input" className="w-full h-full object-cover grayscale opacity-80" />
          </div>
        </div>

        {/* Visual Bridge */}
        <div className="flex xl:flex-col items-center justify-center gap-4 xl:gap-0 shrink-0 w-full xl:w-48 py-8 xl:py-0">
          <div className="hidden xl:block h-[1px] w-full bg-fc-pink absolute left-1/2 -translate-x-1/2 -z-10" />
          <div className="block xl:hidden w-[1px] h-32 bg-fc-pink absolute top-1/2 -translate-y-1/2 -z-10" />
          
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="bg-fc-emerald-dark p-4 border-2 border-fc-pink flex flex-col items-center justify-center w-32 h-32 z-10"
          >
            <span className="font-mono text-[9px] text-fc-pink uppercase tracking-[0.2em] text-center mb-1">Face<br/>Similarity</span>
            <span className="font-mono text-3xl text-fc-cream font-bold">
              {(result.match.similarity * 100).toFixed(1)}%
            </span>
          </motion.div>
          <div className="hidden xl:block text-fc-pink text-4xl font-light mt-4">→</div>
          <div className="block xl:hidden text-fc-pink text-4xl font-light ml-4 transform rotate-90">→</div>
        </div>

        {/* Matched Source */}
        <div className="flex-1 w-full max-w-sm flex flex-col items-center">
          <span className="font-mono text-sm text-fc-yellow mb-4 tracking-widest uppercase self-end">Matched Source</span>
          <div className="w-full aspect-square bg-fc-emerald border-2 border-fc-yellow overflow-hidden p-2 relative shadow-[0_0_30px_rgba(255,229,0,0.15)]">
            <img src={result.match.image_url} alt="Match" className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 bg-fc-pink text-fc-cream font-mono text-[10px] px-3 py-1 font-bold tracking-widest uppercase shadow-md">
              {result.match.platform}
            </div>
          </div>
        </div>

      </div>

      {/* Forensic Metadata Terminal */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-fc-emerald-light">
        <div className="bg-fc-emerald p-6 flex flex-col">
          <span className="font-mono text-[10px] text-fc-emerald-light uppercase tracking-widest mb-2">Platform</span>
          <span className="font-mono text-xl text-fc-cream uppercase">{result.match.platform}</span>
        </div>
        <div className="bg-fc-emerald p-6 flex flex-col">
          <span className="font-mono text-[10px] text-fc-emerald-light uppercase tracking-widest mb-2">Source Trace</span>
          <span className="font-mono text-sm text-fc-pink break-all">
            runtime_result::{result.match.url.replace('https://', '')}
          </span>
        </div>
        <div className="bg-fc-emerald p-6 flex flex-col">
          <span className="font-mono text-[10px] text-fc-emerald-light uppercase tracking-widest mb-2">Capture Timestamp</span>
          <span className="font-mono text-sm text-fc-yellow">
            {new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC
          </span>
        </div>
      </div>
    </motion.section>
  );
};

export default EvidencePanel;
