import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        if (!token) {
            return new NextResponse("Download token is required", { status: 400 });
        }

        // Fetch PDF from backend using the token
        const backendUrl = `${BACKEND_URL}/api/session/report/${token}`;

        const response = await fetch(backendUrl, {
            method: "GET",
        });

        if (!response.ok) {
            if (response.status === 404) {
                return new NextResponse("Report not found or has expired", { status: 404 });
            }

            return new NextResponse("Failed to fetch report", { status: response.status });
        }

        // Stream the PDF response to the client with proper headers for download
        const pdfBuffer = await response.arrayBuffer();

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="health_screening_report.pdf"`,
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
            },
        });
    } catch (error) {
        console.error("PDF download error:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new NextResponse(`Failed to download PDF. Details: ${errorMessage}`, { status: 500 });
    }
}
