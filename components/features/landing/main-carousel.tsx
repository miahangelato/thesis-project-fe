"use client";

import { useState, useEffect } from "react";
import { landingCarouselSlides } from "@/data/landing-content";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

import { Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface MainCarouselProps {
  autoPlayInterval?: number;
  onStartClick: () => void;
  loading?: boolean;
}

export function MainCarousel({
  autoPlayInterval = 9000,
  onStartClick,
  loading = false,
}: MainCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [swipeStart, setSwipeStart] = useState<number | null>(null);

  const totalSlides = landingCarouselSlides.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlayInterval, totalSlides]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slide = landingCarouselSlides[currentSlide];
  if (!slide) return null;

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const textVariants = slideVariants;

  const staticImages = landingCarouselSlides.slice(0, 3);

  const cardShadow =
    "0 15px 35px rgba(0, 194, 203, 0.15), 0 5px 15px rgba(0, 0, 0, 0.05)";
  const mainShadow =
    "0 20px 40px rgba(0, 194, 203, 0.20), 0 8px 20px rgba(0, 0, 0, 0.06)";

  return (
    <div className="flex flex-col w-full">
      <div
        className="relative w-full px-12 lg:px-18 xl:px-24 2xl:px-36 pt-4 pb-2 flex items-start justify-between cursor-pointer select-none"
        onMouseDown={(e) => setSwipeStart(e.clientX)}
        onMouseUp={(e) => {
          if (swipeStart !== null) {
            const diffX = e.clientX - swipeStart;
            if (Math.abs(diffX) > 100) {
              diffX > 0 ? prevSlide() : nextSlide();
            }
            setSwipeStart(null);
          }
        }}
        onTouchStart={(e) => setSwipeStart(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (swipeStart !== null) {
            const diffX = e.changedTouches[0].clientX - swipeStart;
            if (Math.abs(diffX) > 100) {
              diffX > 0 ? prevSlide() : nextSlide();
            }
            setSwipeStart(null);
          }
        }}
      >
        {/* LEFT: text (unchanged content behavior) */}
        <div className="w-[55%] flex flex-col justify-between h-[650px] pr-4 lg:pr-8 relative z-10 pb-12">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="flex flex-col justify-start pt-20"
            >
              {slide.subtitle && (
                <div className="inline-block mb-3">
                  <span className="text-[#00c2cb] font-semibold text-lg lg:text-xl bg-[#e4f7f8] px-4 py-2 rounded-full">
                    {slide.subtitle}
                  </span>
                </div>
              )}

              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 mb-6 leading-tight">
                {slide.title}
              </h1>

              <div className="space-y-2 mb-10">
                {slide.content.map((line, idx) => {
                  const isBullet = line.trim().startsWith("•");
                  const text = isBullet ? line.trim().substring(1).trim() : line;

                  return (
                    <div
                      key={idx}
                      className={`flex items-start ${isBullet ? "pl-2" : ""}`}
                    >
                      {isBullet && (
                        <span className="text-[#00c2cb] mr-2 font-bold text-lg">•</span>
                      )}
                      <p className="text-gray-600 text-base lg:text-lg xl:text-xl leading-relaxed select-none">
                        {text}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Button (unchanged from your current code) */}
              <div className="mt-4">
                <Button
                  onClick={onStartClick}
                  className="bg-[#00c2cb] hover:bg-[#00adb5] text-white px-10 py-6 rounded-2xl transition-all duration-200 font-bold text-xl lg:text-2xl shadow-xl transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer"
                  disabled={loading}
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
                      <Fingerprint className="mr-3 h-8 w-8" />
                      <span>Click to Start</span>
                    </div>
                  )}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-28 left-0 flex items-center space-x-3 z-20">
            {landingCarouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-8 bg-[#00c2cb]"
                    : "w-3 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: triptych cards styled like the old landing page */}
        <div className="w-[58%] flex justify-center items-center relative h-[650px] pb-10">
          <div className="relative w-full max-w-xl -translate-y-2">
            <div className="relative h-[460px] w-full flex items-center justify-center">
              {/* LEFT CARD */}
              <div
                className="absolute bg-white rounded-xl"
                style={{
                  width: "clamp(170px, 14vw, 210px)",
                  height: "clamp(240px, 20vw, 290px)",
                  boxShadow: cardShadow,
                  zIndex: 1,
                  transform: "translateX(clamp(-250px, -15vw, -110px))",
                }}
              >
                <div className="absolute inset-0 rounded-[inherit] ring-1 ring-[#00c2cb]" />

                <div className="flex items-center justify-center h-full p-2">
                  <div className="relative w-full h-full bg-white rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                      src={staticImages[0]?.imagePath ?? ""}
                      alt={staticImages[0]?.title ?? "Left image"}
                      fill
                      draggable={false}
                      className="object-contain"
                      sizes="(min-width: 1280px) 160px, (min-width: 1024px) 150px, 130px"
                      style={{
                        opacity: 0.85,
                        filter:
                          "brightness(1) contrast(1.05) drop-shadow(0 4px 6px rgba(0, 194, 203, 0.15))",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT CARD */}
              <div
                className="absolute bg-white rounded-xl"
                style={{
                  width: "clamp(170px, 14vw, 210px)",
                  height: "clamp(240px, 20vw, 290px)",
                  boxShadow: cardShadow,
                  zIndex: 1,
                  transform: "translateX(clamp(260px, 13vw, 360px))",
                }}
              >
                <div className="absolute inset-0 rounded-[inherit] ring-1 ring-[#00c2cb]" />

                <div className="flex items-center justify-center h-full p-2">
                  <div className="relative w-full h-full bg-white rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                      src={staticImages[2]?.imagePath ?? ""}
                      alt={staticImages[2]?.title ?? "Right image"}
                      fill
                      draggable={false}
                      className="object-contain"
                      sizes="(min-width: 1280px) 160px, (min-width: 1024px) 150px, 130px"
                      style={{
                        opacity: 0.85,
                        filter:
                          "brightness(1) contrast(1.05) drop-shadow(0 4px 6px rgba(0, 194, 203, 0.15))",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* MAIN CARD */}
              <div
                className="bg-white rounded-xl relative"
                style={{
                  width: "clamp(260px, 22vw, 320px)",
                  height: "clamp(360px, 30vw, 440px)",
                  boxShadow: mainShadow,
                  zIndex: 2,
                }}
              >
                <div className="absolute inset-0 rounded-[inherit] ring-1 ring-[#00c2cb]" />

                <div className="flex items-center justify-center h-full p-3">
                  <div className="relative w-full h-full bg-white rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                      src={staticImages[1]?.imagePath ?? ""}
                      alt={staticImages[1]?.title ?? "Main image"}
                      fill
                      draggable={false}
                      className="object-contain"
                      sizes="(min-width: 1280px) 240px, (min-width: 1024px) 220px, 200px"
                      style={{
                        filter: "drop-shadow(0 10px 20px rgba(0, 194, 203, 0.25))",
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
