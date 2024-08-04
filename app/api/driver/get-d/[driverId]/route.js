import { NextResponse } from "next/server";
import { connect } from "../../../../../db";
import Driver from "../../../../../modals/driver.modal";

export async function GET(req, { params }) {
  const { driverId } = params;

  if (!driverId) {
    return NextResponse.json(
      { error: "Driver ID is required" },
      { status: 400 }
    );
  }

  try {
    // Establish a connection to the database
    await connect();

    // Fetch the user from the database
    const user = await Driver.findOne({ _id: driverId });

    if (!user) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
