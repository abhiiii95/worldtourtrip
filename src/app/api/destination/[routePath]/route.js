import dbConnect from "@/lib/mongodb";
import Destination from "@/models/Destination";
import Faq from "@/models/Faq";

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { routePath } = params;

    const [destinations, faq] = await Promise.all([
      Destination.findOne({ routPath: routePath }),

      Faq.findOne({ slug: routePath }).lean(),
    ]);

    return new Response(JSON.stringify({ destinations, faq }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to fetch destinations:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch destinations" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
