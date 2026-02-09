import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tour from '@/models/Tour';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        const tour = await Tour.findById(id);
        if (!tour) {
            return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
        }
        return NextResponse.json(tour);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tour' }, { status: 500 });
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
        const tour = await Tour.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!tour) {
            return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
        }
        return NextResponse.json(tour);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update tour' }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        const tour = await Tour.findByIdAndDelete(id);
        if (!tour) {
            return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Tour deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete tour' }, { status: 500 });
    }
}
