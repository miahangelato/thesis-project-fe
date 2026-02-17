"use client";

import { AlertTriangle, BadgeCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ModalShell } from "@/components/ui/modal-shell";

interface ConsentModalProps {
  isOpen: boolean;
  consent: boolean;
  loading?: boolean;
  onConsentChange: (value: boolean) => void;
  onCancel: () => void;
  onContinue: () => void;
}

const PRIVACY_POINTS = [
  "We use fingerprint patterns (with consent).",
  "We do not store personal identifiers.",
  "We do not sell stored data.",
];

export function ConsentModal({
  isOpen,
  consent,
  loading = false,
  onConsentChange,
  onCancel,
  onContinue,
}: ConsentModalProps) {
  return (
    <ModalShell
      isOpen={isOpen}
      closeOnBackdrop={false}
      closeOnEscape={false}
      backdropClassName="bg-slate-900/20 backdrop-blur-[20px]"
      containerClassName="px-4 sm:px-6 md:px-8"
      panelClassName="max-w-4xl rounded-[2rem] border border-[#00c2cb]/30 shadow-[0_28px_80px_rgba(15,23,42,0.22)]"
      showTopBar
      topBarClassName="h-3 bg-[#00c2cb]"
    >
      <div className="p-6 sm:p-8 md:p-10 select-none">
        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight">
          Your Privacy Comes First
        </h2>
        <p className="mt-3 text-lg sm:text-2xl text-slate-600">
          To continue, please review our privacy practices.
        </p>

        <div className="mt-7 rounded-3xl border border-[#00c2cb]/20 bg-[#f3fbfc] p-5 sm:p-6">
          <div className="space-y-3">
            {PRIVACY_POINTS.map((point) => (
              <div key={point} className="flex items-start gap-3">
                <BadgeCheck className="h-7 w-7 text-[#00c2cb] shrink-0 mt-0.5" />
                <p className="text-xl sm:text-3xl text-slate-800 font-semibold leading-relaxed">
                  {point}
                </p>
              </div>
            ))}
          </div>

          <div className="my-5 border-t border-[#00c2cb]/20" />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Help improve research{" "}
                <span className="text-[#00c2cb] whitespace-nowrap">(optional)</span>
              </h3>
              <p className="text-lg sm:text-xl text-slate-500 mt-1">
                You can continue either way.
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={consent}
              aria-label="Toggle research consent"
              disabled={loading}
              onClick={() => onConsentChange(!consent)}
              className={cn(
                "relative inline-flex h-11 w-20 items-center rounded-full transition-colors",
                "focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#00c2cb]",
                consent ? "bg-[#00c2cb]" : "bg-slate-300",
                loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              )}
            >
              <span
                className={cn(
                  "inline-block h-9 w-9 rounded-full bg-white shadow transition-transform",
                  consent ? "translate-x-10" : "translate-x-1"
                )}
              />
            </button>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3">
          <p className="flex items-start gap-3 text-amber-900 text-lg sm:text-2xl leading-relaxed">
            <AlertTriangle className="h-6 w-6 shrink-0 mt-0.5 text-amber-600" />
            <span>
              <strong>Warning:</strong> This is a predictive screening tool, not a medical
              diagnosis.
            </span>
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-base sm:text-xl text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Legal Disclaimer:</strong> This predictive
            tool does not replace medical diagnosis or laboratory testing. Consult
            qualified healthcare professionals for clinical decisions.
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <Button
            type="button"
            disabled={loading}
            onClick={onCancel}
            className="h-16 sm:h-18 px-10 rounded-2xl text-2xl sm:text-3xl font-bold bg-white text-slate-600 border-2 border-slate-300 hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={loading}
            onClick={onContinue}
            className="h-16 sm:h-18 px-12 rounded-2xl text-2xl sm:text-3xl font-bold bg-[#00c2cb] hover:bg-[#00adb5] text-white min-w-[220px] cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <Spinner
                  size="sm"
                  label="Starting"
                  trackClassName="border-white/30"
                  indicatorClassName="border-white border-t-transparent"
                />
                Starting...
              </span>
            ) : (
              "Continue"
            )}
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}
