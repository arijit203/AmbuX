import { connect } from "../../../../db";
import Driver from "../../../../modals/driver.modal";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { name, phone, email, address, password, license_plate } =
    await req.json();

  try {
    await connect();

    // Check if the driver already exists
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return NextResponse.json(
        { error: "Driver already registered" },
        { status: 400 }
      );
    }

    console.log("Password: ", password);

    const saltRounds = 10; // Salt rounds should be a number
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new driver
    const newDriver = new Driver({
      name,
      phone_no: phone,
      email,
      address,
      license_plate,
      password: hashedPassword,
    });

    await newDriver.save();

    const token = jwt.sign(
      { driverId: newDriver._id, email: email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { message: "Driver registered successfully", token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error:", error); // Log the error for debugging
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
