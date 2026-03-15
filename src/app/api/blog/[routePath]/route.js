import dbConnect from "@/lib/mongodb";
import Faq from "@/models/Faq";
import blogModel from "@/models/blogModel";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { routePath } = params;

  try {
    await dbConnect();

    const [data, faq] = await Promise.all([
      blogModel
      .findOne({ routPath: routePath })
      .populate("author", "-_id authorName authorDes")
      .populate("category", "-_id categoryName")
      .populate("content", "-_id content"),

      Faq.findOne({ slug: routePath }).lean(),
    ]);

    return NextResponse.json(
      {
        success: true,
        data,
        faq,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching detail blogs:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch detail blog",
        error: error.message,
      },
      { status: 500 }
    );
  }
}