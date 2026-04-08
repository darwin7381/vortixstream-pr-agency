"""
Reseed AI PR packages: 3 categories × 3 packages = 9 packages.
Mirrors crypto's structure (3 categories with 2-3 cards each).

Categories:
  - ai-launch    AI LAUNCH PR       (Foundation Launch / Model Release / Funding Round)
  - ai-vertical  AI VERTICAL FOCUS  (Dev Tools & Infra / Consumer AI / Enterprise AI)
  - ai-founder   AI FOUNDER PR      (Technical Founder / Researcher Authority / CTO Spotlight)

Run:
    cd backend && uv run python ../scripts/seed_ai_packages.py

Idempotent: removes existing audience='ai' packages and ai-* categories first.
"""

import asyncio
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "backend"))

import asyncpg  # noqa: E402

from app.config import settings  # noqa: E402

# All AI media-logo R2 URLs (re-used across packages so cards have variety)
MEDIA_LOGO_URLS = {
    "TechCrunch": "https://img.vortixpr.com/ai-media-logos/5fb6b9f6-9c7f-481c-8ab0-7d1db1226ce1.png",
    "The Verge": "https://img.vortixpr.com/ai-media-logos/4731c9b5-9555-4401-a75a-733b304df7ca.png",
    "VentureBeat": "https://img.vortixpr.com/ai-media-logos/7ff3a43e-c3fe-43b0-bffc-297cae3c3f50.png",
    "Wired": "https://img.vortixpr.com/ai-media-logos/e4591930-6946-40e0-b9b7-6a339c2e4f99.png",
    "MIT Technology Review": "https://img.vortixpr.com/ai-media-logos/d5d8b169-0a60-4997-8d89-33185b4396c8.png",
    "Ars Technica": "https://img.vortixpr.com/ai-media-logos/a421bba0-5f8c-489c-886e-53a0bcdbe32c.png",
    "Forbes": "https://img.vortixpr.com/ai-media-logos/14a564b3-cdb0-496e-ae14-5a57db6e8e8e.png",
    "Bloomberg": "https://img.vortixpr.com/ai-media-logos/1cbd7c50-eb24-4e15-882e-21bd216bdaed.png",
    "Fortune": "https://img.vortixpr.com/ai-media-logos/74ecb52a-c1d4-42d6-b7e2-e12803f609f0.png",
    "IEEE Spectrum": "https://img.vortixpr.com/ai-media-logos/8ab2079a-f263-416b-8ce7-dcd816f3a2ba.png",
    "Product Hunt": "https://img.vortixpr.com/ai-media-logos/6d63db5a-f7c3-4afa-918a-7f544a5ec987.png",
    "The Information": "https://img.vortixpr.com/ai-media-logos/7193ce67-d1be-4fe2-8fc0-a8a80332c749.png",
}


def media_logos_for(*names: str) -> list[dict]:
    return [{"name": n, "url": MEDIA_LOGO_URLS[n]} for n in names]


CATEGORIES = [
    {
        "category_id": "ai-launch",
        "title": "AI LAUNCH PR",
        "badges": ["🚀 Model Launch", "💰 Funding Round", "🤖 Product Launch"],
        "display_order": 4,
    },
    {
        "category_id": "ai-vertical",
        "title": "VERTICAL FOCUS",
        "badges": ["⚙️ Dev Tools", "👥 Consumer AI", "🏢 Enterprise AI"],
        "display_order": 5,
    },
    {
        "category_id": "ai-founder",
        "title": "FOUNDER PR",
        "badges": ["👨‍💻 Technical Founders", "🔬 Researchers", "⭐ CTO Spotlight"],
        "display_order": 6,
    },
]

