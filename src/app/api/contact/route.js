import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function buildEmailHtml({ firstName, lastName, phone, email, destination, travelDate, travelers, comment, source }) {
  const row = (label, value) =>
    value
      ? `<tr><td style="padding:8px 12px;font-weight:600;color:#64748b;white-space:nowrap;width:140px">${label}</td><td style="padding:8px 12px;color:#1a1a2e">${value}</td></tr>`
      : "";

  return `
  <div style="font-family:'Segoe UI',sans-serif;max-width:560px;margin:0 auto;background:#f9f7f4;padding:24px">
    <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
      <div style="background:linear-gradient(135deg,#1a3c6e,#2563eb);padding:24px 28px">
        <h2 style="margin:0;color:#fff;font-size:1.2rem">🧳 New Enquiry — World Tour Trip</h2>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:0.85rem">Submitted via: <strong>${source || "website"}</strong></p>
      </div>
      <table style="width:100%;border-collapse:collapse;margin:0">
        <tbody>
          ${row("Name", [firstName, lastName].filter(Boolean).join(" "))}
          ${row("Phone", phone)}
          ${row("Email", email)}
          ${row("Destination", destination)}
          ${row("Travel Date", travelDate)}
          ${row("Travelers", travelers)}
          ${row("Message", comment)}
        </tbody>
      </table>
      <div style="padding:16px 28px;background:#f1f5f9;font-size:0.78rem;color:#94a3b8;text-align:center">
        World Tour Trip &mdash; Lead Notification
      </div>
    </div>
  </div>`;
}

async function sendLeadEmail(data) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to   = process.env.NOTIFY_EMAIL;

  if (!user || !pass || pass === "your_gmail_app_password_here") return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"World Tour Trip" <${user}>`,
    to,
    subject: `New Lead: ${data.firstName} — ${data.destination || data.source || "Enquiry"}`,
    html: buildEmailHtml(data),
  });
}

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { firstName, phone, lastName, email, destination, travelDate, travelers, comment, source } = body;

    if (!firstName || !phone) {
      return NextResponse.json(
        { status: false, message: "Name and phone number are required." },
        { status: 400 },
      );
    }

    const newContact = await Contact.create({
      firstName,
      lastName: lastName || "",
      email: email || "",
      phone,
      destination: destination || "",
      travelDate: travelDate || "",
      travelers: travelers || "",
      comment: comment || "",
      source: source || "contact",
    });

    // Send email notification (non-blocking — don't fail the request if email fails)
    sendLeadEmail({ firstName, lastName, phone, email, destination, travelDate, travelers, comment, source })
      .catch((err) => console.error("Lead email error:", err));

    return NextResponse.json(
      { status: true, message: "Your message has been submitted successfully!", data: newContact },
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
