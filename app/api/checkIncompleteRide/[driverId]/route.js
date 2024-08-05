import { NextResponse } from "next/server";
import { connect } from "../../../../db";
import Ride from "../../../../modals/ride.modal";

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

    // Fetch the incomplete ride from the database
    const incompleteRide = await Ride.findOne({
      driver_id: driverId,
      isComplete: false,
    });

    if (incompleteRide) {
      return NextResponse.json(
        { hasIncompleteRide: true, ride: incompleteRide },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ hasIncompleteRide: false }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching ride:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
