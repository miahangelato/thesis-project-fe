"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

interface MainLandingProps {
  onStartClick: () => void;
  loading?: boolean;
}

export function MainLanding({ onStartClick, loading = false }: MainLandingProps) {
  const cardShadow =
    "0 15px 35px rgba(0, 194, 203, 0.15), 0 5px 15px rgba(0, 0, 0, 0.05)";
  const mainShadow =
    "0 20px 40px rgba(0, 194, 203, 0.20), 0 8px 20px rgba(0, 0, 0, 0.06)";

  const fingerprintImages = [
    "/landing-page/fingerprint-removebg-preview (1).png",
    "/landing-page/fingerprint-removebg-preview (1).png",
    "/landing-page/fingerprint-removebg-preview (1).png",
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full px-12 lg:px-18 xl:px-24 2xl:px-36 pb-2 flex items-start justify-between select-none">
        {/* LEFT: content */}
        <div className="w-[69%] flex flex-col h-[700px] pr-4 lg:pr-8 relative z-10">
          {/* Static Text Content */}
          <div className="relative mt-32">
            <div className="inline-block mb-3">
              <span className="text-[#00c2cb] font-semibold text-lg lg:text-2xl bg-[#e4f7f8] px-4 py-2 rounded-full">
                Recent insights
              </span>
            </div>

            <h1 className="text-2xl lg:text-3xl xl:text-5xl font-bold text-gray-800 mb-4 leading-tight">
              Blood Group & Diabetes Risk Insights Through Fingerprint Analysis
            </h1>

            <div className="space-y-3">
              <p className="text-gray-600 text-base lg:text-lg xl:text-2xl leading-relaxed select-none">
                AI analyzes fingerprint patterns to explore potential correlations with
                blood group classification and diabetes risk. This non-invasive system
                supports early awareness and health research with no needles or blood
                samples.
              </p>
            </div>

            <div className="flex items-center space-x-6 mt-4 mb-4">
              <span className="text-gray-500 text-xl font-medium">
                🧠 Research-Based
              </span>
              <span className="text-gray-300 text-xl">•</span>
              <span className="text-gray-500 text-xl font-medium">🔬 AI-Driven</span>
              <span className="text-gray-300 text-xl">•</span>
              <span className="text-gray-500 text-xl font-medium">
                🩺 Awareness-Focused
              </span>
            </div>
          </div>

          {/* Static Button & Helper Text */}
          <div className="flex flex-col items-start space-y-3 mt-6 z-20">
            <Button
              onClick={onStartClick}
              className="bg-[#00c2cb] hover:bg-[#00adb5] text-white px-16 py-12 rounded-2xl transition-all duration-300 font-bold text-xl lg:text-5xl shadow-2xl transform hover:-translate-y-2 hover:scale-[1.03] cursor-pointer min-w-[300px]"
              disabled={loading}
              style={{
                animation: "breathe 3s ease-in-out infinite",
                boxShadow: "0 0 25px rgba(0, 194, 203, 0.4)",
              }}
            >
              {loading ? (
                <div className="flex items-center">
                  <Spinner
                    size="md"
                    className="mr-3"
                    label="Starting"
                    trackClassName="border-white/30"
                    indicatorClassName="border-white border-t-transparent"
                  />
                  <span>Starting...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Fingerprint className="mr-3 h-14 w-14" />
                  <span>Click to Start</span>
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* RIGHT: triptych cards with enhanced design */}
        <div className="w-[58%] flex justify-center items-center relative h-[650px] pb-10">
          <div className="relative w-full max-w-xl -translate-y-2 z-10">
            <div className="relative h-[460px] w-full flex items-center justify-center">
              {/* LEFT CARD */}
              <div
                className="absolute bg-white/90 backdrop-blur-sm rounded-2xl border border-[#00c2cb]/20"
                style={{
                  width: "clamp(170px, 14vw, 210px)",
                  height: "clamp(240px, 20vw, 290px)",
                  boxShadow:
                    "0 25px 50px rgba(0, 194, 203, 0.25), 0 10px 25px rgba(0, 0, 0, 0.1)",
                  zIndex: 1,
                  transform: "translateX(clamp(-250px, -15vw, -110px))",
                }}
              >
                <div className="absolute inset-0 rounded-[inherit] ring-2 ring-[#00c2cb]/30" />

                <div className="flex items-center justify-center h-full p-2">
                  <div className="relative w-full h-full bg-white rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                      src={fingerprintImages[0]}
                      alt="Left fingerprint"
                      fill
                      draggable={false}
                      className="object-contain"
                      sizes="(min-width: 1280px) 160px, (min-width: 1024px) 150px, 130px"
                      style={{
                        opacity: 0.8,
                        filter:
                          "brightness(1.1) contrast(1.1) saturate(1.2) drop-shadow(0 8px 16px rgba(0, 194, 203, 0.3))",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT CARD */}
              <div
                className="absolute bg-white/90 backdrop-blur-sm rounded-2xl border border-[#00c2cb]/20"
                style={{
                  width: "clamp(170px, 14vw, 210px)",
                  height: "clamp(240px, 20vw, 290px)",
                  boxShadow:
                    "0 25px 50px rgba(0, 194, 203, 0.25), 0 10px 25px rgba(0, 0, 0, 0.1)",
                  zIndex: 1,
                  transform: "translateX(clamp(260px, 13vw, 360px))",
                }}
              >
                <div className="absolute inset-0 rounded-[inherit] ring-2 ring-[#00c2cb]/30" />

                <div className="flex items-center justify-center h-full p-2">
                  <div className="relative w-full h-full bg-white rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                      src={fingerprintImages[2]}
                      alt="Right fingerprint"
                      fill
                      draggable={false}
                      className="object-contain"
                      sizes="(min-width: 1280px) 160px, (min-width: 1024px) 150px, 130px"
                      style={{
                        opacity: 0.8,
                        filter:
                          "brightness(1.1) contrast(1.1) saturate(1.2) drop-shadow(0 8px 16px rgba(0, 194, 203, 0.3))",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* MAIN CARD */}
              <div
                className="bg-white/95 backdrop-blur-sm rounded-2xl relative border border-[#00c2cb]/30"
                style={{
                  width: "clamp(260px, 22vw, 320px)",
                  height: "clamp(360px, 30vw, 440px)",
                  boxShadow:
                    "0 30px 60px rgba(0, 194, 203, 0.35), 0 15px 35px rgba(0, 0, 0, 0.15)",
                  zIndex: 2,
                }}
              >
                <div className="absolute inset-0 rounded-[inherit] ring-2 ring-[#00c2cb]/40" />

                <div className="flex items-center justify-center h-full p-3">
                  <div className="relative w-full h-full bg-white rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                      src={fingerprintImages[1]}
                      alt="Main fingerprint"
                      fill
                      draggable={false}
                      className="object-contain"
                      sizes="(min-width: 1280px) 240px, (min-width: 1024px) 220px, 200px"
                      style={{
                        filter:
                          "brightness(1.15) contrast(1.15) saturate(1.3) drop-shadow(0 15px 30px rgba(0, 194, 203, 0.4))",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* optional: subtle glow like the old one (kept very light) */}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-[#00c2cb] opacity-[0.06] blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
