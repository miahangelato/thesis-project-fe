"use client";
import { useEffect, useRef, useState } from "react";

import { flushSync } from "react-dom";
import { useRouter } from "next/navigation";

import { sessionAPI } from "@/lib/api";
import { useSession } from "@/contexts/session-context";
import { useScanSession } from "@/hooks/use-scan-session";
import { useBackNavigation } from "@/hooks/use-back-navigation";

import { getErrorMessage } from "@/lib/errors";
import { ROUTES, STEPS } from "@/lib/constants";
import { FINGER_NAMES } from "@/lib/finger-names";

import { ProgressHeader } from "@/components/layout/progress-header";
import { StepNavigation } from "@/components/layout/step-navigation";
import { Footer } from "@/components/layout/footer";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { SessionEndModal } from "@/components/modals/session-end-modal";

import {
  AnalysisLoadingOverlay,
  FinishConfirmationModal,
} from "@/components/modals/finish-modal";
import { Toast } from "@/components/ui/toast";
import { ScanInfoPanel } from "@/components/scan/scan-info-panel";
import { ScanAssistantCard } from "@/components/scan/scan-assistant-card";
import { ScanSessionModals } from "@/components/scan/scan-session-modals";
import { RetakeConfirmModal } from "@/components/modals/retake-confirm-modal";
import { ScanConfirmationModal } from "@/components/modals/scan-confirmation-modal";

