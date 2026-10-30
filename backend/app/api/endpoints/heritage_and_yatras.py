"""Heritage Explorer and Personal Yatra Planner API Endpoints – Phase 5."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.schemas.phase5 import (
    HeritageLocationBase,
    HeritageStoryBase,
    SuggestedYatraTemplateBase,
    YatraItineraryBase,
    YatraStopBase,
)
from app.data.demo_phase5 import (
    DEMO_HERITAGE_LOCATIONS,
    DEMO_HERITAGE_STORIES,
    DEMO_SUGGESTED_YATRAS,
)

heritage_router = APIRouter(prefix="/heritage", tags=["Heritage Explorer"])
yatras_router = APIRouter(prefix="/yatras", tags=["Personal Yatra Planner"])

# In-memory storage for guest/custom itineraries during session
IN_MEMORY_YATRAS: List[dict] = []


# ─── Heritage Endpoints ───

@heritage_router.get("", response_model=List[HeritageLocationBase])
async def list_heritage_locations(
    category: Optional[str] = Query(None, description="Category filter"),
    search: Optional[str] = Query(None, description="Search term in name or description"),
):
    results = DEMO_HERITAGE_LOCATIONS
    if category and category != "all":
        results = [h for h in results if h.get("category") == category]
    if search:
        s = search.lower()
        results = [
            h
            for h in results
            if s in h.get("nameEn", "").lower()
            or s in h.get("nameTe", "").lower()
            or s in h.get("shortDescEn", "").lower()
            or s in h.get("shortDescTe", "").lower()
        ]
    return results


@heritage_router.get("/featured", response_model=List[HeritageLocationBase])
async def get_featured_heritage():
    return [h for h in DEMO_HERITAGE_LOCATIONS if h.get("isFeatured")]


@heritage_router.get("/categories")
async def get_heritage_categories():
    return [
        {"key": "ancient_temple", "labelEn": "Ancient Temples", "labelTe": "పురాతన ఆలయాలు"},
        {"key": "spiritual_place", "labelEn": "Spiritual Places", "labelTe": "ఆధ్యాత్మిక క్షేత్రాలు"},
        {"key": "historical_place", "labelEn": "Historical Places", "labelTe": "చారిత్రక ప్రదేశాలు"},
        {"key": "cultural_heritage", "labelEn": "Cultural Heritage", "labelTe": "సాంస్కృతిక వారసత్వం"},
        {"key": "river_heritage", "labelEn": "Godavari River Heritage", "labelTe": "గోదావరి నదీ వారసత్వం"},
        {"key": "sacred_ghat", "labelEn": "Sacred Ghats", "labelTe": "పవిత్ర ఘాట్లు"},
        {"key": "festivals_traditions", "labelEn": "Festivals & Traditions", "labelTe": "ఉత్సవాలు & సాంప్రదాయం"},
    ]


@heritage_router.get("/stories", response_model=List[HeritageStoryBase])
async def list_heritage_stories():
    return DEMO_HERITAGE_STORIES


@heritage_router.get("/stories/{slug}", response_model=HeritageStoryBase)
async def get_heritage_story(slug: str):
    for story in DEMO_HERITAGE_STORIES:
        if story["slug"] == slug or story["id"] == slug:
            return story
    raise HTTPException(status_code=404, detail="Story not found")


@heritage_router.get("/{slug}", response_model=HeritageLocationBase)
async def get_heritage_location(slug: str):
    for loc in DEMO_HERITAGE_LOCATIONS:
        if loc["slug"] == slug or loc["id"] == slug:
            return loc
    raise HTTPException(status_code=404, detail="Heritage location not found")


# ─── Yatra Planner Endpoints ───

@yatras_router.get("/templates", response_model=List[SuggestedYatraTemplateBase])
async def list_yatra_templates():
    return DEMO_SUGGESTED_YATRAS


@yatras_router.get("", response_model=List[YatraItineraryBase])
async def list_user_yatras():
    return IN_MEMORY_YATRAS


@yatras_router.get("/{itinerary_id}", response_model=YatraItineraryBase)
async def get_yatra_itinerary(itinerary_id: str):
    # Check custom yatras first
    for y in IN_MEMORY_YATRAS:
        if y["id"] == itinerary_id:
            return y
    # Check templates
    for t in DEMO_SUGGESTED_YATRAS:
        if t["id"] == itinerary_id or t["slug"] == itinerary_id:
            return {
                "id": t["id"],
                "title": t["titleEn"],
                "description": t["descEn"],
                "startDate": "2027-07-15",
                "startingLocation": "Rajahmundry",
                "preferences": {"categories": ["ghat", "temple", "heritage"], "pace": "moderate"},
                "stops": t["stops"],
                "totalDurationHours": 8.0,
                "isTemplate": True,
                "isDemo": True,
            }
    raise HTTPException(status_code=404, detail="Itinerary not found")


@yatras_router.post("", response_model=YatraItineraryBase)
async def create_or_save_yatra(itinerary: YatraItineraryBase):
    data = itinerary.model_dump()
    for idx, existing in enumerate(IN_MEMORY_YATRAS):
        if existing["id"] == data["id"]:
            IN_MEMORY_YATRAS[idx] = data
            return data
    IN_MEMORY_YATRAS.insert(0, data)
    return data


@yatras_router.delete("/{itinerary_id}")
async def delete_yatra(itinerary_id: str):
    global IN_MEMORY_YATRAS
    IN_MEMORY_YATRAS = [y for y in IN_MEMORY_YATRAS if y["id"] != itinerary_id]
    return {"status": "success", "message": "Itinerary deleted"}


@yatras_router.get("/recommendations")
async def get_recommendations(
    category: Optional[str] = None,
    duration: Optional[str] = "one_day",
):
    recommendations = []
    for loc in DEMO_HERITAGE_LOCATIONS:
        if not category or loc["category"] == category:
            recommendations.append({
                "id": loc["id"],
                "titleTe": loc["nameTe"],
                "titleEn": loc["nameEn"],
                "type": "heritage",
                "imageUrl": loc["imageUrl"],
                "coordinates": loc["coordinates"],
            })
    return {"recommendedCount": len(recommendations), "destinations": recommendations[:4]}
