import { connect } from "../../../../db";
import Driver from "../../../../modals/driver.modal";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connect();

  if (req.method === "POST") {
    const { driverId } = await req.json();

    try {
      await Driver.findByIdAndUpdate(driverId, { isOffline: true });

      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );
  }
}
