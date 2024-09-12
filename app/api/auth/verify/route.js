// File: app/api/auth/verify/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { phoneNumber, verificationCode } = await request.json();

  try {
    const mongoClient = await clientPromise;
    const db = mongoClient.db("rosterApp");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ phoneNumber });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const isCodeValid = await bcrypt.compare(verificationCode, user.verificationCode);
    if (!isCodeValid) {
      return NextResponse.json({ success: false, message: 'Invalid verification code' }, { status: 400 });
    }

    // Mark user as verified
    await usersCollection.updateOne(
      { phoneNumber },
      { $set: { isVerified: true, verificationCode: null } }
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Verification successful',
      user: { name: user.name, phoneNumber: user.phoneNumber }
    });
  } catch (error) {
    console.error('Error in verification:', error);
    return NextResponse.json({ success: false, message: 'Error during verification' }, { status: 500 });
  }
}