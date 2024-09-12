// File: app/api/roster/[id]/route.js
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  const { id } = params;
  const updatedPerson = await request.json();

  try {
    const client = await clientPromise;
    const db = client.db("rosterApp");
    const rosterCollection = db.collection("rosterItems");

    const result = await rosterCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedPerson }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'Roster item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Roster item updated successfully' });
  } catch (error) {
    console.error('Error updating roster item:', error);
    return NextResponse.json({ success: false, message: 'Error updating roster item' }, { status: 500 });
  }
}