// File: app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import twilio from 'twilio';
import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(request) {
  const { name, phoneNumber } = await request.json();
  
  const verificationCode = Math.floor(100000 + Math.random() * 900000);

  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db("rosterApp");
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ phoneNumber });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }

    // Hash the verification code
    const hashedCode = await bcrypt.hash(verificationCode.toString(), 10);

    // Create new user
    await usersCollection.insertOne({
      name,
      phoneNumber,
      verificationCode: hashedCode,
      isVerified: false,
      createdAt: new Date()
    });

    // Send SMS with verification code
    await client.messages.create({
      body: `Your Roster verification code is: ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log(`Verification code for ${phoneNumber}: ${verificationCode}`);

    return NextResponse.json({ success: true, message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Error in registration:', error);
    return NextResponse.json({ success: false, message: 'Error during registration' }, { status: 500 });
  }
}