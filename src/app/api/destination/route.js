import dbConnect from "@/lib/mongodb";
import Destination from "@/models/Destination";

export async function GET(request) {
  try {
    await dbConnect();

    // const { searchParams } = new URL(request.url);
    // const page = Number(searchParams.get("page")) || 1;
    // const limit = Number(searchParams.get("limit")) || 12;

    const destinations = await Destination.find(
      {},
      "routPath title thumbnail description imgageAlt updatedAt",
    ).sort({ createdAt: -1 });
    console.log(destinations,"destinations backend")
    // .skip((page - 1) * limit)
    // .limit(limit);
    // .limit(limit);

    // const total = await BlogPage.countDocuments({});
    // const hasMore = page * limit < total;

    return new Response(JSON.stringify({ destinations }), {
      // return new Response(JSON.stringify({ blogs, hasMore }), {
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