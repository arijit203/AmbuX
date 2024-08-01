import { connect } from "../../../../db";
import Driver from "../../../../modals/driver.modal";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connect();

  const { driverId, location } = await req.json();
  //   const driverId = "YOUR_DRIVER_ID"; // Retrieve the driver ID from session or authentication context

  try {
    await Driver.findByIdAndUpdate(driverId, { curr_location: location });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
