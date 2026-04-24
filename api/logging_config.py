import logging
import sys

def setup_logging():
    """Sets up a professional logging configuration for the API."""
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    # Silence third-party logs if needed
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)

logger = logging.getLogger("spotify_elite_api")
