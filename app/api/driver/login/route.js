import { connect } from '../../../../db';
import Driver from '../../../../modals/driver.modal';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  
    const { email, password } = await req.json();
    console.log(email," ",password)
    try {
      await connect();

      // Find the driver by email
      const driver = await Driver.findOne({ email });
      if (!driver) {
        return NextResponse.json({ error: 'No Driver Found' }, { status: 400 });
      }

      // Check the password
      const isMatch = await bcrypt.compare(password, driver.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
      }

      // Generate JWT
      console.log("hi baby: ",driver)
      const token = jwt.sign(
        { driverId: driver._id, email: driver.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      console.log("hi baby1")
      return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  
}