export default function ScanPage() {
  const router = useRouter();
  const { sessionId, setCurrentStep } = useSession();
  const [loading, setLoading] = useState(false);
  const localUploadInputRef = useRef<HTMLInputElement | null>(null);
  const localUploadShortcutEnabled =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_ENABLE_LOCAL_UPLOAD_SHORTCUT === "true";

  const [analysisOverlayOpen, setAnalysisOverlayOpen] = useState(false);
  const [analysisOverlayState, setAnalysisOverlayState] = useState<"loading" | "error">(
    "loading"
  );
  const [analysisOverlayError, setAnalysisOverlayError] = useState<string | undefined>(
    undefined
  );

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const overlayTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      const overlayTimeoutId = overlayTimeoutRef.current;
      if (overlayTimeoutId) window.clearTimeout(overlayTimeoutId);
    };
  }, []);

  useEffect(() => {
    try {
      const flag = sessionStorage.getItem("show_initial_analysis_overlay");
      if (flag) {
        sessionStorage.removeItem("show_initial_analysis_overlay");
        setAnalysisOverlayOpen(true);
        setAnalysisOverlayState("loading");
        overlayTimeoutRef.current = window.setTimeout(() => {
          setAnalysisOverlayOpen(false);
        }, 1500);
      }
    } catch (e) {}
  }, []);

  const showErrorToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  const {
    currentFingerIndex,
    fingerFiles,
    demographics,
    countdown,
    scannerReady,
    scanningStarted,
    paused,
    totalFingers,
    scannedCount,
    currentFinger,
    hand,
    highlight,
    scanAssistantState,
    firstUnscannedIndex,
    setScannerReady,
    setScanningStarted,
    setCountdown,
    handleResetSession,
    handleCapture,
    handleNextFinger,
    handlePreviousFinger,
    togglePaused,
    handleRescan,
    rescanningFinger,
  } = useScanSession();

  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showScanConfirmModal, setShowScanConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRetakeModal, setShowRetakeModal] = useState(false);
  const { showModal, handleConfirm, handleCancel, promptBackNavigation } =
    useBackNavigation(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);

  const saveSessionResultPayload = (activeSessionId: string, payload: unknown) => {
    const resultsData = {
      data: payload,
      expiry: Date.now() + 3600000,
    };

    const json = JSON.stringify(resultsData);
    const utf8Bytes = new TextEncoder().encode(json);
    let binary = "";
    utf8Bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });
    const encodedData = btoa(binary);
    sessionStorage.setItem(activeSessionId, encodedData);
    sessionStorage.setItem("current_session_id", activeSessionId);
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setAnalysisOverlayOpen(true);
    setAnalysisOverlayState("loading");
    setAnalysisOverlayError(undefined);
    try {
      const activeSessionId = sessionId || sessionStorage.getItem("current_session_id");

      if (!activeSessionId) {
        setAnalysisOverlayState("error");
        setAnalysisOverlayError("No session ID. Please restart the workflow.");
        overlayTimeoutRef.current = window.setTimeout(() => {
          setAnalysisOverlayOpen(false);
          showErrorToast("No session ID. Please restart the workflow.");
        }, 1400);
        setLoading(false);
        return;
      }

      const readFileAsDataUrl = (file: File, finger: string) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string) || "");
          reader.onerror = () => reject(new Error(`Failed to read file for ${finger}`));
          reader.readAsDataURL(file);
        });

      // Keep uploads sequential so a single backend worker is not overloaded.
      for (const [finger, file] of Object.entries(fingerFiles)) {
        if (!file) continue;
        const base64 = await readFileAsDataUrl(file, finger);
        await sessionAPI.submitFingerprint(activeSessionId, {
          finger_name: finger,
          image: base64,
        });
      }

      const analyzeResponse = await sessionAPI.analyze(activeSessionId);
      saveSessionResultPayload(activeSessionId, analyzeResponse.data);
      flushSync(() => {
        setCurrentStep(STEPS.RESULTS);
      });
      setAnalysisOverlayOpen(false);
      router.push(ROUTES.RESULTS);

      // Do not block UI on post-processing (PDF/DB save). Refresh cached result when ready.
      void sessionAPI
        .getResults(activeSessionId)
        .then((resultsResponse) => {
          saveSessionResultPayload(activeSessionId, resultsResponse.data);
        })
        .catch(() => {
          // Non-fatal: user already sees analysis results.
        });
    } catch (err) {
      const message = getErrorMessage(err);

      setAnalysisOverlayState("error");
      setAnalysisOverlayError(message);

      overlayTimeoutRef.current = window.setTimeout(() => {
        setAnalysisOverlayOpen(false);
        showErrorToast("Analyzing fingerprints failed. Please try submitting again.");
      }, 1400);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishClick = () => {
    if (loading) return;
    setShowFinishModal(true);
  };

  const handleFinishConfirm = async () => {
    if (loading) return;
    setShowFinishModal(false);
    await handleSubmit();
  };

  const handleFinishCancel = () => {
    setShowFinishModal(false);
  };

  const handleRetakeClick = () => {
    setShowRetakeModal(true);
  };

  const handleRetakeConfirm = () => {
    setShowRetakeModal(false);
    handleRescan();
  };

  useEffect(() => {
    if (!localUploadShortcutEnabled) return;

    const handleLocalUploadShortcut = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const isShortcut = (event.ctrlKey || event.metaKey) && key === "u";
      if (!isShortcut) return;

      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      event.preventDefault();
      if (!loading) {
        localUploadInputRef.current?.click();
      }
    };

    window.addEventListener("keydown", handleLocalUploadShortcut, true);
    return () => {
      window.removeEventListener("keydown", handleLocalUploadShortcut, true);
    };
  }, [loading, localUploadShortcutEnabled]);

  return (
    <ProtectedRoute requireSession={true} requiredStep={STEPS.SCAN}>
      <>
        <input
          ref={localUploadInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            if (!file.type.startsWith("image/")) {
              showErrorToast("Please select an image file.");
              return;
            }
            if (!scanningStarted) {
              setScanningStarted(true);
            }
            handleCapture(currentFinger, file);
            setToastMessage(
              `Uploaded ${FINGER_NAMES[currentFinger]} using local shortcut.`
            );
            setToastOpen(true);
          }}
        />

        <Toast
          open={toastOpen}
          message={toastMessage}
          variant="error"
          onClose={() => setToastOpen(false)}
        />

        <FinishConfirmationModal
          isOpen={showFinishModal}
          loading={loading}
          onConfirm={handleFinishConfirm}
          onCancel={handleFinishCancel}
        />

        <SessionEndModal
          isOpen={showModal}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />

        <ScanConfirmationModal
          isOpen={showScanConfirmModal}
          onConfirm={() => {
            setShowScanConfirmModal(false);
            setScanningStarted(true);
            setCountdown(5);
          }}
          onCancel={() => setShowScanConfirmModal(false)}
        />

        <ScanSessionModals
          showCancelModal={showCancelModal}
          onCloseCancel={() => setShowCancelModal(false)}
          onConfirmCancel={() => {
            handleResetSession();
            setShowCancelModal(false);
          }}
          showResetConfirmModal={showResetConfirmModal}
          onCloseReset={() => setShowResetConfirmModal(false)}
          onConfirmReset={() => {
            handleResetSession();
            setShowResetConfirmModal(false);
          }}
        />

        <RetakeConfirmModal
          isOpen={showRetakeModal}
          fingerName={FINGER_NAMES[currentFinger]}
          onConfirm={handleRetakeConfirm}
          onCancel={() => setShowRetakeModal(false)}
        />

        <AnalysisLoadingOverlay
          isOpen={analysisOverlayOpen}
          state={analysisOverlayState}
          errorMessage={analysisOverlayError}
        />

        <div className="h-screen px-28 py-4 bg-white flex flex-col overflow-hidden">
          <main className="flex-1 w-full flex flex-col">
            <div className="h-full flex flex-col px-6">
              <ProgressHeader
                currentStep={STEPS.SCAN}
                totalSteps={4}
                title="Fingerprint Scan"
                subtitle="Scan your fingerprints for analysis"
                accentColor="#00c2cb"
                onEndSession={promptBackNavigation}
              />
              <div>
                {/* Left Panel - Scanning Interface - FIXED WIDTH */}
                <div className="col-span-7 flex flex-col h-full max-w-350 mx-auto">
                  <ScanAssistantCard
                    loading={loading}
                    setScannerReady={setScannerReady}
                    currentFingerIndex={currentFingerIndex}
                    fingerFiles={fingerFiles}
                    countdown={countdown}
                    scanningStarted={scanningStarted}
                    paused={paused}
                    totalFingers={totalFingers}
                    scannedCount={scannedCount}
                    currentFinger={currentFinger}
                    hand={hand}
                    highlight={highlight}
                    scanAssistantState={scanAssistantState}
                    firstUnscannedIndex={firstUnscannedIndex}
                    onRequestStartScanning={() => setShowScanConfirmModal(true)}
                    onOpenCancelModal={() => {
                      if (!paused) togglePaused();
                      setShowCancelModal(true);
                    }}
                    onOpenResetModal={() => setShowResetConfirmModal(true)}
                    onCapture={handleCapture}
                    onPreviousFinger={handlePreviousFinger}
                    onNextFinger={handleNextFinger}
                    onTogglePaused={togglePaused}
                    onRescan={handleRetakeClick}
                    rescanningFinger={rescanningFinger}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-2 mb-4 select-none">
              <StepNavigation
                onBack={() => router.back()}
                isSubmit={false}
                loading={loading}
                isNextDisabled={loading || scannedCount < totalFingers}
                nextLabel="Finish & Analyze"
                onNext={handleFinishClick}
              />
            </div>
          </main>

          <Footer
            transparent
            customContent={<>No needles • Non-invasive • Privacy-first</>}
          />
        </div>
      </>
    </ProtectedRoute>
  );
}
