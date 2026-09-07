import io
import numpy as np
from PIL import Image
import os
import cv2
import tempfile
from deepface import DeepFace

def process_face(image_bytes: bytes) -> dict:
    """
    Detects faces in the given image bytes using DeepFace.
    Extracts actual embeddings (Facenet is 128-D).
    Returns metadata about detection and the embedding dimensionality.
    """
    # Write bytes to a temporary file because DeepFace prefers file paths or numpy arrays (but numpy arrays sometimes cause color space issues depending on the backend).
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
        tmp_file.write(image_bytes)
        tmp_path = tmp_file.name
        
    try:
        # DeepFace represent returns a list of dictionaries, one for each face detected.
        # Enforce detection, use Facenet to get a 128-D vector.
        representations = DeepFace.represent(img_path=tmp_path, model_name="Facenet", enforce_detection=True)
        count = len(representations)
        
        dim = 0
        if count > 0:
            # Get the embedding of the first face
            embedding = representations[0].get("embedding", [])
            dim = len(embedding)
            
        return {
            "detected": count > 0,
            "count": count,
            "encoding_dimensions": dim
        }
    except ValueError as e:
        # DeepFace raises ValueError if enforce_detection=True and no face is found
        if "Face could not be detected" in str(e):
            return {
                "detected": False,
                "count": 0,
                "encoding_dimensions": 0
            }
        raise e
    finally:
        # Clean up temp file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
