export type PipelineStage = 
  | 'upload'
  | 'detect'
  | 'encode'
  | 'search'
  | 'match'
  | 'blockchain';

export type StageStatus = 'waiting' | 'running' | 'complete' | 'error';

export interface VerificationResult {
  session_id: string;
  face_detected: boolean;
  face_count: number;
  encoding_dimensions: number;
  reverse_search: {
    provider: string;
    results: any[];
  };
  match: {
    found: boolean;
    platform: string;
    url: string;
    image_url: string;
    similarity: number;
  };
  blockchain: {
    network: string;
    record_hash: string;
    tx_hash: string;
    block_number: number;
  };
}

export interface VerificationProvider {
  verify: (file: File, onProgress: (stage: PipelineStage) => void) => Promise<VerificationResult>;
}
