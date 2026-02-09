import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MapPin from '@/models/MapPin';

export async function GET() {
    await dbConnect();
    try {
        const pins = await MapPin.find({});
        return NextResponse.json(pins);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch map pins' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const pin = await MapPin.create(body);
        return NextResponse.json(pin, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create map pin' }, { status: 400 });
    }
}
