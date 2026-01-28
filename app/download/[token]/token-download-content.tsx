"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Download,
  AlertTriangle,
  CheckCircle,
  Home,
  FileText,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";

export function TokenDownloadContent() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [autoDownloadAttempted, setAutoDownloadAttempted] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid download link");
      setLoading(false);
      return;
    }

    // Validate token format
    if (token.length < 10) {
      setError("Invalid download token format");
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [token]);

  // Auto-download on mobile devices
  useEffect(() => {
    if (!loading && !error && !autoDownloadAttempted) {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        setAutoDownloadAttempted(true);
        setTimeout(() => {
          handleDownload();
        }, 500);
      }
    }
  }, [loading, error, autoDownloadAttempted]);

  const handleDownload = async () => {
    if (!token) return;

    try {
      setDownloading(true);
      setError(null);

      // Call our frontend API route which proxies to backend
      const response = await fetch(`/api/download/${token}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to download PDF");
      }

      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `health_report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setDownloading(false);
    } catch (err: unknown) {
      const msg =
        (err as Error)?.message || "Failed to download PDF. Please try again.";
      setError(msg);
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <FullScreenLoader
        title="Preparing Your Download"
        subtitle="Please wait a moment…"
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert className="border-destructive/50 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="flex gap-3 mt-4">
              <Button onClick={() => router.push("/")} className="flex-1">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl flex items-center justify-center gap-2">
            <CheckCircle className="h-8 w-8 text-green-600" />
            Your Report is Ready
          </CardTitle>
          <CardDescription className="text-base">
            Download your health analysis report
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted rounded-lg p-6">
            <div className="flex flex-col items-center space-y-4">
              <FileText className="h-16 w-16 text-primary" />
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-lg">
                  Health Analysis Report
                </h3>
                <p className="text-sm text-muted-foreground">
                  Your personalized diabetes risk assessment
                </p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleDownload}
            size="lg"
            className="w-full"
            disabled={downloading}
          >
            {downloading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Download PDF Report
              </>
            )}
          </Button>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> This report is for personal records only.
              It should not be used for medical diagnosis or treatment without
              consulting a healthcare professional.
            </AlertDescription>
          </Alert>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-sm"
            >
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
