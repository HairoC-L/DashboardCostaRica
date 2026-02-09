import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MapPin from '@/models/MapPin';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await dbConnect();
    try {
        const pin = await MapPin.findByIdAndDelete(id);
        if (!pin) {
            return NextResponse.json({ error: 'Map pin not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Map pin deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete map pin' }, { status: 500 });
    }
}
