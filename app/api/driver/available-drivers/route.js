// pages/api/drivers/index.js
import { connect } from "../../../../db";
import Driver from "../../../../modals/driver.modal";
import { NextResponse } from "next/server";

export async function GET() {
  await connect();

  try {
    const drivers = await Driver.find({ isOffline: false });
    return NextResponse.json({ success: true, drivers }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
