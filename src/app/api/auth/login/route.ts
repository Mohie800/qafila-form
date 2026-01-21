import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, setAuthCookie } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = adminLoginSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.issues;
      return NextResponse.json(
        { success: false, error: errors[0]?.message || "Validation failed" },
        { status: 400 },
      );
    }

    const { username, password } = result.data;

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 },
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, admin.password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 },
      );
    }

    // Set auth cookie
    await setAuthCookie({
      adminId: admin.id,
      username: admin.username,
    });

    return NextResponse.json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to login" },
      { status: 500 },
    );
  }
}
