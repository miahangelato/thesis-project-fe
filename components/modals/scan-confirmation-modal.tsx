"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { ModalShell } from "@/components/ui/modal-shell";

import { Fingerprint, AlertCircle, CheckCircle, Sparkles } from "lucide-react";

interface ScanConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ScanConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
}: ScanConfirmationModalProps) {
  const titleId = React.useId();

  if (!isOpen) return null;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onCancel}
      labelledById={titleId}
      backdropClassName="bg-teal-950/40 backdrop-blur-md"
      panelClassName="max-w-3xl rounded-[2rem] border border-teal-100"
      showTopBar
    >
      <div className="p-10">
        <div className="flex flex-col items-center text-center gap-6 mb-10">
          <div className="relative">
            <div className="w-32 h-32 bg-linear-to-br from-teal-50 to-cyan-50 rounded-3xl flex items-center justify-center shadow-sm border border-teal-100">
              <Fingerprint className="w-14 h-14 text-[#00c2cb]" strokeWidth={2.5} />
            </div>
            <div className="absolute inset-0 rounded-3xl border-4 border-teal-100 opacity-50 animate-pulse" />
          </div>
          <div>
            <h2
              id={titleId}
              className="text-5xl font-bold text-slate-900 mb-3 tracking-tight"
            >
              Start Automatic Scanning
            </h2>
            <p className="text-2xl text-slate-600 font-medium">
              10 fingers will be scanned sequentially
            </p>
          </div>
        </div>

        <div className="space-y-6 mb-10">
          <div className="bg-linear-to-r from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-2xl p-8 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-teal-100">
                <Sparkles className="w-8 h-8 text-teal-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-teal-900 mb-2">Automatic Process</p>
                <p className="text-2xl text-teal-800/80 leading-relaxed">
                  The scanner will automatically capture each finger and move to the next
                  one after <span className="font-bold">5 seconds</span>.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <AlertCircle className="w-8 h-8 text-amber-600" />
                <p className="text-2xl font-bold text-amber-900">If Scanning Fails</p>
              </div>
              <p className="text-2xl text-amber-800/90 leading-relaxed font-medium">
                Don&apos;t worry! You can review and retake any finger after the scanning
                process is complete.
              </p>
            </div>

            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <CheckCircle className="w-8 h-8 text-gray-600" />
                <p className="text-2xl font-bold text-gray-900">Best Results</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-2xl text-gray-600 font-medium">
                  <span className="w-3 h-3 rounded-full bg-gray-400" />
                  Clean & dry fingers
                </li>
                <li className="flex items-center gap-3 text-2xl text-gray-600 font-medium">
                  <span className="w-3 h-3 rounded-full bg-gray-400" />
                  Press firmly
                </li>
                <li className="flex items-center gap-3 text-2xl text-gray-600 font-medium">
                  <span className="w-3 h-3 rounded-full bg-gray-400" />
                  Keep still
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={onCancel}
            className="flex-1 h-20 text-2xl font-bold rounded-2xl bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 h-20 bg-[#00c2cb] hover:bg-[#00adb5] text-white text-2xl font-bold rounded-2xl shadow-lg shadow-teal-100/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center"
          >
            <Fingerprint className="w-7 h-7 mr-4" />
            Start Scanning
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}
