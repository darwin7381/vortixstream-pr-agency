"""One-shot: upload the Vortix horizontal white logo to R2 for use as the AI hero center image."""
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "backend"))

from app.services.r2_storage import r2_storage  # noqa: E402

asset = REPO_ROOT / "frontend/src/assets/VortixLogo White_Horizontal.png"
content = asset.read_bytes()
result = r2_storage.upload_file(
    file_content=content,
    filename="vortix-horizontal-white.png",
    folder="brand",
)
print(result["url"])
