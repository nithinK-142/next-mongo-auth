import { Connect } from "@/database/config";
import User from "@/models/user";
import bcryptjs from "bcryptjs";
import { NextRequest } from "next/server";

Connect();

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    const { email, username, password } = body;

    if (!email || !username || !password) {
      return new Response("Email, Username and Password is required", {
        status: 401,
      });
    }

    const user = await User.findOne({ username });
    if (user) {
      return new Response("Username already exist", { status: 400 });
    }

    const salt = await bcryptjs.genSalt(12);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    return new Response("User saved successfully", { status: 200 });
  } catch (error) {
    console.log(error);
  }
};
