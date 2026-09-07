from fastapi import APIRouter, UploadFile, File, HTTPException
import uuid
import datetime

from services.face_service import process_face
from services.hashing_service import calculate_sha256, canonical_json_hash
from services.reverse_search_service import execute_reverse_search, ReverseSearchException
from services.matcher import extract_social_match
from services.blockchain_service import store_verification, BlockchainException

router = APIRouter()

@router.post("/verify")
async def verify_image(image: UploadFile = File(...)):
    try:
        image_bytes = await image.read()
        
        # 1. Original Image Hash
        input_hash = calculate_sha256(image_bytes)
        
        # 2. Face Processing
        face_data = process_face(image_bytes)
        
        # 3. Reverse Search via SerpApi
        search_results = execute_reverse_search(image_bytes)
        
        # 4. Social Match Extraction
        social_match = extract_social_match(search_results.get("exact_matches", []), "exact_image_match")
        if not social_match:
            social_match = extract_social_match(search_results.get("visual_matches", []), "visual_match")
            
        if not social_match:
            raise HTTPException(status_code=404, detail="NO SOCIAL MEDIA MATCH FOUND")
            
        # 5. Build Verification Record
        record_id = f"FC-{uuid.uuid4().hex[:8].upper()}"
        timestamp = datetime.datetime.utcnow().isoformat() + "Z"
        
        record = {
            "record_id": record_id,
            "face": face_data,
            "input_image_sha256": input_hash,
            "reverse_search": {
                "provider": search_results["provider"]
            },
            "social_matches": [social_match],
            "timestamp": timestamp
        }
        
        # 6. Blockchain Anchoring
        record_hash = canonical_json_hash(record)
        
        try:
            blockchain_data = store_verification(record_id, record_hash)
            record["blockchain"] = blockchain_data
        except BlockchainException as e:
            raise HTTPException(status_code=500, detail=f"BLOCKCHAIN FAILED: {str(e)}")
            
        return record
        
    except ReverseSearchException as e:
        raise HTTPException(status_code=500, detail=f"REVERSE IMAGE SEARCH FAILED: {str(e)}")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
