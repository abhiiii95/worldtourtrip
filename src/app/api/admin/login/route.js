import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const validUser = process.env.ADMIN_USERNAME;
    const validPass = process.env.ADMIN_PASSWORD;

    if (!validUser || !validPass) {
      return NextResponse.json({ success: false, message: "Admin credentials not configured." }, { status: 500 });
    }

    if (username === validUser && password === validPass) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Invalid username or password." }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}
