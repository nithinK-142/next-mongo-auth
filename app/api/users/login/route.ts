import { Connect } from "@/database/config";
import User from "@/models/user";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

Connect();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return new Response("Username and Password is required", { status: 401 });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return new Response("Username does not exist", { status: 400 });
    }

    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return new Response("Incorrect Password", { status: 400 });
    }

    const jwtSecret = process.env.JWT_SECRETKEY;
    if (!jwtSecret) throw new Error("JWT_SECRETKEY is not defined");

    const token = jwt.sign(
      { username: user.username, id: user._id },
      jwtSecret,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({ message: "Login successfull" });

    response.cookies.set("token", token, { httpOnly: true });
    return response;
  } catch (error: any) {
    console.log("Error", error.message);
    return new Response("Something went wrong ", { status: 500 });
  }
};
