import { connect } from "../../../../db";
import Driver from "../../../../modals/driver.modal";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const { source, patientId } = await req.json();

  try {
    await connect();

    // Find the closest available driver who is not offline
    const drivers = await Driver.find({ isOffline: false, assigned: null });
    const closestDriver = await findClosestDriver(drivers, source);

    if (closestDriver) {
      // Update driver status or perform other actions as needed
      closestDriver.assigned = patientId;
      await closestDriver.save();

      return NextResponse.json(
        { success: true, driver: closestDriver },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, error: "No available drivers found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log("Error in allocateDriver: ", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Helper function to find the closest driver
async function findClosestDriver(drivers, source) {
  let closestDriver = null;
  let minDistance = Infinity;

  const distancePromises = drivers.map(async (driver) => {
    const distance = await getDistance(
      source.lat,
      source.lng,
      driver.curr_location.lat,
      driver.curr_location.lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestDriver = driver;
    }
  });

  await Promise.all(distancePromises);
  console.log(closestDriver.name, " ", minDistance);
  return closestDriver;
}

async function getDistance(lat1, lng1, lat2, lng2) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${lat1},${lng1}&destination=${lat2},${lng2}&key=${process.env.GOOGLE_API_KEY}`
    );
    const directionsData = response.data.routes[0].legs[0];
    const distanceInMeters = directionsData.distance.value;
    const distanceInKilometers = distanceInMeters / 1000;
    console.log(distanceInKilometers);
    return distanceInKilometers;
  } catch (error) {
    console.error("Error fetching driving distance:", error);
    throw error;
  }
}
