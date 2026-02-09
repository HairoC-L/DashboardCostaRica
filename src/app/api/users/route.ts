import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    await dbConnect();
    try {
        const users = await User.find({});
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        // Check if user exists by UID or Email
        const existing = await User.findOne({
            $or: [{ uid: body.uid }, { email: body.email }]
        });

        if (existing) {
            // If simply syncing, maybe return existing user?
            // But creating should be strict.
            // However, client logic tries to update if exists.
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const user = await User.create(body);
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });
    }
}
