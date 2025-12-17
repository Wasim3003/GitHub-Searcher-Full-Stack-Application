import requests
from django.core.cache import cache
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

GITHUB_BASE_URL = "https://api.github.com/search"


@api_view(["POST"])
def search_github(request):
    """
    POST body:
    {
        "query": "react",
        "type": "users" | "repositories"
    }
    """

    query = request.data.get("query")
    search_type = request.data.get("type")

    # -----------------------------
    # VALIDATION
    # -----------------------------
    if not query or not search_type:
        return Response(
            {"error": "query and type are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(query) < 3:
        return Response(
            {"error": "query must be at least 3 characters"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if search_type not in ["users", "repositories"]:
        return Response(
            {"error": "invalid search type"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    cache_key = f"github:{search_type}:{query}"

    # -----------------------------
    # REDIS CACHE (SAFE)
    # -----------------------------
    cached_data = None
    try:
        cached_data = cache.get(cache_key)
    except Exception as e:
        print("Redis GET error:", e)

    if cached_data:
        return Response(
            {
                "data": cached_data,
                "cached": True,
            },
            status=status.HTTP_200_OK,
        )

    # -----------------------------
    # GITHUB API CALL
    # -----------------------------
    url = f"{GITHUB_BASE_URL}/{search_type}"
    params = {"q": query}

    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "GitHub-Search-App",
    }

    try:
        response = requests.get(
            url,
            params=params,
            headers=headers,
            timeout=10,
        )
    except requests.exceptions.RequestException as e:
        return Response(
            {"error": "Failed to connect to GitHub API"},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    if response.status_code != 200:
        return Response(
            {
                "error": "GitHub API error",
                "github_status": response.status_code,
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )

    data = response.json()

    # -----------------------------
    # SAVE TO REDIS (SAFE)
    # -----------------------------
    try:
        cache.set(cache_key, data, timeout=60 * 60 * 2)  # 2 hours
    except Exception as e:
        print("Redis SET error:", e)

    return Response(
        {
            "data": data,
            "cached": False,
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def clear_cache(request):
    """
    Clears Redis cache
    """
    try:
        cache.clear()
        return Response(
            {"message": "Cache cleared successfully"},
            status=status.HTTP_200_OK,
        )
    except Exception:
        return Response(
            {"error": "Failed to clear cache"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
