import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import ImageUploader from '../components/ImageUploader';
import FaceDetection from '../components/FaceDetection';
import Pipeline from '../components/Pipeline';
import ReverseSearch from '../components/ReverseSearch';
import EvidencePanel from '../components/EvidencePanel';
import BlockchainProof from '../components/BlockchainProof';
import VerificationRecord from '../components/VerificationRecord';
import { verificationProvider } from '../services/api';
import { PipelineStage, VerificationResult } from '../types/verification';
import { motion, AnimatePresence } from 'framer-motion';

const Verification: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [stage, setStage] = useState<PipelineStage>('upload');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [isError, setIsError] = useState(false);

  const isDemo = import.meta.env.VITE_API_MODE === 'demo';

  const handleImageSelected = async (file: File) => {
    setImageFile(file);
    setIsError(false);
    setResult(null);
    
    try {
      const finalResult = await verificationProvider.verify(file, (newStage) => {
        setStage(newStage);
      });
      setResult(finalResult);
      setStage('blockchain'); // Final stage
    } catch (err) {
      console.error(err);
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-fc-emerald flex flex-col overflow-x-hidden">
      <Navbar />
      
      {isDemo && (
        <div className="w-full bg-fc-yellow text-fc-emerald-dark border-b-4 border-fc-pink p-3 text-center">
          <div className="font-mono text-sm uppercase font-bold tracking-[0.3em]">
            DEVELOPMENT MODE / DEMO DATA
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest mt-1 opacity-80">
            No external reverse-image search or blockchain transaction is being claimed in this mode.
          </div>
        </div>
      )}

      <main className="flex-grow w-full max-w-[92%] mx-auto py-12 flex flex-col gap-24">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-fc-emerald-light pb-8">
          <div>
            <h1 className="font-serif text-6xl md:text-[6rem] text-fc-cream uppercase leading-[0.9] tracking-tighter">
              Verification<br/>
              <span className="text-fc-yellow">Workspace</span>
            </h1>
          </div>
          <div className="mt-12 md:mt-0 flex flex-col items-start md:items-end font-mono">
            {/* Technical Indicator */}
            <div className="mb-8 p-3 border border-fc-emerald-light bg-fc-emerald-dark/50">
              <div className="text-[10px] text-fc-emerald-light tracking-widest uppercase mb-1">Architecture</div>
              <div className="text-xs text-fc-yellow tracking-wider">ENGINE: <span className="text-fc-cream">{isDemo ? 'DEMO PROVIDER' : 'REAL PROVIDER'}</span></div>
              <div className="text-xs text-fc-yellow tracking-wider mt-1">TARGET: <span className="text-fc-cream">REAL VERIFICATION API</span></div>
            </div>

            <span className="text-fc-emerald-light text-[10px] uppercase tracking-widest">Session ID</span>
            <span className="text-fc-pink text-xl">{result ? result.session_id : 'PENDING'}</span>
            <span className="text-fc-emerald-light text-[10px] uppercase tracking-widest mt-4">Status</span>
            <span className={`text-sm tracking-widest ${stage === 'upload' ? 'text-fc-yellow' : 'text-fc-cream animate-pulse'}`}>
              {isError ? 'ERROR' : (stage === 'blockchain' ? 'VERIFIED' : (stage === 'upload' ? 'READY' : 'PROCESSING'))}
            </span>
          </div>
        </section>

        {/* Input & Pipeline Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {!imageFile ? (
                <motion.div 
                  key="uploader"
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="w-full"
                >
                  <ImageUploader onImageSelected={handleImageSelected} />
                </motion.div>
              ) : (
                <motion.div
                  key="detection"
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full"
                >
                  <FaceDetection imageFile={imageFile} stage={stage} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="lg:col-span-7 flex flex-col w-full pt-4">
            <Pipeline currentStage={stage} />
          </div>
        </section>

        {/* Reverse Search Section */}
        <ReverseSearch stage={stage} />

        {/* Bottom Area (Evidence & Blockchain) */}
        {stage === 'blockchain' && result && (
          <>
            <EvidencePanel result={result} stage={stage} />
            <BlockchainProof result={result} stage={stage} />
            <VerificationRecord result={result} stage={stage} />
          </>
        )}

      </main>
    </div>
  );
};

export default Verification;
