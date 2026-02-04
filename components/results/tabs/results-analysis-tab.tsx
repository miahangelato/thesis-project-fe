"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ResultsParticipantData } from "@/types/results";

import { Info } from "lucide-react";

const normalizeText = (text: string) => {
  const lines = text
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => line.replace(/^\d+\.\s*/, ""));

  const result = [];
  let i = 0;

  while (i < lines.length) {
    const currentLine = lines[i];

    if (
      currentLine.toLowerCase().includes("what this result") ||
      currentLine.toLowerCase().includes("scientific basis") ||
      currentLine.toLowerCase().includes("recommendations") ||
      currentLine.toLowerCase().includes("what influenced") ||
      currentLine.toLowerCase().includes("what you can")
    ) {
      result.push(currentLine);

      if (i + 1 < lines.length) {
        const nextLine = lines[i + 1];
        const isNextHeading =
          nextLine.toLowerCase().includes("what this result") ||
          nextLine.toLowerCase().includes("scientific basis") ||
          nextLine.toLowerCase().includes("recommendations") ||
          nextLine.toLowerCase().includes("what influenced") ||
          nextLine.toLowerCase().includes("what you can");

        if (!isNextHeading) {
          result.push(nextLine);
          i += 2;
        } else {
          i += 1;
        }
      } else {
        i += 1;
      }

      if (i < lines.length) {
        result.push("");
      }
    } else {
      result.push(currentLine);
      i += 1;
    }
  }

  return result.join("\n");
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const computeNextDelayMs = (_nextChar: string, _lookbehind: string) => {
  // Consistent delay slow enough for readers to follow along comfortably
  const base = 25;
  const jitter = Math.floor(Math.random() * 10); // 0-9ms
  return clamp(base + jitter, 5, 1200);
};

const hashText = (text: string) => {
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
};

export function ResultsAnalysisTab({
  participantData,
}: {
  participantData: ResultsParticipantData;
}) {
  const rawExplanation = normalizeText(participantData?.explanation ?? "");
  const [typedCount, setTypedCount] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const completionKey = useMemo(() => {
    if (!rawExplanation) return "";
    return `analysis_typewriter_done:${hashText(rawExplanation)}`;
  }, [rawExplanation]);

  const isComplete = typedCount >= rawExplanation.length;

  useEffect(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;

    if (!rawExplanation) {
      setTypedCount(0);
      return;
    }

    try {
      if (completionKey && window.sessionStorage.getItem(completionKey) === "1") {
        setTypedCount(rawExplanation.length);
        return;
      }
    } catch {}

    setTypedCount(0);
  }, [completionKey, rawExplanation]);

  useEffect(() => {
    if (!rawExplanation) return;
    if (isComplete) return;

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    const nextIndex = Math.min(rawExplanation.length, typedCount + 1);
    const nextChar = rawExplanation.charAt(typedCount);
    const lookbehind = rawExplanation.slice(Math.max(0, typedCount - 8), typedCount);
    const delay = computeNextDelayMs(nextChar, lookbehind);

    timeoutRef.current = window.setTimeout(() => {
      setTypedCount(nextIndex);
    }, delay);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };
  }, [isComplete, rawExplanation, typedCount]);

  useEffect(() => {
    if (!rawExplanation) return;
    if (!isComplete) return;
    if (!completionKey) return;

    try {
      window.sessionStorage.setItem(completionKey, "1");
    } catch {}
  }, [completionKey, isComplete, rawExplanation]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (isComplete) return;
    el.scrollTop = el.scrollHeight;
  }, [isComplete, typedCount]);

  const displayText = rawExplanation.slice(0, typedCount);

  return (
    <div className="h-full min-h-0 flex flex-col">
      {participantData?.explanation && (
        <div className="flex flex-col flex-1 min-h-0 h-full">
          <div className="flex items-start justify-between gap-4 p-6 pb-0">
            <h3 className="font-bold text-4xl text-teal-800 flex items-center">
              <Info className="w-10 h-10 mr-3 text-teal-600" />
              AI-Generated Health Insights
            </h3>
          </div>

          <div className="relative flex-1 min-h-0">
            <div
              ref={scrollRef}
              className="h-full max-h-[640] overflow-y-auto overflow-x-hidden text-slate-900 leading-relaxed text-3xl w-full px-14 mt-5"
            >
              {displayText
                .replace(/\r\n/g, "\n")
                .split("\n")
                .map((l) => l.trim())
                .filter((l) => l.length > 0)
                .map((line, idx, arr) => {
                  const lower = line.toLowerCase();
                  const isHeading =
                    lower.includes("what this result") ||
                    lower.includes("scientific basis") ||
                    lower.includes("recommendations") ||
                    lower.includes("what influenced") ||
                    lower.includes("what you can");

                  if (isHeading) {
                    return (
                      <h4 key={idx} className="text-4xl font-semibold text-teal-800 mt-6">
                        {line}
                        {!isComplete && idx === arr.length - 1 && (
                          <span className="inline-block animate-pulse text-teal-500 ml-3">
                            ▍
                          </span>
                        )}
                      </h4>
                    );
                  }

                  return (
                    <div key={idx} className="flex items-start gap-4 mt-4">
                      <span className="text-teal-500 text-4xl">✧</span>
                      <span className="whitespace-pre-wrap">
                        {line}
                        {!isComplete && idx === arr.length - 1 && (
                          <span className="inline-block animate-pulse text-teal-500 ml-2">
                            ▍
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