PACKAGES = [
    # ─── AI LAUNCH PR ────────────────────────────────────────────────────────
    {
        "slug": "ai-foundation-launch",
        "name": "Foundation Launch",
        "price": "$2,500 USD",
        "badge": "LAUNCH-READY AI VISIBILITY",
        "description": "Get your AI product or model in front of the founders, engineers, and investors who matter — without burning a quarter of runway.",
        "guaranteed_publications": 5,
        "category_id": "ai-launch",
        "category_order": 0,
        "display_order": 1,
        "media_logos": media_logos_for("TechCrunch", "VentureBeat", "Ars Technica"),
        "features": [
            "Distribution to 5 curated AI & tech publications",
            "Founder quote preparation and media coaching",
            "Same-day distribution after final approval",
            "Editorial polish and headline optimisation",
            "Standard email support",
        ],
    },
    {
        "slug": "ai-model-release",
        "name": "Model Release",
        "price": "From $7,500",
        "badge": "FULL MODEL LAUNCH",
        "description": "End-to-end PR for a new model or major version — research narrative, benchmark framing, and tier-1 reach.",
        "guaranteed_publications": 15,
        "category_id": "ai-launch",
        "category_order": 0,
        "display_order": 2,
        "media_logos": media_logos_for("TechCrunch", "Wired", "MIT Technology Review", "The Verge"),
        "features": [
            "15+ tier-1 AI & tech outlet placements",
            "Benchmark and capability positioning",
            "Embargo coordination with key journalists",
            "Multi-wave scheduling across 3 days",
            "Investor and stakeholder briefing kit",
        ],
    },
    {
        "slug": "ai-funding-round",
        "name": "Funding Round",
        "price": "From $12,000",
        "badge": "SERIES A/B ANNOUNCEMENT",
        "description": "Coordinated funding announcement with exclusive briefings, follow-up coverage, and investor narrative alignment.",
        "guaranteed_publications": 20,
        "category_id": "ai-launch",
        "category_order": 0,
        "display_order": 3,
        "media_logos": media_logos_for("Forbes", "Bloomberg", "TechCrunch", "Fortune"),
        "features": [
            "Exclusive with a tier-1 publication",
            "20+ follow-up placements within 72 hours",
            "Investor narrative and term framing",
            "Founder media training pre-announcement",
            "Crisis comms standby for the launch window",
        ],
    },
    # ─── VERTICAL FOCUS ──────────────────────────────────────────────────────
    {
        "slug": "ai-dev-tools",
        "name": "Dev Tools & Infra",
        "price": "$4,500 USD",
        "badge": "BUILDER-AUDIENCE COVERAGE",
        "description": "Reach the engineers, MLOps leads, and infra buyers via the publications and communities they actually read.",
        "guaranteed_publications": 8,
        "category_id": "ai-vertical",
        "category_order": 1,
        "display_order": 1,
        "media_logos": media_logos_for("Ars Technica", "IEEE Spectrum", "Product Hunt"),
        "features": [
            "Coverage in builder-focused publications",
            "Hacker News and Product Hunt launch coordination",
            "Technical blog placements (8+ outlets)",
            "Developer relations narrative support",
            "GitHub README and docs polish",
        ],
    },
    {
        "slug": "ai-consumer",
        "name": "Consumer AI",
        "price": "$5,500 USD",
        "badge": "MAINSTREAM AI BRANDING",
        "description": "Position consumer AI products in front of mainstream tech press and lifestyle media for adoption-driving coverage.",
        "guaranteed_publications": 10,
        "category_id": "ai-vertical",
        "category_order": 1,
        "display_order": 2,
        "media_logos": media_logos_for("The Verge", "Wired", "Fortune"),
        "features": [
            "Mainstream tech and lifestyle media coverage",
            "10+ consumer-facing publication placements",
            "Product demo reel and asset preparation",
            "App store feature outreach support",
            "Influencer and creator briefing kit",
        ],
    },
    {
        "slug": "ai-enterprise",
        "name": "Enterprise AI",
        "price": "From $8,500",
        "badge": "B2B CREDIBILITY BUILDING",
        "description": "Build credibility with enterprise buyers via industry analysts, business press, and case-study placements.",
        "guaranteed_publications": 12,
        "category_id": "ai-vertical",
        "category_order": 1,
        "display_order": 3,
        "media_logos": media_logos_for("Forbes", "Bloomberg", "VentureBeat", "MIT Technology Review"),
        "features": [
            "Business and enterprise tech press coverage",
            "Customer case-study development (2 included)",
            "Analyst briefings (Gartner, Forrester intro)",
            "ROI and security-posture narrative framing",
            "Enterprise event speaker pitch support",
        ],
    },
    # ─── FOUNDER PR ──────────────────────────────────────────────────────────
    {
        "slug": "ai-technical-founder",
        "name": "Technical Founder Starter",
        "price": "$2,000 USD",
        "badge": "FOUNDER VISIBILITY KIT",
        "description": "Personal brand foundation for technical founders — narrative, two articles, and an interview placement.",
        "guaranteed_publications": 3,
        "category_id": "ai-founder",
        "category_order": 2,
        "display_order": 1,
        "media_logos": media_logos_for("VentureBeat", "TechCrunch", "Product Hunt"),
        "features": [
            "Founder narrative and bio development",
            "1–2 thought leadership articles",
            "1 podcast or written interview placement",
            "LinkedIn presence audit and templates",
            "Headshot and brand asset guidance",
        ],
    },
    {
        "slug": "ai-researcher-authority",
        "name": "Researcher Authority",
        "price": "$3,500 USD",
        "badge": "RESEARCH NARRATIVE PROGRAM",
        "description": "For ML researchers and PhDs going public — translate papers into press, get cited in tier-1 publications.",
        "guaranteed_publications": 6,
        "category_id": "ai-founder",
        "category_order": 2,
        "display_order": 2,
        "media_logos": media_logos_for("MIT Technology Review", "IEEE Spectrum", "The Verge"),
        "features": [
            "Paper-to-press narrative translation",
            "6+ tier-1 publication placements per quarter",
            "Conference keynote and panel pitching",
            "Twitter/X thought leadership amplification",
            "Research communication coaching",
        ],
    },
    {
        "slug": "ai-cto-spotlight",
        "name": "CTO Spotlight",
        "price": "$6,000 USD",
        "badge": "6-MONTH AUTHORITY PROGRAM",
        "description": "Sustained 6-month thought leadership for senior technical leaders — bylines, interviews, and speaker placements.",
        "guaranteed_publications": 12,
        "category_id": "ai-founder",
        "category_order": 2,
        "display_order": 3,
        "media_logos": media_logos_for("Forbes", "Wired", "TechCrunch", "Bloomberg"),
        "features": [
            "Monthly placements across 6 months (12+ total)",
            "2 byline articles per month (ghostwritten)",
            "Speaker bureau pitching for 3 conferences",
            "Quarterly narrative refresh sessions",
            "Crisis-comms hotline access",
        ],
    },
]


