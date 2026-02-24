"use client";
import { useEffect, useState } from "react";

import { sessionAPI } from "@/lib/api";
import type {
  BloodGroupResult,
  DiabetesResult,
  MapPlace,
  ResultsParticipantData,
  StoredDemographics,
} from "@/types/results";

const inflightFinalResultsFetches = new Map<
  string,
  Promise<Record<string, unknown> | null>
>();

const normalizeBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["yes", "y", "true", "1", "on"].includes(normalized);
  }
  return false;
};

const coerceNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const numeric = Number(trimmed);
    return Number.isFinite(numeric) ? numeric : null;
  }
  return null;
};

const decodeBase64Json = (encoded: string) => {
  try {
    const binary = atob(encoded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
};

const encodeBase64Json = (payload: unknown) => {
  const json = JSON.stringify(payload);
  const utf8Bytes = new TextEncoder().encode(json);
  let binary = "";
  utf8Bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
};

const readDemographicsFromSessionStorage = (): StoredDemographics | null => {
  if (typeof window === "undefined") return null;

  const storedDemo = window.sessionStorage.getItem("demographics");
  if (!storedDemo) {
    return null;
  }

  try {
    const parsed = JSON.parse(storedDemo) as StoredDemographics;
    return parsed;
  } catch {
    return null;
  }
};

const readRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object") return null;
  return value as Record<string, unknown>;
};

export function useResultsData(sessionId: string | null) {
  const [result, setResult] = useState<DiabetesResult | null>(null);
  const [bloodGroupResult, setBloodGroupResult] = useState<BloodGroupResult | null>(null);
  const [participantData, setParticipantData] = useState<ResultsParticipantData | null>(
    null
  );
  const [demographics] = useState<StoredDemographics | null>(
    readDemographicsFromSessionStorage
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const setFromPayload = (rawPayload: unknown, activeSessionId: string) => {
      const dataObj = readRecord(rawPayload) ?? {};
      const demographicsObj = readRecord(dataObj.demographics);

      let storedDemographics: StoredDemographics | null = null;
      const storedDemoRaw = sessionStorage.getItem("demographics");
      if (storedDemoRaw) {
        try {
          storedDemographics = JSON.parse(storedDemoRaw) as StoredDemographics;
        } catch {}
      }

      const bloodCenters = (
        Array.isArray(dataObj.blood_centers) ? (dataObj.blood_centers as unknown[]) : []
      ) as MapPlace[];
      const nearbyFacilities = (
        Array.isArray(dataObj.nearby_facilities)
          ? (dataObj.nearby_facilities as unknown[])
          : []
      ) as MapPlace[];
      const patternCounts =
        readRecord(dataObj.pattern_counts) ?? ({} as Record<string, unknown>);

      const hasBloodCenters =
        Array.isArray(dataObj.blood_centers) && dataObj.blood_centers.length > 0;
      const willingToDonate =
        normalizeBoolean(demographicsObj?.willing_to_donate) ||
        normalizeBoolean(dataObj.willing_to_donate) ||
        normalizeBoolean(storedDemographics?.willing_to_donate) ||
        hasBloodCenters;

      const riskLevel =
        (typeof dataObj.risk_level === "string" ? dataObj.risk_level : undefined) ||
        "Unknown";
      const riskProbability =
        typeof dataObj.diabetes_risk === "number" ? dataObj.diabetes_risk : undefined;
      const riskScore =
        typeof dataObj.risk_score === "number"
          ? dataObj.risk_score
          : typeof riskProbability === "number"
            ? Number((riskProbability * 100).toFixed(1))
            : undefined;
      const diabetesConfidence =
        typeof dataObj.diabetes_confidence === "number"
          ? dataObj.diabetes_confidence
          : undefined;

      if (cancelled) return dataObj;

      setResult({
        diabetes_risk: riskLevel,
        risk_level: riskLevel,
        risk_score: riskScore,
        confidence: diabetesConfidence,
      });

      setBloodGroupResult({
        predicted_blood_group:
          (typeof dataObj.blood_group === "string" ? dataObj.blood_group : undefined) ||
          "Unknown",
        confidence:
          typeof dataObj.blood_group_confidence === "number"
            ? dataObj.blood_group_confidence
            : 0,
      });

      setParticipantData({
        age: coerceNumber(demographicsObj?.age) ?? coerceNumber(dataObj.age) ?? 0,
        weight:
          coerceNumber(demographicsObj?.weight_kg) ??
          coerceNumber(dataObj.weight_kg) ??
          0,
        height:
          coerceNumber(demographicsObj?.height_cm) ??
          coerceNumber(dataObj.height_cm) ??
          0,
        gender:
          (typeof demographicsObj?.gender === "string"
            ? demographicsObj.gender
            : typeof dataObj.gender === "string"
              ? dataObj.gender
              : "N/A") || "N/A",
        blood_type:
          (typeof dataObj.blood_group === "string" ? dataObj.blood_group : undefined) ||
          "Unknown",
        willing_to_donate: willingToDonate,
        saved:
          typeof dataObj.saved_to_database === "boolean"
            ? dataObj.saved_to_database
            : false,
        participant_id: activeSessionId,
        explanation: typeof dataObj.explanation === "string" ? dataObj.explanation : "",
        blood_centers: bloodCenters,
        nearby_facilities: nearbyFacilities,
        pattern_counts: patternCounts,
        bmi: coerceNumber(dataObj.bmi) ?? 0,
        qr_code_url:
          typeof dataObj.qr_code_url === "string" ? dataObj.qr_code_url : undefined,
        download_url:
          typeof dataObj.download_url === "string" ? dataObj.download_url : undefined,
      });

      return dataObj;
    };

    const persistPayload = (activeSessionId: string, payload: unknown) => {
      const envelope = {
        data: payload,
        expiry: Date.now() + 3600000,
      };
      const encoded = encodeBase64Json(envelope);
      sessionStorage.setItem(activeSessionId, encoded);
      sessionStorage.setItem("current_session_id", activeSessionId);
    };

    const needsFinalizedPayload = (dataObj: Record<string, unknown>) => {
      const hasQr = typeof dataObj.qr_code_url === "string" && dataObj.qr_code_url.length > 0;
      const hasDownload =
        typeof dataObj.download_url === "string" && dataObj.download_url.length > 0;
      const hasRiskScore =
        typeof dataObj.risk_score === "number" || typeof dataObj.diabetes_risk === "number";
      const hasConfidence = typeof dataObj.diabetes_confidence === "number";
      return !(hasQr && hasDownload && hasRiskScore && hasConfidence);
    };

    const fetchLatestResults = async (activeSessionId: string) => {
      const existingFetch = inflightFinalResultsFetches.get(activeSessionId);
      if (existingFetch) {
        const sharedPayload = await existingFetch;
        if (sharedPayload && !cancelled) {
          setFromPayload(sharedPayload, activeSessionId);
        }
        return sharedPayload;
      }

      const requestPromise = (async () => {
        try {
          const response = await sessionAPI.getResults(activeSessionId);
          const payload = readRecord(response.data);
          if (payload) {
            // Persist first so strict-mode remounts can still read the finalized data.
            persistPayload(activeSessionId, payload);
          }
          return payload;
        } catch {
          return null;
        } finally {
          inflightFinalResultsFetches.delete(activeSessionId);
        }
      })();

      inflightFinalResultsFetches.set(activeSessionId, requestPromise);
      const latestPayload = await requestPromise;
      if (latestPayload && !cancelled) {
        setFromPayload(latestPayload, activeSessionId);
      }
      return latestPayload;
    };

    const fetchData = async () => {
      let activeSessionId = sessionId;
      if (!activeSessionId) {
        activeSessionId = sessionStorage.getItem("current_session_id");
      }

      if (!activeSessionId) {
        setLoading(false);
        return;
      }

      const encodedData = sessionStorage.getItem(activeSessionId);

      if (encodedData) {
        const dataWithExpiry = decodeBase64Json(encodedData);

        if (!dataWithExpiry) {
          setLoading(false);
          return;
        }

        const expiry = (dataWithExpiry as { expiry?: unknown })?.expiry;
        if (typeof expiry === "number" && Date.now() > expiry) {
          sessionStorage.removeItem(activeSessionId);
        } else {
          const payload = (dataWithExpiry as { data?: unknown })?.data;
          const mapped = setFromPayload(payload, activeSessionId);
          setLoading(false);

          if (needsFinalizedPayload(mapped)) {
            void fetchLatestResults(activeSessionId);
          }
          return;
        }
      }

      await fetchLatestResults(activeSessionId);
      if (!cancelled) {
        setLoading(false);
      }
    };

    void fetchData();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return {
    loading,
    result,
    bloodGroupResult,
    participantData,
    demographics,
  } as const;
}
