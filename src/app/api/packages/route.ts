import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Package from '@/models/Package';

export async function GET() {
    await dbConnect();
    try {
        const packages = await Package.find({});
        return NextResponse.json(packages);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const pkg = await Package.create(body);
        return NextResponse.json(pkg, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create package' }, { status: 400 });
    }
}
