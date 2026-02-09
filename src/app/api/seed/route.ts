
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function GET() {
    await dbConnect();
    try {
        const adminEmail = "admin@admin.com";
        const adminPass = process.env.NEXT_PUBLIC_DEMO_USER_PASS || "admin123456";

        const existing = await User.findOne({ email: adminEmail });
        if (existing) {
            // Update password if needed? Or just skip
            if (!existing.password) {
                existing.password = await hashPassword(adminPass);
                existing.role = 'admin';
                await existing.save();
                return NextResponse.json({ message: 'Admin user updated with password' });
            }
            return NextResponse.json({ message: 'Admin user already exists' });
        }

        const hashedPassword = await hashPassword(adminPass);

        await User.create({
            uid: 'admin-seed-id',
            email: adminEmail,
            displayName: 'Admin User',
            role: 'admin',
            password: hashedPassword
        });

        return NextResponse.json({ message: 'Admin user created' });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
    }
}
