import hashlib
import json

def calculate_sha256(file_content: bytes) -> str:
    return "sha256:" + hashlib.sha256(file_content).hexdigest()

def canonical_json_hash(data: dict) -> str:
    canonical = json.dumps(data, sort_keys=True, separators=(',', ':'))
    return "sha256:" + hashlib.sha256(canonical.encode('utf-8')).hexdigest()
