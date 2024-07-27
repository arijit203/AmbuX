// app/api/update-phone-number/route.js

import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import User from "../../../modals/user.modal";
import { connect } from "../../../db";

import axios from 'axios';

const uri = process.env.MONGODB_URL; // Your MongoDB URI
const client = new MongoClient(uri); // MongoClient instance
const clerkApiKey = process.env.CLERK_API_KEY; // Clerk API key from environment variable

export async function POST(req) {
  const { userId, phoneNo } = await req.json(); // Extract data from request body

  if (!userId || !phoneNo) {
    return NextResponse.json({ error: 'User ID and phone number are required' }, { status: 400 });
  }

  try {
    await connect();
    const database = client.db('ambulance');
    const users = database.collection('users'); // Ensure this is the correct collection name

    // Update phone number in MongoDB
    const result = await User.updateOne(
      { clerkId: userId },
      { $set: { phone_no: phoneNo } }
    );

    if (result.modifiedCount === 1) {
      // Update phone number in Clerk database
      const clerkResponse = await axios.post(
        `https://api.clerk.dev/v1/phone_numbers`,
        {
          "user_id":userId,
          "phone_number": phoneNo,
          "verified": true,
          "primary": true,
          "reserved_for_second_factor": true
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // console.log("ClerkResponse: ",clerkResponse)
      if (clerkResponse.status === 200) {
        console.log("Done in Both");
        return NextResponse.json({ message: 'Phone number updated successfully in both databases' }, { status: 200 });
      } else {
        return NextResponse.json({ error: 'Failed to update phone number in Clerk database' }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: 'No document matched the query. Phone number not updated.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating phone number:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    // MongoDB connections in serverless functions are typically managed automatically
    // Consider leaving the connection open or using a connection pool
  }
}
