"use client";

import {
  AlertTriangle,
  User,
  Sparkles,
  Fingerprint,
  Target,
  Droplets,
  Shield,
  Lightbulb,
} from "lucide-react";

type Demographics = {
  age?: number | string;
  gender?: string;
  weight_kg?: number | string;
  height_cm?: number | string;
  blood_type?: string;
  weight?: number | string;
  height?: number | string;
  bloodType?: string;
} | null;

type Props = {
  demographics: Demographics;
};

export function ScanInfoPanel({ demographics }: Props) {
  const weight = demographics?.weight_kg ?? demographics?.weight;
  const height = demographics?.height_cm ?? demographics?.height;
  const blood = demographics?.blood_type ?? demographics?.bloodType;
  const bloodLabel = !blood || blood === "unknown" ? "Unknown" : String(blood);

  return (
    <div className="col-span-5 flex flex-col gap-4">
      <div className="bg-linear-to-r from-teal-50 to-cyan-50 border-2 border-teal-300 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm overflow-hidden">
        <User className="w-7 h-7 text-teal-600 shrink-0" />
        <div className="flex items-center gap-x-3 text-2xl font-bold text-teal-900 whitespace-nowrap overflow-hidden text-ellipsis">
          <span>{demographics?.age || "--"} yrs</span>
          <span className="opacity-60">·</span>
          <span className="capitalize">{demographics?.gender || "--"}</span>
          <span className="opacity-60">·</span>
          <span>{weight ?? "--"} kg</span>
          <span className="opacity-60">·</span>
          <span>{height ?? "--"} cm</span>
          <span className="opacity-60">·</span>
          <span>{bloodLabel}</span>
        </div>
      </div>

      <div className="bg-linear-to-br from-[#e4f7f8] to-white rounded-2xl p-5 border-2 border-[#00c2cb]/20 shadow-sm">
        <h3 className="text-4xl font-bold text-slate-800 mb-4 flex items-center gap-3">
          <Lightbulb className="w-10 h-10 text-[#00c2cb]" />
          Scanning Tips
        </h3>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#00c2cb]/10 flex items-center justify-center shrink-0">
              <Sparkles className="h-6 w-6 text-[#00c2cb]" />
            </div>
            <p className="text-2xl font-medium text-slate-700 whitespace-nowrap">
              Follow the on-screen instructions
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#00c2cb]/10 flex items-center justify-center shrink-0">
              <Fingerprint className="h-6 w-6 text-[#00c2cb]" />
            </div>
            <p className="text-2xl font-medium text-slate-700 whitespace-nowrap">
              Place your finger only when prompted
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#00c2cb]/10 flex items-center justify-center shrink-0">
              <Target className="h-6 w-6 text-[#00c2cb]" />
            </div>
            <p className="text-2xl font-medium text-slate-700 whitespace-nowrap">
              Keep finger off during preparation or countdown
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#00c2cb]/10 flex items-center justify-center shrink-0">
              <Droplets className="h-6 w-6 text-[#00c2cb]" />
            </div>
            <p className="text-2xl font-medium text-slate-700 whitespace-nowrap">
              Lift your finger when the scan finishes
            </p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border-2 border-red-500 rounded-2xl px-5 py-4 flex gap-4 items-center shadow-sm">
        <AlertTriangle className="h-10 w-10 text-red-600 shrink-0" />
        <span className="text-3xl font-medium text-gray-900">
          This is a screening tool — not a medical diagnosis.
        </span>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-start gap-4">
          <Shield className="h-10 w-10 text-slate-500 mt-0.5 shrink-0" />
          <div>
            <strong className="text-3xl text-slate-900 block mb-1">
              Legal Disclaimer
            </strong>
            <p className="text-xl text-slate-600 leading-relaxed">
              This tool provides predictive insights based on fingerprint and demographic
              data. It does not replace laboratory tests or medical diagnosis. Always
              consult healthcare professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
