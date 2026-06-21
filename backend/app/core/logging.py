import logging
from logging.handlers import RotatingFileHandler
import os

LOG_DIR = "/logs/api"
os.makedirs(LOG_DIR, exist_ok=True)

log_file = os.path.join(LOG_DIR, "app.log")

handler = RotatingFileHandler(log_file, maxBytes=5_000_000, backupCount=5)
formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
handler.setFormatter(formatter)

logger = logging.getLogger("app")
logger.setLevel(logging.INFO)
logger.addHandler(handler)
logger.propagate = False