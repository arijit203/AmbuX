import { NextResponse } from "next/server";
import { connect } from "../../../../db";
import Driver from "../../../../modals/driver.modal";

export async function POST(req) {
  const { phone_no } = await req.json();

  if (!phone_no) {
    return NextResponse({ error: "Phone number is required" }, { status: 400 });
  }

  try {
    // Establish a connection to the database
    await connect();
    // Fetch the user from the database
    const user = await Driver.findOne({ phone_no: phone_no });

    if (user) {
      return NextResponse.json(
        { exists: true, id: user._id, driver: user },
        { status: 200 }
      );
    }

    return NextResponse.json({ exists: false }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
