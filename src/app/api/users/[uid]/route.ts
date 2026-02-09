import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ uid: string }> } // Note: using 'uid' not 'id' to match file path if structured as [uid]
) {
    const { uid } = await params;
    await dbConnect();
    try {
        // Search by firebase UID
        const user = await User.findOne({ uid });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ uid: string }> }
) {
    const { uid } = await params;
    await dbConnect();
    try {
        const body = await request.json();

        // Auto-assign admin role if email matches
        if (body.email === "admin@admin.com") {
            body.role = "admin";
        }

        const user = await User.findOneAndUpdate({ uid }, body, {
            new: true,
            upsert: true, // Allow creating if valid
            runValidators: true,
            setDefaultsOnInsert: true
        });
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update user' }, { status: 400 });
    }
}
