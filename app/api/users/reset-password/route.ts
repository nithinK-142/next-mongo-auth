import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Connect } from "@/database/config";
import User from "@/models/user";
import ResetToken from "@/models/token";
import { decryptId } from "@/utils/crypto";

Connect();
export async function POST(req: NextRequest) {
  try {
    const { tokenId, password } = await req.json();

    if (!tokenId || !password) {
      return NextResponse.json({
        error: "Invalid or expired token",
        status: 400,
      });
    }

    const decryptedTokenId = tokenId;
    // const decryptedTokenId = decryptId(tokenId);

    const resetToken = await ResetToken.findOne({ _id: decryptedTokenId });
    if (!resetToken) {
      return NextResponse.json({
        error: "Invalid or expired token",
        status: 400,
      });
    }

    const tokenVerified = await ResetToken.findOne(
      { _id: decryptedTokenId },
      { tokenVerified: true }
    );

    if (!tokenVerified) {
      return NextResponse.json({ error: "Email not verified", status: 400 });
    }

    const user = await User.findOne({ _id: resetToken.user });

    if (!user) {
      return NextResponse.json({ error: "User not found", status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    await ResetToken.deleteOne({ _id: decryptedTokenId });

    return NextResponse.json({
      message: "Password reset successful",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
