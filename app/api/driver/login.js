import { connect } from '../../../../db';
import Driver from '../../../modals/driver.modal';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      await connect();

      // Find the driver by email
      const driver = await Driver.findOne({ email });
      if (!driver) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
      }

      // Check the password
      const isMatch = await bcrypt.compare(password, driver.password);
      if (!isMatch) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
      }

      // Generate JWT
      const token = jwt.sign(
        { driverId: driver._id, email: driver.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return NextResponse.json({ token }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}
