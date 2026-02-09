import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tour from '@/models/Tour';
import Place from '@/models/Place';

export async function GET() {
    await dbConnect();
    try {
        // We need to verify if the frontend expects populated places or just IDs.
        // The previous service did a manual join.
        // "places: places.filter((p: any) => tour.placeIds?.includes(p.id))"
        // So we should try to emulate that or just return the tours and let frontend handle it?
        // Actually, it's better to populate it here if possible, but the Service type definition says `places?: Place[]`.
        // Let's populate specific fields or just everything.

        // Note: Tour model has placeIds as [String].
        // Since we are migrating, the frontend code in step 21 does the join manually in client logic?
        // "const tours = toursSnap.docs... const places = placesSnap.docs... return tours.map(... places: ...)"
        // Yes, the service joins it. 
        // To keep it simple and efficient, we can return the tours as is, and the service can fetch places separately, 
        // OR we can do the join here. 
        // However, the `Tour` type expects `places?: Place[]`.
        // If I migrate the service to just fetch `/api/tours`, the service responsibility for joining might be lost 
        // unless I do it here.
        // I will try to populate it if I can, but standard Mongoose population requires Ref.
        // Since I defined placeIds as [String] without ref for simplicity (as they were string IDs in Firebase),
        // population won't work out of the box unless I change the schema to ObjectId and Ref.
        // BUT, the existing IDs are strings. 
        // I will stick to returning the raw Tour data and update the Service to fetch both and join, 
        // to minimize changes. WAIT, the user said "Use mongo".
        // I can rewrite the service to fetch `/api/tours?populate=true` or just fetch both endpoints.

        // Actually, looking at the previous service (Step 21), it fetches ALL places and ALL tours every time.
        // That is inefficient but that's what it did.
        // I will verify what `getTours` returns. It returns `Tour[]` with populated `places`.

        // Strategy: simpler to just fetch all places and tours in the API and join them before returning, 
        // creating a true "RPC-like" endpoint, OR replicate the client-side join logic in the new service.
        // I will replicate the client-side logic in the new service to keep the API Restful and atomic.
        // So this endpoint just returns Tours.

        const tours = await Tour.find({});
        return NextResponse.json(tours);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const tour = await Tour.create(body);
        return NextResponse.json(tour, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create tour' }, { status: 400 });
    }
}
