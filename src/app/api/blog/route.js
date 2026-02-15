import dbConnect from "@/lib/mongodb";
import blogModel from "@/models/blogModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const data = await blogModel
      .find(
        {},
        {
          _id: 0,
          title: 1,
          imgageAlt: 1,
          description: 1,
          routPath: 1,
          thumbnail: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      )
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching blogs:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blogs",
      },
      { status: 500 },
    );
  }
}
