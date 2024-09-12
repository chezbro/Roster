// File: app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import twilio from 'twilio';
import clientPromise from '../../../lib/mongodb';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(request) {
  try {
    const { name, phoneNumber } = await request.json();
    
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    console.log(`Generated verification code for ${phoneNumber}: ${verificationCode}`);

    const mongoClient = await clientPromise;
    const db = mongoClient.db("rosterApp");
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ phoneNumber });
    if (existingUser) {
      console.log(`User with phone number ${phoneNumber} already exists`);
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }

    // Create new user
    await usersCollection.insertOne({
      name,
      phoneNumber,
      verificationCode: verificationCode.toString(),
      isVerified: false,
      createdAt: new Date()
    });

    console.log(`User created for ${phoneNumber}`);

    // Send SMS with verification code
    await client.messages.create({
      body: `Your Roster verification code is: ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log(`SMS sent to ${phoneNumber} with verification code: ${verificationCode}`);

    return NextResponse.json({ success: true, message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Error in registration:', error);
    return NextResponse.json({ success: false, message: 'Error during registration' }, { status: 500 });
  }
}