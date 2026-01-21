import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import prisma from "@/lib/prisma";
import {
  generateFileName,
  isValidImageType,
  isValidPdfType,
} from "@/lib/utils";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

async function ensureUploadDirs() {
  const dirs = [
    "logos",
    "bank-details",
    "commercial-registers",
    "return-policies",
  ];
  for (const dir of dirs) {
    const fullPath = path.join(UPLOAD_DIR, dir);
    if (!existsSync(fullPath)) {
      await mkdir(fullPath, { recursive: true });
    }
  }
}

async function saveFile(file: File, subDir: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = generateFileName(file.name);
  const filePath = path.join(UPLOAD_DIR, subDir, fileName);

  await writeFile(filePath, buffer);

  return `/${subDir}/${fileName}`;
}

export async function POST(request: NextRequest) {
  try {
    await ensureUploadDirs();

    const formData = await request.formData();

    // Get text fields
    const designerName = formData.get("designerName") as string;
    const email = formData.get("email") as string;
    const city = formData.get("city") as string;
    const category = formData.get("category") as string;
    const brandName = formData.get("brandName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const storeLink = (formData.get("storeLink") as string) || null;
    const brandStory = formData.get("brandStory") as string;
    const fulfillmentMethod = formData.get("fulfillmentMethod") as string;
    const stockAvailability = formData.get("stockAvailability") as string;
    const branchCount =
      parseInt(formData.get("branchCount") as string, 10) || 0;

    // Validate required fields
    if (
      !designerName ||
      !email ||
      !city ||
      !category ||
      !brandName ||
      !phoneNumber ||
      !brandStory ||
      !fulfillmentMethod ||
      !stockAvailability
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Get files
    const logoFile = formData.get("logo") as File;
    const bankDetailsFile = formData.get("bankDetails") as File;
    const commercialRegFile = formData.get("commercialRegister") as File;
    const returnPolicyFile = formData.get("returnPolicy") as File | null;

    // Validate required files
    if (!logoFile || !bankDetailsFile || !commercialRegFile) {
      return NextResponse.json(
        { success: false, error: "Missing required files" },
        { status: 400 },
      );
    }

    // Validate file types
    if (!isValidImageType(logoFile.name)) {
      return NextResponse.json(
        { success: false, error: "Invalid logo file type" },
        { status: 400 },
      );
    }

    if (
      !isValidPdfType(bankDetailsFile.name) ||
      !isValidPdfType(commercialRegFile.name)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Bank details and commercial register must be PDF files",
        },
        { status: 400 },
      );
    }

    if (returnPolicyFile && !isValidPdfType(returnPolicyFile.name)) {
      return NextResponse.json(
        { success: false, error: "Return policy must be a PDF file" },
        { status: 400 },
      );
    }

    // Save files
    const logoPath = await saveFile(logoFile, "logos");
    const bankDetailsPdf = await saveFile(bankDetailsFile, "bank-details");
    const commercialRegPdf = await saveFile(
      commercialRegFile,
      "commercial-registers",
    );
    const returnPolicyPdf = returnPolicyFile
      ? await saveFile(returnPolicyFile, "return-policies")
      : null;

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        designerName,
        email,
        city,
        category,
        brandName,
        phoneNumber,
        storeLink,
        brandStory,
        logoPath,
        bankDetailsPdf,
        fulfillmentMethod,
        stockAvailability,
        commercialRegPdf,
        returnPolicyPdf,
        branchCount,
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: submission.id },
      message: "Submission created successfully",
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create submission" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const { getAuthFromCookie } = await import("@/lib/auth");
    const auth = await getAuthFromCookie();

    if (!auth) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { designerName: { contains: search, mode: "insensitive" } },
        { brandName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.submission.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: submissions,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error("Get submissions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get submissions" },
      { status: 500 },
    );
  }
}
