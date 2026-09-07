import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SERPAPI_API_KEY = os.getenv("SERPAPI_API_KEY")
    POLYGON_RPC_URL = os.getenv("POLYGON_RPC_URL")
    POLYGON_PRIVATE_KEY = os.getenv("POLYGON_PRIVATE_KEY")
    CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

    @classmethod
    def validate(cls):
        missing = []
        if not cls.SERPAPI_API_KEY: missing.append("SERPAPI_API_KEY")
        if not cls.POLYGON_RPC_URL: missing.append("POLYGON_RPC_URL")
        if not cls.POLYGON_PRIVATE_KEY: missing.append("POLYGON_PRIVATE_KEY")
        
        if missing:
            print(f"Warning: Missing environment variables: {', '.join(missing)}")

Config.validate()
