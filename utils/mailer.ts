import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const sendMail = async (email: string, verificationLink: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Next Mongo Auth" <${process.env.USER}>`,
      to: email,
      subject: "Reset Password",
      html: `<h1>Next Mongo Auth</h1><h4>Don't share this link with anyone</h4><h4>Visit this<a href="${verificationLink}"> Link</a> and click verify to reset your password</h4>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
