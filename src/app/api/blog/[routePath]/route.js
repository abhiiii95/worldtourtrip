import dbConnect from "@/lib/mongodb";
import blogModel from "@/models/blogModel";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { routePath } = await params; // no await here
  try {
    await dbConnect();

    const data = await blogModel
      .findOne({ routPath: routePath })
      .populate("author", "-_id authorName authorDes")
      .populate("category", "-_id categoryName")
      .populate("content", "-_id content");

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching detail blogs:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch detail blog",
      },
      { status: 500 },
    );
  }
}
