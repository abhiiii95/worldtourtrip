import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/upload
// Accepts either:
//   multipart/form-data  { file, folder }  — direct file upload
//   application/json     { url, folder }   — upload from external URL (e.g. Unsplash)
export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // ── URL-based upload (Unsplash → Cloudinary) ──────────────────────────────
    if (contentType.includes("application/json")) {
      const { url, folder = "packages" } = await request.json();
      if (!url) {
        return NextResponse.json({ success: false, message: "No URL provided." }, { status: 400 });
      }

      const result = await cloudinary.uploader.upload(url, {
        folder,
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      });

      return NextResponse.json({
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
      });
    }

    // ── File upload (multipart) ───────────────────────────────────────────────
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "packages";

    if (!file) {
      return NextResponse.json({ success: false, message: "No file provided." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Upload failed." },
      { status: 500 }
    );
  }
}

// DELETE /api/upload
// Body: { public_id: "packages/abc123" }
export async function DELETE(request) {
  try {
    const { public_id } = await request.json();
    if (!public_id) {
      return NextResponse.json({ success: false, message: "public_id required." }, { status: 400 });
    }

    await cloudinary.uploader.destroy(public_id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ success: false, message: "Delete failed." }, { status: 500 });
  }
}
