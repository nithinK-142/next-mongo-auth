import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      { message: "Logout Successfull" },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      expires: new Date(0),
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
