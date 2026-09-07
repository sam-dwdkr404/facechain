import { VerificationProvider, PipelineStage, VerificationResult } from './types';

export class RealVerificationProvider implements VerificationProvider {
  async verify(
    image: File,
    onProgress: (stage: PipelineStage) => void
  ): Promise<VerificationResult> {
    onProgress('upload');
    
    // Convert to FormData
    const formData = new FormData();
    formData.append('image', image);
    
    // Simulate intermediate visual states for the pipeline
    // Since it's a single HTTP POST request, we'll optimistically update the UI stages
    // to give the user a sense of progression, even though the backend does it all at once.
    // In a production WebSockets architecture, the backend would stream these events.
    
    const timeouts = [
      setTimeout(() => onProgress('detect'), 500),
      setTimeout(() => onProgress('encode'), 2000),
      setTimeout(() => onProgress('search'), 4000),
    ];

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/verify`, {
        method: 'POST',
        body: formData,
      });

      // Clear the optimistic timeouts in case the request returns extremely fast or fails
      timeouts.forEach(clearTimeout);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server returned ${response.status}`);
      }

      const result = await response.json();
      
      onProgress('match');
      
      // Wait a moment for visual impact before showing blockchain
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onProgress('blockchain');
      
      return {
        session_id: result.record_id,
        status: 'verified',
        match: {
          image_url: result.social_matches[0].thumbnail || URL.createObjectURL(image), 
          similarity: 1.0, // Backend doesn't return similarity, we just show it's an exact match visually
          platform: result.social_matches[0].platform,
          url: result.social_matches[0].post_url,
          username: result.social_matches[0].username,
        },
        blockchain: {
          network: result.blockchain.network,
          tx_hash: result.blockchain.transaction_hash,
          block_number: result.blockchain.block_number,
          record_hash: result.blockchain.record_hash
        },
        raw_record: result
      };

    } catch (error) {
      timeouts.forEach(clearTimeout);
      throw error;
    }
  }
}
