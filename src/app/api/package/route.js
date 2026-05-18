import dbConnect from "@/lib/mongodb";
import Package from "@/models/Package";
import { NextResponse } from "next/server";

// GET /api/package — list all active packages
// Query params: destination, category, minPrice, maxPrice, minDays, maxDays, popular, limit
export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const filter = { isActive: true };

    const destination = searchParams.get("destination");
    if (destination) filter.destinationSlug = destination.toLowerCase();

    const category = searchParams.get("category");
    if (category && category !== "All") filter.category = category;

    const popular = searchParams.get("popular");
    if (popular === "true") filter.isPopular = true;

    const minPrice = Number(searchParams.get("minPrice"));
    const maxPrice = Number(searchParams.get("maxPrice"));
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    const minDays = Number(searchParams.get("minDays"));
    const maxDays = Number(searchParams.get("maxDays"));
    if (minDays || maxDays) {
      filter.duration = {};
      if (minDays) filter.duration.$gte = minDays;
      if (maxDays) filter.duration.$lte = maxDays;
    }

    const limit = Number(searchParams.get("limit")) || 0;

    let query = Package.find(filter, {
      title: 1, slug: 1, subtitle: 1, description: 1, location: 1,
      destination: 1, destinationSlug: 1, category: 1, duration: 1,
      nights: 1, groupSize: 1, price: 1, margin: 1, originalPrice: 1, thumbnail: 1,
      highlights: 1, rating: 1, reviews: 1, badge: 1, isPopular: 1,
    }).sort({ isPopular: -1, createdAt: -1 });

    if (limit > 0) query = query.limit(limit);

    const packages = await query;

    return NextResponse.json({ success: true, data: packages }, { status: 200 });
  } catch (error) {
    console.error("Package GET error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch packages" }, { status: 500 });
  }
}

// POST /api/package — create a new package (admin)
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const { title, slug, destination, duration, price } = body;
    if (!title || !slug || !destination || !duration || !price) {
      return NextResponse.json(
        { success: false, message: "title, slug, destination, duration and price are required." },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existing = await Package.findOne({ slug: slug.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "A package with this slug already exists." },
        { status: 409 }
      );
    }

    const pkg = await Package.create({ ...body, slug: slug.toLowerCase() });
    return NextResponse.json({ success: true, data: pkg }, { status: 201 });
  } catch (error) {
    console.error("Package POST error:", error);
    return NextResponse.json({ success: false, message: "Failed to create package" }, { status: 500 });
  }
}
