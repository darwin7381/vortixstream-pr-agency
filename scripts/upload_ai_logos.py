"""
Fetch real publication / client logos from Wikipedia and upload to R2.

Strategy (most-reliable first, falling back):
  1. Get the article's images list via the MediaWiki API
  2. Pick the best logo file: prefer files containing "logo", "wordmark", or the brand name
  3. Resolve via Special:FilePath, downloading at width=800 (auto-rasterises SVGs)
  4. Upload to R2

If Wikipedia has no usable logo, fall back to Google's S2 favicon service at 256px,
which always returns a PNG. Not ideal but always works.

Run from backend dir:
    cd backend && uv run python ../scripts/upload_ai_logos.py
"""

import json
import re
import sys
from pathlib import Path
from urllib.parse import quote

import requests

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "backend"))

from app.services.r2_storage import r2_storage  # noqa: E402

USER_AGENT = "VortixPR-Asset-Loader/1.0 (contact: hello@vortixpr.com)"

# (display_name, wikipedia_article_title, fallback_domain_for_favicon)
MEDIA_PUBLICATIONS: list[tuple[str, str, str]] = [
    ("TechCrunch", "TechCrunch", "techcrunch.com"),
    ("The Verge", "The Verge", "theverge.com"),
    ("VentureBeat", "VentureBeat", "venturebeat.com"),
    ("Wired", "Wired (magazine)", "wired.com"),
    ("MIT Technology Review", "MIT Technology Review", "technologyreview.com"),
    ("Ars Technica", "Ars Technica", "arstechnica.com"),
    ("Product Hunt", "Product Hunt", "producthunt.com"),
    ("IEEE Spectrum", "IEEE Spectrum", "spectrum.ieee.org"),
    ("The Information", "The Information (website)", "theinformation.com"),
    ("Forbes", "Forbes", "forbes.com"),
    ("Fortune", "Fortune (magazine)", "fortune.com"),
    ("Bloomberg", "Bloomberg L.P.", "bloomberg.com"),
]

AI_CLIENT_BRANDS: list[tuple[str, str, str]] = [
    ("OpenAI", "OpenAI", "openai.com"),
    ("Anthropic", "Anthropic", "anthropic.com"),
    ("Hugging Face", "Hugging Face", "huggingface.co"),
    ("Mistral AI", "Mistral AI", "mistral.ai"),
    ("Cohere", "Cohere", "cohere.com"),
    ("Stability AI", "Stability AI", "stability.ai"),
    ("Runway", "Runway (company)", "runwayml.com"),
    ("Perplexity AI", "Perplexity AI", "perplexity.ai"),
    ("Replicate", "Replicate (company)", "replicate.com"),
    ("ElevenLabs", "ElevenLabs", "elevenlabs.io"),
    ("Groq", "Groq", "groq.com"),
    ("Scale AI", "Scale AI", "scale.com"),
    ("Together AI", "Together AI", "together.ai"),
    ("Weights & Biases", "Weights & Biases", "wandb.ai"),
    ("LangChain", "LangChain", "langchain.com"),
]


def slugify(name: str) -> str:
    return (
        name.lower()
        .replace("&", "and")
        .replace(" ", "-")
        .replace("(", "")
        .replace(")", "")
        .replace(",", "")
        .replace(".", "")
    )


def get_article_images(title: str) -> list[str]:
    """Return list of File: titles attached to a Wikipedia article (no namespace prefix)."""
    url = (
        "https://en.wikipedia.org/w/api.php"
        f"?action=query&titles={quote(title)}&prop=images&imlimit=50&format=json"
    )
    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=20)
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException as exc:
        print(f"  ✗ images query failed: {exc}")
        return []

    pages = data.get("query", {}).get("pages", {})
    files: list[str] = []
    for _pageid, page in pages.items():
        for img in page.get("images") or []:
            t = img.get("title", "")
            if t.startswith("File:"):
                files.append(t[len("File:") :])
    return files


