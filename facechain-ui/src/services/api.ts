import type { VerificationProvider, VerificationResult, PipelineStage } from '../types/verification';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class DemoVerificationProvider implements VerificationProvider {
  async verify(file: File, onProgress: (stage: PipelineStage) => void): Promise<VerificationResult> {
    onProgress('upload');
    await sleep(1000);
    
    onProgress('detect');
    await sleep(2000);
    
    onProgress('encode');
    await sleep(1500);
    
    onProgress('search');
    await sleep(3000);
    
    onProgress('match');
    await sleep(1000);
    
    onProgress('blockchain');
    await sleep(2500);

    return {
      session_id: 'FC-' + Math.random().toString(36).substring(2, 6).toUpperCase(),
      face_detected: true,
      face_count: 1,
      encoding_dimensions: 128,
      reverse_search: {
        provider: 'Google Lens Simulator',
        results: []
      },
      match: {
        found: true,
        platform: 'Instagram',
        url: 'https://instagram.com/demo_match',
        image_url: URL.createObjectURL(file), // Using the uploaded image for demo visual match
        similarity: 0.942
      },
      blockchain: {
        network: 'Polygon Amoy',
        record_hash: '8b31a' + Math.random().toString(16).substring(2, 10) + 'e91a',
        tx_hash: '0x' + Math.random().toString(16).substring(2, 64),
        block_number: Math.floor(100000 + Math.random() * 900000)
      }
    };
  }
}

class RealVerificationProvider implements VerificationProvider {
  async verify(file: File, onProgress: (stage: PipelineStage) => void): Promise<VerificationResult> {
    onProgress('upload');
    
    const formData = new FormData();
    formData.append('image', file);

    const timeouts = [
      setTimeout(() => onProgress('detect'), 500),
      setTimeout(() => onProgress('encode'), 1500),
      setTimeout(() => onProgress('search'), 2500),
    ];

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/verify`, {
        method: 'POST',
        body: formData,
      });

      timeouts.forEach(clearTimeout);

      if (!response.ok) {
        let errMsg = `Server returned ${response.status}`;
        try {
          const errData = await response.json();
          errMsg = errData.detail || errMsg;
        } catch(e) {}
        throw new Error(errMsg);
      }

      const result = await response.json();
      
      onProgress('match');
      await sleep(1000); // Visual delay
      onProgress('blockchain');
      
      const socialMatch = result.social_matches[0];
      
      return {
        session_id: result.record_id,
        face_detected: result.face.detected,
        face_count: result.face.count,
        encoding_dimensions: result.face.encoding_dimensions,
        reverse_search: {
          provider: result.reverse_search.provider,
          results: []
        },
        match: {
          found: true,
          platform: socialMatch.platform,
          url: socialMatch.post_url,
          image_url: socialMatch.thumbnail || URL.createObjectURL(file),
          similarity: 1.0, // Backend doesn't give a fake similarity, so we just return 1.0 or visual match
        },
        blockchain: {
          network: result.blockchain.network,
          record_hash: result.blockchain.record_hash,
          tx_hash: result.blockchain.transaction_hash,
          block_number: result.blockchain.block_number
        }
      };
    } catch (error) {
      timeouts.forEach(clearTimeout);
      console.error("API Error:", error);
      throw error;
    }
  }
}

export const verificationProvider = import.meta.env.VITE_API_MODE === 'demo' 
  ? new DemoVerificationProvider() 
  : new RealVerificationProvider();
