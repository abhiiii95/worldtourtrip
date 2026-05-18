import { NextResponse } from "next/server";

const getPdfParse = () => import("pdf-parse/lib/pdf-parse.js").then((m) => m.default);

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const SYSTEM_PROMPT = `You are a travel package data extractor. Given raw text from a travel package PDF/brochure, extract ALL relevant information and return ONLY a valid JSON object with this exact structure (no markdown, no explanation, just raw JSON):

{
  "title": "Full package title",
  "subtitle": "e.g. 5 Nights / 6 Days",
  "description": "Short 2-3 sentence description of the package",
  "destination": "Main destination name e.g. Ladakh, Kerala, Goa",
  "destinationSlug": "lowercase-hyphenated e.g. leh-ladakh",
  "location": "Specific places e.g. Leh • Nubra • Pangong",
  "category": "One of: Adventure, Leisure, Beach, Heritage, Honeymoon, Wildlife, Pilgrimage, Other",
  "duration": 6,
  "nights": 5,
  "groupSize": "e.g. 2-12 People",
  "price": 9999,
  "originalPrice": null,
  "badge": null,
  "highlights": ["highlight 1", "highlight 2"],
  "included": ["item 1", "item 2"],
  "excluded": ["item 1", "item 2"],
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "description": "Full description of what happens this day",
      "activities": ["activity 1", "activity 2"]
    }
  ],
  "hotelOptions": [
    {
      "optionName": "Option 1",
      "starCategory": "2 Star Deluxe",
      "hotels": [
        { "location": "Leh", "nights": 3, "name": "Hotel name / Similar" },
        { "location": "Nubra", "nights": 1, "name": "Hotel name / Similar" },
        { "location": "Pangong", "nights": 1, "name": "Hotel name / Similar" }
      ],
      "prices": [
        { "pax": 12, "pricePerPerson": 9999 },
        { "pax": 10, "pricePerPerson": 10799 },
        { "pax": 8, "pricePerPerson": 11699 },
        { "pax": 6, "pricePerPerson": 11299 },
        { "pax": 4, "pricePerPerson": 13499 },
        { "pax": 2, "pricePerPerson": 19999 }
      ]
    }
  ]
}

Rules:
- Extract ALL hotel option blocks (Option 1, Option 2, Option 3 etc) with star categories, hotel names per location, and all per-pax pricing
- price must be the LOWEST per-person price found across all options (number in INR)
- originalPrice: null unless explicitly stated as a crossed-out/MRP price
- included: extract from "Package Inclusions" or "Inclusions" section
- excluded: extract from "Package Cost Exclusions" or "Exclusions" section
- itinerary: all days with full descriptions and activities lists
- duration and nights must be numbers, not strings
- destinationSlug must be lowercase with hyphens only
- category must be exactly one of the allowed values
- If a field not found: null for strings, 0 for numbers, [] for arrays
- Return ONLY the JSON, nothing else`;

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, message: "GEMINI_API_KEY not configured." }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get("pdf");

    if (!file) {
      return NextResponse.json({ success: false, message: "No PDF file provided." }, { status: 400 });
    }
    if (!file.type.includes("pdf")) {
      return NextResponse.json({ success: false, message: "File must be a PDF." }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, message: "PDF must be under 10MB." }, { status: 400 });
    }

    // Extract text
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    let pdfText = "";
    try {
      const pdfParse = await getPdfParse();
      const pdfData = await pdfParse(buffer);
      pdfText = pdfData.text?.trim() || "";
    } catch {
      return NextResponse.json(
        { success: false, message: "Could not read PDF. Make sure it contains selectable text (not a scanned image)." },
        { status: 422 }
      );
    }

    if (!pdfText || pdfText.length < 50) {
      return NextResponse.json(
        { success: false, message: "PDF appears empty or image-only. Use a PDF with selectable text." },
        { status: 422 }
      );
    }

    const truncatedText = pdfText.slice(0, 12000);

    // Call Gemini
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\n--- PDF TEXT START ---\n${truncatedText}\n--- PDF TEXT END ---` }] }],
        generationConfig: { temperature: 0.1, topK: 1, topP: 0.95, maxOutputTokens: 8192 },
      }),
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      let errMsg = "Gemini API error.";
      try { errMsg = JSON.parse(errBody)?.error?.message || errMsg; } catch {}
      return NextResponse.json({ success: false, message: errMsg }, { status: 502 });
    }

    const geminiData = await geminiRes.json();
    const parts = geminiData?.candidates?.[0]?.content?.parts || [];
    const rawText = parts.find((p) => !p.thought)?.text || parts[parts.length - 1]?.text || "";
    const cleaned = rawText.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

    let extracted;
    try {
      extracted = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { success: false, message: "AI could not parse the PDF content. Try a cleaner or more structured PDF.", raw: rawText.slice(0, 400) },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: extracted }, { status: 200 });
  } catch (error) {
    console.error("convert-pdf error:", error);
    return NextResponse.json({ success: false, message: error.message || "Something went wrong." }, { status: 500 });
  }
}
