import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dbConnect from "@/database/config";
import User from "@/models/user";
import ResetToken from "@/models/token";
import { decryptId } from "@/utils/crypto";
import { cookies } from "next/headers";

dbConnect();

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Invalid password", status: 400 });
    }

    const encryptedTokenId = cookies().get("encryptedTokenId");

    if (encryptedTokenId === undefined) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const decryptedTokenId = decryptId(encryptedTokenId.value);

    const resetToken = await ResetToken.findOne({ _id: decryptedTokenId });
    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const tokenVerified = await ResetToken.findOne(
      { _id: decryptedTokenId },
      { tokenVerified: true }
    );

    if (!tokenVerified) {
      return NextResponse.json(
        { error: "Email not verified" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ _id: resetToken.user });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hashedPassword } }
    );

    await ResetToken.deleteOne({ _id: decryptedTokenId });

    cookies().delete("encryptedTokenId");

    return NextResponse.json(
      { message: "Password reset successful, now login!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
