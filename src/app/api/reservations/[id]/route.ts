import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Reservation from '@/models/Reservation';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
        }
        return NextResponse.json(reservation);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reservation' }, { status: 500 });
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
        const reservation = await Reservation.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!reservation) {
            return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
        }
        return NextResponse.json(reservation);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update reservation' }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        const reservation = await Reservation.findByIdAndDelete(id);
        if (!reservation) {
            return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete reservation' }, { status: 500 });
    }
}
