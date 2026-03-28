import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { firstName, lastName, email, comment } = body;

    // Basic validation
    if (!firstName || !lastName || !email || !comment) {
      return NextResponse.json(
        { status: false, message: "All fields are required." },
        { status: 400 },
      );
    }

    const newContact = await Contact.create({
      firstName,
      lastName,
      email,
      comment,
    });

    return NextResponse.json(
      {
        status: true,
        message: "Your message has been submitted successfully!",
        data: newContact,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Contact API Error:", error);
    return NextResponse.json(
      { status: false, message: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

// GET /api/contact  (optional – list all submissions, e.g. for admin)
export async function GET() {
  try {
    await dbConnect();

    const contacts = await Contact.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ status: true, data: contacts }, { status: 200 });
  } catch (error) {
    console.error("Contact GET Error:", error);
    return NextResponse.json(
      { status: false, data: [], message: "Failed to fetch contacts." },
      { status: 500 },
    );
  }
}
