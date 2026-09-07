import re
from urllib.parse import urlparse

SOCIAL_DOMAINS = {
    "instagram.com": "Instagram",
    "www.instagram.com": "Instagram",
    "facebook.com": "Facebook",
    "www.facebook.com": "Facebook",
    "x.com": "X",
    "www.x.com": "X",
    "twitter.com": "X",
    "www.twitter.com": "X",
    "tiktok.com": "TikTok",
    "www.tiktok.com": "TikTok",
    "linkedin.com": "LinkedIn",
    "www.linkedin.com": "LinkedIn",
}

def extract_social_match(matches: list, match_type: str) -> dict:
    """
    Given a list of matches from Google Lens, find the first one that is a supported social domain.
    Extract the username if possible.
    """
    for match in matches:
        link = match.get("link", "")
        if not link:
            continue
            
        parsed = urlparse(link)
        domain = parsed.netloc.lower()
        
        if domain in SOCIAL_DOMAINS:
            platform = SOCIAL_DOMAINS[domain]
            path = parsed.path.strip("/")
            parts = path.split("/")
            
            username = None
            if platform == "Instagram" and len(parts) > 0 and parts[0] not in ["p", "reel", "explore"]:
                username = f"@{parts[0]}"
            elif platform == "X" and len(parts) > 0:
                username = f"@{parts[0]}"
            elif platform == "TikTok" and len(parts) > 0 and parts[0].startswith("@"):
                username = parts[0]
            elif platform == "Facebook" and len(parts) > 0 and parts[0] not in ["watch", "groups", "pages"]:
                username = parts[0]
            elif platform == "LinkedIn" and len(parts) > 1 and parts[0] == "in":
                username = parts[1]
                
            return {
                "platform": platform,
                "username": username,
                "profile_url": f"https://{domain}/{parts[0]}" if len(parts) > 0 else link,
                "post_url": link,
                "title": match.get("title", ""),
                "thumbnail": match.get("thumbnail", ""),
                "match_type": match_type
            }
            
    return None
