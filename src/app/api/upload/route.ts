
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData();
        const file: File | null = data.get("file") as unknown as File;
        const slug = data.get("slug") as string;
        const folder = data.get("folder") as string || "destino"; // Allow 'destino' or other folders

        if (!file) {
            return NextResponse.json({ success: false, message: "No file uploaded" }, { status: 400 });
        }

        if (!slug) {
            return NextResponse.json({ success: false, message: "No slug provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Validate slug to prevent directory traversal
        const safeSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "");

        // Construct path
        // Note: process.cwd() is the root of the project
        const uploadDir = path.join(process.cwd(), "public", folder, safeSlug);

        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Clean filename
        const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filepath = path.join(uploadDir, filename);

        // Write file
        await writeFile(filepath, buffer);

        // Return public URL
        const publicUrl = `/${folder}/${safeSlug}/${filename}`;

        return NextResponse.json({ success: true, url: publicUrl });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
    }
}