async def main() -> None:
    conn = await asyncpg.connect(settings.DATABASE_URL)
    try:
        async with conn.transaction():
            print("→ Removing existing AI packages and ai-* categories")
            deleted_pkg = await conn.execute(
                "DELETE FROM pr_packages WHERE audience = 'ai'"
            )
            print(f"  packages: {deleted_pkg}")
            deleted_cat = await conn.execute(
                "DELETE FROM pr_package_categories WHERE category_id LIKE 'ai-%'"
            )
            print(f"  categories: {deleted_cat}")

            print("\n→ Inserting AI categories")
            for cat in CATEGORIES:
                await conn.execute(
                    """
                    INSERT INTO pr_package_categories (category_id, title, badges, display_order)
                    VALUES ($1, $2, $3::jsonb, $4)
                    """,
                    cat["category_id"],
                    cat["title"],
                    json.dumps(cat["badges"]),
                    cat["display_order"],
                )
                print(f"  ✓ {cat['category_id']}  {cat['title']}")

            print("\n→ Inserting AI packages")
            for pkg in PACKAGES:
                await conn.execute(
                    """
                    INSERT INTO pr_packages (
                        slug, name, price, badge, description,
                        guaranteed_publications, category_id, category_order, display_order,
                        media_logos, features, audience, status
                    ) VALUES (
                        $1, $2, $3, $4, $5,
                        $6, $7, $8, $9,
                        $10::jsonb, $11::jsonb, 'ai', 'active'
                    )
                    """,
                    pkg["slug"],
                    pkg["name"],
                    pkg["price"],
                    pkg["badge"],
                    pkg["description"],
                    pkg["guaranteed_publications"],
                    pkg["category_id"],
                    pkg["category_order"],
                    pkg["display_order"],
                    json.dumps(pkg["media_logos"]),
                    json.dumps(pkg["features"]),
                )
                print(f"  ✓ [{pkg['category_id']}] {pkg['name']} {pkg['price']}")

        print("\n✓ AI packages reseeded: 3 categories × 3 cards = 9 packages")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
