import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import User from "@/models/user";
import ResetToken from "@/models/token";
import { Connect } from "@/database/config";
import { encryptId } from "@/utils/crypto";

Connect();
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate a reset token
    const token = await bcrypt.hash(email + Date.now().toString(), 10);

    // Save the reset token to the database
    const resetToken = new ResetToken({ user: user._id, token });
    await resetToken.save();

    // Send the verification email
    // const transporter = nodemailer.createTransport({
    //   // Configure your email transport options (e.g., SMTP)
    // });

    const encryptedTokenId = resetToken._id.toString();
    // const encryptedTokenId = encryptId(resetToken._id.toString());
    const verificationLink = `${process.env.NEXTAUTH_MONGO_URL}/reset-password/verify-token?verifyToken=${token}&verifyTokenId=${encryptedTokenId}`;

    console.log(verificationLink);

    // const mailOptions = {
    //   from: "your-email@example.com",
    //   to: email,
    //   subject: "Reset Password",
    //   html: `Click <a href="${verificationLink}">here</a> to reset your password.`,
    // };

    // await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "Verification email sent" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error", status: 500 });
  }
}
