import dbConnect from "@/database/config";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

dbConnect();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { email, username, password } = body;

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Email, Username and Password is required" },
        { status: 401 }
      );
    }

    const isEmail = await User.findOne({ email });
    if (isEmail) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username });
    if (user) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully, now login!" },
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
