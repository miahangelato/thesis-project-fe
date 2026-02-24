"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { ROUTES, STEPS } from "@/lib/constants";
import { useSession } from "@/contexts/session-context";

import { sessionAPI } from "@/lib/api";

import { Footer } from "@/components/layout/footer";
import { WarningHeader } from "@/components/layout/warning-header";
import { MainLanding } from "@/components/features/landing/main-landing";
import { ConsentModal } from "@/components/modals/consent-modal";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";

import { ShieldCheck, ScanLine, FileText, User, BarChart3 } from "lucide-react";

const features = [
  {
    title: "Consent",
    description:
      "Review and agree to our privacy-focused consent form before proceeding.",
    icon: <FileText />,
  },
  {
    title: "Personal Information",
    description:
      "Provide your age, gender, height, and weight, and choose whether to view detailed results.",
    icon: <User />,
  },
  {
    title: "Fingerprint Scan & Analysis",
    description: "Scan your fingerprint for AI-based dermatoglyphic analysis.",
    icon: <ScanLine />,
  },
  {
    title: "Results & Recommendations",
    description:
      "View your predictions, risk assessment, and nearby hospitals and blood donation centers.",
    icon: <BarChart3 />,
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { setSession, sessionId, setCurrentStep, clearSession } = useSession();
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isSubmittingConsent, setIsSubmittingConsent] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consent, setConsent] = useState(false);

  const handleStartClick = async () => {
    setIsStartingSession(true);
    try {
      const response = await sessionAPI.start(false);

      const session_id = response.data?.session_id || response.data?.sessionId;

      if (session_id) {
        setSession(session_id, false);
        setCurrentStep(STEPS.CONSENT);
        setConsent(false);
        setShowConsentModal(true);
      } else {
        throw new Error("Invalid session response");
      }
    } catch {
      const mockId = "dev-session-" + Date.now();
      setSession(mockId, false);
      setCurrentStep(STEPS.CONSENT);
      setConsent(false);
      setShowConsentModal(true);
    } finally {
      setIsStartingSession(false);
    }
  };

  const handleCancelConsent = () => {
    if (isSubmittingConsent) return;
    setShowConsentModal(false);
    setConsent(false);
    clearSession();
  };

  const handleContinueConsent = async () => {
    if (isSubmittingConsent) return;

    setIsSubmittingConsent(true);
    let shouldResetSubmitting = true;

    try {
      if (!sessionId) {
        throw new Error("[SESSION] Missing session ID during consent update");
      }

      await sessionAPI.updateConsent(sessionId, consent);
      setSession(sessionId, consent);

      setCurrentStep(STEPS.DEMOGRAPHICS);
      setShowConsentModal(false);
      shouldResetSubmitting = false;
      router.push(ROUTES.DEMOGRAPHICS);
    } catch (error: unknown) {
      const status =
        typeof error === "object" && error !== null && "response" in error
          ? (error as { response?: { status?: number } }).response?.status
          : undefined;

      if (status === 404) {
        clearSession();
        setShowConsentModal(false);
        router.push(ROUTES.HOME);
      } else {
        console.error("[SESSION] Error updating consent:", error);
      }
    } finally {
      if (shouldResetSubmitting) {
        setIsSubmittingConsent(false);
      }
    }
  };

  const consentSubmissionSteps = [
    {
      label: "Saving Consent",
      description: "Updating your privacy preference",
      status: "current" as const,
      icon: ShieldCheck,
    },
    {
      label: "Preparing Session",
      description: "Setting up your screening flow",
      status: "pending" as const,
      icon: ScanLine,
    },
  ];

  return (
    <div className="relative flex flex-col h-screen w-full page-content-max overflow-hidden">
      <div className="w-full page-container pt-4 pb-0 z-20 select-none">
        <WarningHeader />
      </div>

      <div className="relative flex-1 w-full min-h-0 flex items-center">
        <MainLanding onStartClick={handleStartClick} loading={isStartingSession} />
      </div>

      <div className="w-full page-container pb-2 -mt-8 grid grid-cols-4 gap-6 z-10 select-none">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 border-2 border-[#00c2cb] hover:shadow-xl transition-all duration-200 hover:border-[#00adb5] hover:-translate-y-1 overflow-hidden"
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#e4f7f8] mb-4">
              <span className="text-[#00c2cb] text-6xl">{feature.icon}</span>
            </div>
            <h3 className="text-xl lg:text-4xl font-semibold mb-3 text-gray-800 whitespace-normal">
              {feature.title}
            </h3>
            <p className="text-lg lg:text-2xl text-gray-600 leading-normal whitespace-normal">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="py-5 z-30">
        <Footer />
      </div>

      <ConsentModal
        isOpen={showConsentModal}
        consent={consent}
        loading={isSubmittingConsent}
        onConsentChange={setConsent}
        onCancel={handleCancelConsent}
        onContinue={handleContinueConsent}
      />

      <FullScreenLoader
        isOpen={isSubmittingConsent}
        title="Preparing Session"
        subtitle="Saving your consent and moving to the next step..."
        steps={consentSubmissionSteps}
        useDefaultSteps={false}
        footerText="This should only take a few seconds"
      />
    </div>
  );
}
