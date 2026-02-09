import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reservation from '@/models/Reservation';

export async function GET() {
    await dbConnect();
    try {
        const reservations = await Reservation.find({}).sort({ createdAt: -1 });
        return NextResponse.json(reservations);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reservations' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const reservation = await Reservation.create(body);
        return NextResponse.json(reservation, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create reservation' }, { status: 400 });
    }
}
