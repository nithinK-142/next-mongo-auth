import ResetToken from "@/models/token";
import User from "@/models/user";
import { Connect } from "@/database/config";
import { NextRequest, NextResponse } from "next/server";

Connect();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { message: "Enter your email again!" },
        { status: 401 }
      );
    }

    const resetToken = await ResetToken.findOne({ token });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const user = await User.findById(resetToken.user);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }

    await ResetToken.updateOne(
      { token: resetToken.token },
      { $set: { token: "", tokenVerified: true } }
    );

    return NextResponse.json(
      { message: "Token verified successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
