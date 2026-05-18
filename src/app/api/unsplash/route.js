import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();
  const count = Math.min(parseInt(searchParams.get("count") || "8", 10), 20);

  if (!query) {
    return NextResponse.json({ success: false, message: "Query is required" }, { status: 400 });
  }

  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key || key === "your_unsplash_access_key_here") {
    return NextResponse.json({ success: false, message: "Unsplash API key not configured" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&content_filter=high`,
      {
        headers: { Authorization: `Client-ID ${key}` },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ success: false, message: "Unsplash API error" }, { status: res.status });
    }

    const data = await res.json();

    const images = (data.results || []).map((photo) => ({
      url: photo.urls.regular,
      thumb: photo.urls.small,
      alt: photo.alt_description || query,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    }));

    return NextResponse.json({ success: true, images, total: data.total });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch images" }, { status: 500 });
  }
}
