import io
import requests
from PIL import Image
from config import Config

class ReverseSearchException(Exception):
    pass

def compress_image(image_bytes: bytes, max_size_kb: int = 500) -> bytes:
    """
    Compresses and resizes the image if it exceeds max_size_kb.
    """
    if len(image_bytes) <= max_size_kb * 1024:
        return image_bytes
        
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    quality = 85
    output = io.BytesIO()
    
    # Resize slightly if very large
    if img.width > 1200 or img.height > 1200:
        img.thumbnail((1200, 1200))
        
    while True:
        output.seek(0)
        output.truncate(0)
        img.save(output, format="JPEG", quality=quality)
        if output.tell() <= max_size_kb * 1024 or quality <= 20:
            break
        quality -= 10
        
    return output.getvalue()

def upload_to_serpapi(image_bytes: bytes) -> str:
    """
    Uploads the image to SerpApi to get an image_id.
    """
    if not Config.SERPAPI_API_KEY:
        raise ReverseSearchException("SERPAPI_API_KEY is missing")
        
    compressed_bytes = compress_image(image_bytes)
    
    response = requests.post(
        "https://serpapi.com/image",
        data={"api_key": Config.SERPAPI_API_KEY},
        files={"image": ("image.jpg", compressed_bytes, "image/jpeg")}
    )
    
    if response.status_code != 200:
        raise ReverseSearchException(f"Failed to upload image to SerpApi: {response.text}")
        
    data = response.json()
    image_id = data.get("image_id")
    if not image_id:
        raise ReverseSearchException(f"SerpApi did not return an image_id: {data}")
        
    return image_id

def perform_google_lens_search(image_id: str) -> dict:
    """
    Performs a Google Lens search using the image_id.
    """
    response = requests.get(
        "https://serpapi.com/search.json",
        params={
            "engine": "google_lens",
            "image_id": image_id,
            "api_key": Config.SERPAPI_API_KEY
        }
    )
    
    if response.status_code != 200:
        raise ReverseSearchException(f"Failed to query Google Lens: {response.text}")
        
    return response.json()

def execute_reverse_search(image_bytes: bytes) -> dict:
    """
    Executes the full reverse search pipeline: upload -> search -> extract exact/visual matches.
    """
    image_id = upload_to_serpapi(image_bytes)
    results = perform_google_lens_search(image_id)
    
    exact_matches = results.get("exact_matches", [])
    visual_matches = results.get("visual_matches", [])
    
    return {
        "provider": "Google Lens via SerpApi",
        "exact_matches": exact_matches,
        "visual_matches": visual_matches
    }
