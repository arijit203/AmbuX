import { connect } from '../../../../db';
import Driver from '../../../modals/driver.modal';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, phone_no, email, address,  password,license_plate } = req.body;

    try {
      await connect();

      // Check if the driver already exists
      const existingDriver = await Driver.findOne({ email });
      if (existingDriver) {
        return NextResponse.json({ error: 'Driver already registered' }, { status: 400 });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new driver
      const newDriver = new Driver({
        name,
        phone_no,
        email,
        address,
        license_plate,
        password: hashedPassword,
      });

      await newDriver.save();
      return NextResponse.json({ message: 'Driver registered successfully' }, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}
