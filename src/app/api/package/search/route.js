import dbConnect from "@/lib/mongodb";
import Package from "@/models/Package";
import { NextResponse } from "next/server";

// GET /api/package/search?q=rishikesh
// Returns matching packages for autocomplete + redirect logic
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    const regex = new RegExp(q, "i");

    const packages = await Package.find(
      {
        isActive: true,
        $or: [
          { title: regex },
          { destination: regex },
          { destinationSlug: regex },
          { location: regex },
          { category: regex },
        ],
      },
      { title: 1, slug: 1, destination: 1, destinationSlug: 1, thumbnail: 1, price: 1, duration: 1 }
    ).limit(8);

    return NextResponse.json({ success: true, data: packages }, { status: 200 });
  } catch (error) {
    console.error("Package search error:", error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}
