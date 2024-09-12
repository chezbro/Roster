// File: app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import twilio from 'twilio';
import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(request) {
  const { phoneNumber } = await request.json();
  
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db("rosterApp");
    const usersCollection = db.collection("users");

    // Check if user exists
    const user = await usersCollection.findOne({ phoneNumber });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // Hash the new verification code
    const hashedCode = await bcrypt.hash(verificationCode.toString(), 10);

    // Update user with new verification code
    await usersCollection.updateOne(
      { phoneNumber },
      { $set: { verificationCode: hashedCode } }
    );

    // Send SMS with verification code
    await client.messages.create({
      body: `Your Roster login verification code is: ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log(`Login verification code for ${phoneNumber}: ${verificationCode}`);

    return NextResponse.json({ success: true, message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json({ success: false, message: 'Error during login' }, { status: 500 });
  }
}