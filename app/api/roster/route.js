// File: app/api/roster/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("rosterApp");
    const rosterCollection = db.collection("rosterItems");

    const newPerson = await request.json();
    
    // Add creation timestamp
    newPerson.createdAt = new Date();

    const result = await rosterCollection.insertOne(newPerson);

    if (result.acknowledged) {
      return NextResponse.json({ 
        success: true, 
        message: 'Roster item added successfully',
        rosterItem: { ...newPerson, _id: result.insertedId }
      });
    } else {
      throw new Error('Failed to insert document');
    }
  } catch (error) {
    console.error('Error adding roster item:', error);
    return NextResponse.json({ success: false, message: 'Error adding roster item' }, { status: 500 });
  }
}