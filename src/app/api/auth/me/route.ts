
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
    await dbConnect();
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
        return NextResponse.json({ user: null });
    }

    const payload = verifyToken(token);

    if (!payload) {
        return NextResponse.json({ user: null });
    }

    // Refresh user data from DB to get latest role/details
    // payload usually has uid related to _id now
    try {
        const user = await User.findById(payload.uid);
        if (!user) {
            return NextResponse.json({ user: null });
        }

        // Return safe user object
        return NextResponse.json({
            user: {
                uid: user._id,
                email: user.email,
                displayName: user.displayName,
                role: user.role
            }
        });
    } catch (e) {
        return NextResponse.json({ user: null });
    }
}
