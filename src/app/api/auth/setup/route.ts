import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, setAuthCookie } from "@/lib/auth";
import { adminSetupSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findFirst();

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin account already exists" },
        { status: 400 },
      );
    }

    const body = await request.json();

    // Validate input
    const result = adminSetupSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues;
      return NextResponse.json(
        { success: false, error: errors[0]?.message || "Validation failed" },
        { status: 400 },
      );
    }

    const { username, password } = result.data;

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Set auth cookie
    await setAuthCookie({
      adminId: admin.id,
      username: admin.username,
    });

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
    });
  } catch (error) {
    console.error("Admin setup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create admin account" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const adminCount = await prisma.admin.count();

    return NextResponse.json({
      success: true,
      data: { setupRequired: adminCount === 0 },
    });
  } catch (error) {
    console.error("Check admin setup error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check admin setup" },
      { status: 500 },
    );
  }
}
