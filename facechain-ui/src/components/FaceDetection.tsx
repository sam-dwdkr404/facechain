import React from 'react';
import { motion } from 'framer-motion';

interface FaceDetectionProps {
  imageFile: File;
  stage: string;
}

const FaceDetection: React.FC<FaceDetectionProps> = ({ imageFile, stage }) => {
  const imageUrl = URL.createObjectURL(imageFile);
  const isDetecting = stage === 'detect';
  const isEncoded = ['encode', 'search', 'match', 'blockchain'].includes(stage);
  
  return (
    <div className="w-full flex justify-center relative">
      <div className="relative w-full max-w-xl aspect-square bg-fc-emerald-dark overflow-hidden border border-fc-emerald-light shadow-2xl">
        <img 
          src={imageUrl} 
          alt="Input Face" 
          className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700" 
        />
        
        {/* Scanning Line Animation */}
        {isDetecting && (
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
            <motion.div 
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-fc-pink shadow-[0_0_15px_rgba(255,22,136,1)]"
            />
            <motion.div 
              initial={{ top: "-20%" }}
              animate={{ top: "80%" }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute left-0 right-0 h-[20%] bg-gradient-to-b from-transparent to-fc-pink/30"
            />
          </div>
        )}

        {/* Bounding Box (appears after detection) */}
        {(stage !== 'upload' && stage !== 'detect') && (
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-[20%] left-[25%] w-[50%] h-[60%] border-2 border-fc-yellow shadow-[0_0_10px_rgba(255,229,0,0.5)] z-20"
          >
            <div className="absolute -top-6 -left-0.5 bg-fc-yellow text-fc-emerald-dark font-mono text-[10px] px-2 py-1 font-bold">
              ID: FC-8A21
            </div>
            <div className="absolute -bottom-6 -right-0.5 text-fc-yellow font-mono text-[10px] bg-fc-emerald-dark/90 px-2 py-1 border border-fc-yellow">
              CONF: 0.99
            </div>
          </motion.div>
        )}
      </div>

      {/* Floating Technical Annotations */}
      {(stage !== 'upload' && stage !== 'detect') && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-12 -left-8 md:-left-16 bg-fc-emerald-dark border border-fc-emerald-light p-3 z-30"
        >
          <div className="font-mono text-[10px] text-fc-emerald-light tracking-widest uppercase mb-1">Face Detection</div>
          <div className="font-mono text-sm text-fc-yellow tracking-wider">01 FACE FOUND</div>
        </motion.div>
      )}

      {isEncoded && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-12 -right-8 md:-right-16 bg-fc-emerald-dark border border-fc-emerald-light p-3 z-30 text-right"
        >
          <div className="font-mono text-[10px] text-fc-emerald-light tracking-widest uppercase mb-1">Encoding</div>
          <div className="font-mono text-sm text-fc-yellow tracking-wider">128-D VECTOR</div>
        </motion.div>
      )}
    </div>
  );
};

export default FaceDetection;
