// api/driver/check-assigned/route.js

import { connect } from "../../../../db";
import Driver from "../../../../modals/driver.modal";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { driverId } = await req.json();

  try {
    await connect();
    const driver = await Driver.findById(driverId);

    if (driver) {
      console.log("Driver assigned:", driver);
      return NextResponse.json(
        { success: true, assigned: driver.assigned },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Driver not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log("Error in checkAssigned: ", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
