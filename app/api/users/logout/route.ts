import { Disconnect } from "@/database/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    cookies().set({
      name: "token",
      value: "",
      httpOnly: true,
      expires: new Date(0),
    });

    return NextResponse.json(
      { message: "Logout Successfull" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    setTimeout(async () => {
      await Disconnect();
    }, 300000);
  }
}
