import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Place from '@/models/Place';

export async function GET() {
    await dbConnect();
    try {
        const places = await Place.find({});
        return NextResponse.json(places);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch places' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const place = await Place.create(body);
        return NextResponse.json(place, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create place' }, { status: 400 });
    }
}
