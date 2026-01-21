import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { getAuthFromCookie } from "@/lib/auth";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

const MIME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  svg: "image/svg+xml",
  webp: "image/webp",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    // Check authentication
    const auth = await getAuthFromCookie();

    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { path: pathSegments } = await params;
    const filePath = path.join(UPLOAD_DIR, ...pathSegments);

    // Security check - prevent directory traversal
    const resolvedPath = path.resolve(filePath);
    const resolvedUploadDir = path.resolve(UPLOAD_DIR);

    if (!resolvedPath.startsWith(resolvedUploadDir)) {
      return NextResponse.json(
        { success: false, error: "Invalid path" },
        { status: 400 },
      );
    }

    if (!existsSync(resolvedPath)) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404 },
      );
    }

    const fileBuffer = await readFile(resolvedPath);
    const ext = path.extname(resolvedPath).slice(1).toLowerCase();
    const mimeType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `inline; filename="${path.basename(resolvedPath)}"`,
      },
    });
  } catch (error) {
    console.error("File serve error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to serve file" },
      { status: 500 },
    );
  }
}
