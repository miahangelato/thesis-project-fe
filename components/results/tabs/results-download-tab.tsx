"use client";

import React from "react";
import { QrCode, Smartphone, Info } from "lucide-react";
import Image from "next/image";

export function ResultsDownloadTab({
  qrCodeUrl,
  downloadUrl,
}: {
  qrCodeUrl?: string;
  downloadUrl?: string;
}) {
  // If no QR code URL yet, show loading
  if (!qrCodeUrl || !downloadUrl) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin h-12 w-12 border-4 border-teal-500 border-t-transparent rounded-full mb-4" />
        <p className="text-gray-600">Generating your report...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📄 Download Your Report</h2>

      {/* QR Code Card */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border-2 border-teal-200">
        <div className="flex flex-col items-center space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3 text-2xl font-bold text-gray-800">
            <QrCode className="h-8 w-8 text-teal-600" />
            Scan to Download
          </div>

          {/* QR Code Image */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border-4 border-white">
            <Image
              src={qrCodeUrl}
              alt="Download QR Code"
              width={256}
              height={256}
              className="rounded-lg"
              unoptimized
            />
          </div>

          {/* Instructions */}
          <div className="flex items-start gap-3 text-lg text-gray-700 max-w-md text-center bg-white p-4 rounded-xl border border-teal-200">
            <Smartphone className="h-6 w-6 mt-1 shrink-0 text-teal-600" />
            <div>
              <p className="font-semibold mb-1">📱 Open your phone camera</p>
              <p className="text-base text-gray-600">
                Point it at this QR code and your PDF report will download automatically
              </p>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="text-sm text-gray-600 text-center max-w-lg">
            <p>✅ Your report is ready and will download to your phone for safekeeping</p>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
        <p className="text-sm text-blue-800 flex items-start">
          <Info className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
          <span>
            <strong>Important:</strong> This report is for informational purposes only and
            should not replace professional medical advice. Please consult with a
            healthcare provider for proper diagnosis and treatment.
          </span>
        </p>
      </div>
    </div>
  );
}
