import React from 'react';
import { VerificationResult } from '../types/verification';
import { motion } from 'framer-motion';

interface BlockchainProofProps {
  result: VerificationResult | null;
  stage: string;
}

const BlockchainProof: React.FC<BlockchainProofProps> = ({ result, stage }) => {
  if (!result || stage !== 'blockchain') return null;

  const isDemo = import.meta.env.VITE_API_MODE === 'demo';

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full pt-16 mt-16 border-t border-fc-emerald-light"
    >
      <div className="mb-16">
        <h2 className="font-serif text-5xl md:text-7xl text-fc-cream uppercase leading-none tracking-tighter">
          Proof<br/>
          <span className="text-fc-yellow">On-Chain</span>
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-fc-emerald-light border border-fc-emerald-light">
        
        <div className="bg-fc-emerald p-6 md:p-8 flex flex-col">
          <span className="font-mono text-[10px] text-fc-pink uppercase tracking-widest mb-2">Network</span>
          <span className="font-mono text-2xl text-fc-cream uppercase">{result.blockchain.network}</span>
        </div>
        
        <div className="bg-fc-emerald p-6 md:p-8 flex flex-col">
          <span className="font-mono text-[10px] text-fc-pink uppercase tracking-widest mb-2">Status</span>
          <span className="font-mono text-2xl text-fc-yellow animate-pulse uppercase tracking-widest">IMMUTABLE ✓</span>
        </div>
        
        <div className="bg-fc-emerald p-6 md:p-8 flex flex-col md:col-span-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <span className="font-serif text-9xl">#</span>
          </div>
          <span className="font-mono text-[10px] text-fc-pink uppercase tracking-widest mb-2">Transaction Hash</span>
          <span className="font-mono text-xl md:text-3xl text-fc-yellow break-all">{result.blockchain.tx_hash}</span>
        </div>

        <div className="bg-fc-emerald p-6 md:p-8 flex flex-col">
          <span className="font-mono text-[10px] text-fc-pink uppercase tracking-widest mb-2">Record Hash</span>
          <span className="font-mono text-sm text-fc-cream break-all opacity-80">{result.blockchain.record_hash}</span>
        </div>
        
        <div className="bg-fc-emerald p-6 md:p-8 flex flex-col">
          <span className="font-mono text-[10px] text-fc-pink uppercase tracking-widest mb-2">Block Number</span>
          <span className="font-mono text-sm text-fc-cream opacity-80">{result.blockchain.block_number}</span>
        </div>

      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button 
          className={`px-8 py-4 font-mono font-bold text-sm tracking-widest uppercase transition-colors inline-flex items-center justify-center gap-2 ${isDemo ? 'bg-fc-emerald-dark text-fc-yellow border border-fc-yellow hover:bg-fc-yellow hover:text-fc-emerald-dark cursor-not-allowed' : 'bg-fc-yellow text-fc-emerald-dark hover:bg-white'}`}
          disabled={isDemo}
        >
          {isDemo ? 'EXPLORER (SIMULATED) ↗' : 'VIEW ON EXPLORER ↗'}
        </button>
      </div>

      <p className="font-mono text-[10px] text-fc-emerald-light mt-8 max-w-2xl opacity-70 leading-relaxed">
        NOTE: BLOCKCHAIN ANCHORING PROVES RECORD INTEGRITY ONLY. IT DOES NOT INDEPENDENTLY PROVE IDENTITY OR OWNERSHIP OF THE SOURCE ACCOUNT. BIOMETRIC VECTORS ARE NEVER STORED ON-CHAIN.
      </p>

    </motion.section>
  );
};

export default BlockchainProof;
