import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { SentMessageInfo } from "nodemailer";
import User from "@/models/user";
import ResetToken from "@/models/token";
import { Connect } from "@/database/config";
import { encryptId } from "@/utils/crypto";
import { sendMail } from "@/utils/mailer";

Connect();
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found or Invalid email" },
        { status: 404 }
      );
    }

    // Generate a reset token
    const token = await bcrypt.hash(email + Date.now().toString(), 10);

    // Save the reset token to the database
    const resetToken = new ResetToken({ user: user._id, token });
    await resetToken.save();

    const tokenId = resetToken._id.toString();
    const encryptedTokenId = encryptId(tokenId);
    const verificationLink = `${process.env.NEXTAUTH_MONGO_URL}/reset-password/verify-token?verifyToken=${token}&verifyTokenId=${tokenId}`;

    // console.log(verificationLink);

    const mailResponse = await sendMail(email, verificationLink);

    const { accepted } = mailResponse as SentMessageInfo;
    if (accepted.length === 0) {
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      { message: "Check your inbox for verification email" },
      { status: 200 }
    );

    response.cookies.set({
      name: "encryptedTokenId",
      value: encryptedTokenId,
      httpOnly: true,
      secure: true,
    });

    return response;
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
