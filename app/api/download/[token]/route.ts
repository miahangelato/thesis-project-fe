import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        if (!token) {
            return NextResponse.json(
                { error: "Download token is required" },
                { status: 400 }
            );
        }

        // Fetch PDF from backend using the token
        // This keeps the backend URL hidden from the client
        const backendUrl = `${BACKEND_URL}/api/session/report/${token}`;

        const response = await fetch(backendUrl, {
            method: "GET",
            headers: {
                // Don't include API key for public download endpoint
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json(
                    { error: "Report not found or has expired" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { error: "Failed to fetch report" },
                { status: response.status }
            );
        }

        // Stream the PDF response to the client
        const pdfBlob = await response.blob();

        return new NextResponse(pdfBlob, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="health_report.pdf"`,
            },
        });
    } catch (error) {
        console.error("PDF download error:", error);
        return NextResponse.json(
            { error: "Failed to download PDF" },
            { status: 500 }
        );
    }
}
