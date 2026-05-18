import dbConnect from "@/lib/mongodb";
import Package from "@/models/Package";
import { NextResponse } from "next/server";

// GET /api/package/[slug]
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;

    const pkg = await Package.findOne({ slug: slug.toLowerCase(), isActive: true });
    if (!pkg) {
      return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: pkg }, { status: 200 });
  } catch (error) {
    console.error("Package GET [slug] error:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch package" }, { status: 500 });
  }
}

// PUT /api/package/[slug] — update (admin)
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;
    const body = await request.json();

    const currentSlug = slug.toLowerCase();

    // Strip fields MongoDB will reject or that must not be overwritten
    const { _id, __v, createdAt, updatedAt, id, ...updateFields } = body;

    const incomingSlug = updateFields.slug?.toLowerCase().trim();

    if (!incomingSlug || incomingSlug === currentSlug) {
      // Slug not changing — exclude it from the update entirely
      // so MongoDB never checks the unique index for this field
      delete updateFields.slug;
    } else {
      // Slug is changing — make sure no other package has it
      // (incomingSlug !== currentSlug, so any match is a different document)
      const conflict = await Package.findOne({ slug: incomingSlug });
      if (conflict) {
        return NextResponse.json(
          { success: false, message: `Slug "${incomingSlug}" is already taken by another package.` },
          { status: 409 }
        );
      }
      updateFields.slug = incomingSlug;
    }

    const pkg = await Package.findOneAndUpdate(
      { slug: currentSlug },
      { $set: { ...updateFields, updatedAt: new Date() } },
      { new: true }
    );

    if (!pkg) {
      return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: pkg }, { status: 200 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Slug conflict — please use a different slug." },
        { status: 409 }
      );
    }
    console.error("Package PUT error:", error);
    return NextResponse.json({ success: false, message: "Failed to update package" }, { status: 500 });
  }
}

// DELETE /api/package/[slug] — soft delete (admin)
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { slug } = await params;

    const pkg = await Package.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      { isActive: false },
      { new: true }
    );

    if (!pkg) {
      return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Package deleted" }, { status: 200 });
  } catch (error) {
    console.error("Package DELETE error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete package" }, { status: 500 });
  }
}
