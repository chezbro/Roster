// app/api/auth/register/route.js
import { NextResponse } from 'next/server';
import twilio from 'twilio';
import clientPromise from '../../../lib/mongodb';

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(request) {
  try {
    const { name, phoneNumber } = await request.json();
    
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // Log the start of MongoDB connection
    console.log('Connecting to MongoDB...');
    const mongoClient = await clientPromise;
    const db = mongoClient.db("rosterApp");
    console.log('Connected to MongoDB');

    const usersCollection = db.collection("users");

    // Log the start of user creation
    console.log('Creating new user...');
    await usersCollection.insertOne({
      name,
      phoneNumber,
      verificationCode: verificationCode.toString(),
      isVerified: false,
      createdAt: new Date()
    });
    console.log('User created successfully');

    // Log the start of Twilio SMS sending
    console.log('Sending SMS via Twilio...');
    await client.messages.create({
      body: `Your Roster verification code is: ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });
    console.log('SMS sent successfully');

    return NextResponse.json({ success: true, message: 'Verification code sent successfully' });
  } catch (error) {
    console.error('Error in registration:', error);
    return NextResponse.json({ success: false, message: 'Error during registration', error: error.message }, { status: 500 });
  }
}