// import dbConnect from "@/lib/mongodb";
// import Subscriber from "@/models/Subscriber.";
// import { NextResponse } from "next/server";
// // import connectDB from "@/lib/mongodb";
// // import Subscriber from "@/models/Subscriber.model";

// export async function POST(req) {
//   try {
//     const { email } = await req.json();

//     // Basic validation
//     if (!email || !email.includes("@")) {
//       return NextResponse.json(
//         { status: false, message: "Valid email is required." },
//         { status: 400 },
//       );
//     }

//     await dbConnect();

//     const existing = await Subscriber.findOne({ email });
//     if (existing) {
//       return NextResponse.json(
//         { status: false, message: "This email is already subscribed." },
//         { status: 409 },
//       );
//     }

//     await Subscriber.create({ email });

//     return NextResponse.json(
//       { status: true, message: "Subscribed successfully!" },
//       { status: 201 },
//     );
//   } catch (error) {
//     console.error("Subscribe error:", error);
//     return NextResponse.json(
//       { status: false, message: "Something went wrong. Please try again." },
//       { status: 500 },
//     );
//   }
// }
import dbConnect from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber.";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { status: false, message: "Valid email is required." },
        { status: 400, headers: corsHeaders }
      );
    }

    await dbConnect();

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { status: false, message: "This email is already subscribed." },
        { status: 409, headers: corsHeaders }
      );
    }

    await Subscriber.create({ email });

    return NextResponse.json(
      { status: true, message: "Subscribed successfully!" },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json(
      { status: false, message: "Something went wrong. Please try again." },
      { status: 500, headers: corsHeaders }
    );
  }
}