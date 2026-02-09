import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Place from '@/models/Place';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        const place = await Place.findById(id);
        if (!place) {
            return NextResponse.json({ error: 'Place not found' }, { status: 404 });
        }
        return NextResponse.json(place);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch place' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        const body = await request.json();
        const place = await Place.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!place) {
            return NextResponse.json({ error: 'Place not found' }, { status: 404 });
        }
        return NextResponse.json(place);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update place' }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        const place = await Place.findByIdAndDelete(id);
        if (!place) {
            return NextResponse.json({ error: 'Place not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Place deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete place' }, { status: 500 });
    }
}
