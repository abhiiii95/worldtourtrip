import dbConnect from "@/lib/mongodb";
import Destination from "@/models/Destination";
import Faq from "@/models/Faq";
import Package from "@/models/Package";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { routePath } = params;

    const [destinations, faq, packages] = await Promise.all([
      Destination.findOne({ routPath: routePath }),
      Faq.findOne({ slug: routePath }).lean(),
      Package.find(
        { destinationSlug: routePath.toLowerCase(), isActive: true },
        { title: 1, slug: 1, subtitle: 1, location: 1, destination: 1, category: 1,
          duration: 1, price: 1, originalPrice: 1, thumbnail: 1, highlights: 1,
          rating: 1, reviews: 1, badge: 1, isPopular: 1 }
      ).sort({ isPopular: -1, createdAt: -1 }),
    ]);

    return new Response(JSON.stringify({ destinations, faq, packages }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch destinations:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch destinations" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
