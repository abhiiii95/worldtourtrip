import { NextResponse } from "next/server";

// pdf-parse needs to be imported this way to avoid Next.js edge runtime issues
const getPdfParse = () => import("pdf-parse/lib/pdf-parse.js").then((m) => m.default);

// gemini-2.5-flash is the current recommended free-tier model
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

// The prompt tells Gemini exactly what JSON shape to return
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
  "badge": "e.g. Best Seller or null",
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
      "starCategory": "2Star Deluxe",
      "hotels": [
        { "location": "Leh", "nights": 3, "name": "SHANTI HOME / Nima's Villa / Similar" },
        { "location": "Nubra", "nights": 1, "name": "Guest House / Camp / Similar" },
        { "location": "Pangong", "nights": 1, "name": "Guest House / Cottage / Similar" }
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
- duration and nights must be numbers, not strings
- price must be the LOWEST per-person price found across all hotel options and pax sizes (the starting price). Must be a number in INR.
- originalPrice: use null if not explicitly stated as a crossed-out / MRP price
- All prices must be numbers in INR. If price is in USD multiply by 84. Never use strings for prices.
- hotelOptions: extract EVERY Option block from the PDF (Option 1, Option 2, Option 3 etc). Each option has a star category, hotel names per location, and per-pax pricing. If no hotel options found, use [].
- For each hotel option, include ALL pax/price combinations found (e.g. 2 pax, 4 pax, 6 pax, 8 pax, 10 pax, 12 pax).
- included: extract from "Package Inclusions" or "Cost Inclusions" section
- excluded: extract from "Package Cost Exclusions" or "Exclusions" section
- itinerary: extract from "Day Wise Tour Itinerary" or "Tour Itinerary" section with full descriptions
- If a field is not found, use null for strings, 0 for numbers, [] for arrays
- destinationSlug must be lowercase with hyphens only
- category must be exactly one of the allowed values
- Return ONLY the JSON, nothing else`;

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "GEMINI_API_KEY not configured in .env.local" },
        { status: 500 }
      );
    }

    // Get the uploaded PDF
    const formData = await request.formData();
    const file = formData.get("pdf");

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No PDF file provided." },
        { status: 400 }
      );
    }

    if (!file.type.includes("pdf")) {
      return NextResponse.json(
        { success: false, message: "File must be a PDF." },
        { status: 400 }
      );
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: "PDF must be under 10MB." },
        { status: 400 }
      );
    }

    // Extract text from PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let pdfText = "";
    try {
      const pdfParse = await getPdfParse();
      const pdfData = await pdfParse(buffer);
      pdfText = pdfData.text?.trim() || "";
    } catch (pdfErr) {
      console.error("PDF parse error:", pdfErr);
      return NextResponse.json(
        { success: false, message: "Could not read PDF. Make sure it contains selectable text (not a scanned image)." },
        { status: 422 }
      );
    }

    if (!pdfText || pdfText.length < 50) {
      return NextResponse.json(
        { success: false, message: "PDF appears to be empty or contains only images. Please use a PDF with selectable text." },
        { status: 422 }
      );
    }

    // Truncate to ~12000 chars to stay within Gemini token limits
    const truncatedText = pdfText.slice(0, 12000);

    // Call Gemini API
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\n--- PDF TEXT START ---\n${truncatedText}\n--- PDF TEXT END ---`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          topK: 1,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      console.error("Gemini API error:", errBody);

      // Parse the error for a cleaner message
      let errMsg = "Gemini API error.";
      try {
        const errJson = JSON.parse(errBody);
        errMsg = errJson?.error?.message || errMsg;
      } catch {}

      return NextResponse.json(
        { success: false, message: errMsg, detail: errBody.slice(0, 300) },
        { status: 502 }
      );
    }

    const geminiData = await geminiRes.json();

    // gemini-2.5-flash is a thinking model — response parts[0] is the hidden
    // thought, parts[1] (or whichever non-thought part exists) is the actual text.
    const parts = geminiData?.candidates?.[0]?.content?.parts || [];
    const rawText =
      parts.find((p) => !p.thought)?.text ||   // prefer non-thought part
      parts[parts.length - 1]?.text ||          // fallback: last part
      "";

    // Strip any markdown code fences Gemini might add despite instructions
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    let extracted;
    try {
      extracted = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse failed. Raw Gemini output:", rawText);
      return NextResponse.json(
        {
          success: false,
          message: "Gemini returned unexpected format. Try a cleaner PDF.",
          raw: rawText.slice(0, 500),
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: extracted }, { status: 200 });
  } catch (error) {
    console.error("parse-pdf error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Something went wrong." },
      { status: 500 }
    );
  }
}