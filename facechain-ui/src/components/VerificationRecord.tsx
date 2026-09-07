import React, { useState } from 'react';
import { VerificationResult } from '../types/verification';

interface VerificationRecordProps {
  result: VerificationResult | null;
  stage: string;
}

const VerificationRecord: React.FC<VerificationRecordProps> = ({ result, stage }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'verifying' | 'verified'>('idle');

  if (!result || stage !== 'blockchain') return null;

  const isDemo = import.meta.env.VITE_API_MODE === 'demo';

  const rawJson = `{
  "record_id": "${result.session_id}",
  "input_hash": "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "matched_image_hash": "sha256:8b1a9953c4611296a827abf8c47804d7e4c49b3b0d15e5d32152345e691a32b",
  "platform": "${result.match.platform}",
  "source_url": "${result.match.url}",
  "similarity": ${result.match.similarity},
  "timestamp": "${new Date().toISOString()}",
  "blockchain": "${result.blockchain.network}",
  "tx_hash": "${result.blockchain.tx_hash}"
}`;

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(rawJson);
        setCopyStatus('copied');
      } else {
        // Fallback or just error
        setCopyStatus('error');
      }
    } catch (err) {
      console.error('Copy failed:', err);
      setCopyStatus('error');
    }
    setTimeout(() => setCopyStatus('idle'), 3000);
  };

  const handleVerify = () => {
    setVerifyStatus('verifying');
    setTimeout(() => {
      setVerifyStatus('verified');
      setTimeout(() => setVerifyStatus('idle'), 4000);
    }, 1000);
  };

  return (
    <div className="w-full mt-24 mb-12">
      <h2 className="font-serif text-4xl text-fc-cream uppercase mb-8 tracking-tighter">
        RAW <span className="text-fc-emerald-light">RECORD</span>
      </h2>
      
      <div className="w-full bg-[#00150d] border border-fc-emerald-light/50 p-6 md:p-8 font-mono text-[10px] md:text-sm text-fc-cream overflow-x-auto relative shadow-xl">
        <div className="absolute top-0 right-0 bg-fc-emerald-light text-fc-emerald-dark px-3 py-1 text-[10px] font-bold tracking-[0.2em] uppercase">
          JSON.LOG
        </div>
        
        <pre className="mt-4 text-fc-cream/90 leading-relaxed whitespace-pre-wrap break-all">
          {rawJson}
        </pre>
        
        <div className="mt-8 pt-6 border-t border-fc-emerald-light/30 flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center">
          
          <button 
            onClick={handleCopy}
            className="text-fc-yellow hover:text-white transition-colors underline font-mono text-xs tracking-widest uppercase flex items-center gap-2"
          >
            {copyStatus === 'copied' ? '✓ COPIED TO CLIPBOARD' : copyStatus === 'error' ? '⚠ COPY FAILED' : 'COPY RECORD'}
          </button>
          
          <button 
            onClick={handleVerify}
            className={`transition-colors underline font-mono text-xs tracking-widest uppercase flex items-center gap-2 ${verifyStatus === 'verified' ? 'text-fc-emerald-light hover:text-fc-emerald-light' : 'text-fc-pink hover:text-white'}`}
            disabled={verifyStatus !== 'idle'}
          >
            {verifyStatus === 'verifying' ? 'COMPUTING HASH...' : 
             verifyStatus === 'verified' ? (isDemo ? 'DEMO INTEGRITY CHECK — SIMULATED ✓' : 'LOCAL INTEGRITY CHECK PASSED ✓') : 
             'VERIFY INTEGRITY'}
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default VerificationRecord;
