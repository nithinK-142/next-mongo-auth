import { Connect } from "@/database/config";
import User from "@/models/user";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

Connect();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and Password is required" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: "Wrong username or password" },
        { status: 400 }
      );
    }

    const jwtSecret = process.env.JWT_SECRETKEY;
    if (!jwtSecret) throw new Error("JWT_SECRETKEY is not defined");

    const token = jwt.sign(
      { username: user.username, id: user._id },
      jwtSecret,
      { expiresIn: "1d" }
    );

    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: true,
    });

    return NextResponse.json(
      { message: "Login successfull", username: user.username },
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
