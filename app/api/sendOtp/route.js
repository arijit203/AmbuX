import { NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req) {
  try {
    const { phoneNumber } = await req.json();
    const otp = Math.floor(1000 + Math.random() * 9000);
    // Send OTP via Twilio
    console.log("otp: ",otp)
    await client.messages.create({
      body: `Your OTP for AbmuX is ${otp}`,  // Replace with actual OTP generation logic
      from: process.env.PHONE_NO,      // Your Twilio number
      to: phoneNumber,           // User's phone number
    });
    console.log("message sent")
    return NextResponse.json({ success: true, message: 'OTP sent successfully',otp });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ success: false, error: 'Failed to send OTP' }, { status: 500 });
  }
}