def pick_best_logo(files: list[str], brand: str) -> str | None:
    """
    Score and rank candidate files. Prefer files with 'logo' or 'wordmark' in the name,
    avoiding obvious junk like 'Commons-logo.svg' which is on every Wikipedia page.
    """
    brand_tokens = [tok.lower() for tok in re.split(r"\W+", brand) if tok]
    blocklist_substrings = [
        "commons-logo",
        "wikidata",
        "edit-icon",
        "padlock",
        "p_vip",
        "question_book",
        "ambox",
        "office-book",
        "icon_lock",
        "speakerlink",
        "merge-arrow",
        "wiktionary",
        "wikinews",
        "wikiquote",
        "wiki_letter",
        "Symbol_",
        "sound-icon",
        "pictogram",
    ]

    scored: list[tuple[int, str]] = []
    for f in files:
        lower = f.lower()
        if any(b in lower for b in blocklist_substrings):
            continue
        # Reject obvious magazine-cover and screenshot images
        if any(k in lower for k in ("cover", "screenshot", "homepage", "issue", "magazine_")):
            continue
        score = 0
        if "logo" in lower:
            score += 10
        if "wordmark" in lower:
            score += 8
        for tok in brand_tokens:
            if tok and tok in lower:
                score += 5
        if lower.endswith(".svg"):
            score += 3
        if lower.endswith(".png"):
            score += 1
        if score > 0:
            scored.append((score, f))

    if not scored:
        return None
    scored.sort(key=lambda x: -x[0])
    return scored[0][1]


def download_commons_file(filename: str) -> tuple[bytes, str] | None:
    is_svg = filename.lower().endswith(".svg")
    if is_svg:
        url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{quote(filename)}?width=800"
        ext = "png"
    else:
        url = f"https://commons.wikimedia.org/wiki/Special:FilePath/{quote(filename)}"
        ext = Path(filename).suffix.lstrip(".").lower() or "png"

    print(f"  → {url}")
    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=30, allow_redirects=True)
        resp.raise_for_status()
    except requests.RequestException as exc:
        print(f"  ✗ download failed: {exc}")
        return None

    content_type = resp.headers.get("Content-Type", "")
    if not content_type.startswith("image/"):
        print(f"  ⚠ unexpected content-type {content_type}")
        return None
    return resp.content, ext


def fetch_google_favicon(domain: str) -> tuple[bytes, str] | None:
    url = f"https://www.google.com/s2/favicons?sz=256&domain={domain}"
    print(f"  → favicon fallback {url}")
    try:
        resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=20)
        resp.raise_for_status()
    except requests.RequestException as exc:
        print(f"  ✗ favicon failed: {exc}")
        return None
    return resp.content, "png"


def upload_batch(brands: list[tuple[str, str, str]], folder: str) -> dict[str, str]:
    results: dict[str, str] = {}
    for display_name, article, fallback_domain in brands:
        print(f"\n[{display_name}]  article={article!r}")
        files = get_article_images(article)
        print(f"  found {len(files)} files on article")
        candidate = pick_best_logo(files, display_name)
        downloaded: tuple[bytes, str] | None = None
        if candidate:
            print(f"  picked: {candidate}")
            downloaded = download_commons_file(candidate)
        if not downloaded:
            print("  ⚠ no usable Wikipedia logo, falling back to Google favicon")
            downloaded = fetch_google_favicon(fallback_domain)
        if not downloaded:
            print(f"  ✗ skipped {display_name}")
            continue
        content, ext = downloaded
        try:
            uploaded = r2_storage.upload_file(
                file_content=content,
                filename=f"{slugify(display_name)}.{ext}",
                folder=folder,
            )
        except Exception as exc:
            print(f"  ✗ upload failed: {exc}")
            continue
        url = uploaded["url"]
        print(f"  ✓ {url}")
        results[display_name] = url
    return results


def main() -> None:
    if not r2_storage.enabled:
        print("R2 not enabled — check R2_* env vars in backend/.env")
        sys.exit(1)

    print("=" * 60)
    print("AI MEDIA PUBLICATIONS")
    print("=" * 60)
    media_results = upload_batch(MEDIA_PUBLICATIONS, "ai-media-logos")

    print("\n" + "=" * 60)
    print("AI CLIENT BRANDS")
    print("=" * 60)
    client_results = upload_batch(AI_CLIENT_BRANDS, "ai-clients")

    output = {"media": media_results, "clients": client_results}
    output_path = REPO_ROOT / "scripts" / "ai_logo_urls.json"
    output_path.write_text(json.dumps(output, indent=2))
    print(f"\n✓ Wrote {output_path}")
    print(f"  media:   {len(media_results)}/{len(MEDIA_PUBLICATIONS)}")
    print(f"  clients: {len(client_results)}/{len(AI_CLIENT_BRANDS)}")


if __name__ == "__main__":
    main()
