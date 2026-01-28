import { FullScreenLoader } from "@/components/ui/full-screen-loader";
import { ShieldCheck, Settings2, ScanLine } from "lucide-react";

type PreparingScanOverlayProps = {
  isOpen: boolean;
};

export function PreparingScanOverlay({ isOpen }: PreparingScanOverlayProps) {
  const preparationSteps = [
  {
    label: "Preparing Scanner",
    description: "Getting the scanner ready",
    status: "current" as const,
    icon: ScanLine,
  },
  {
    label: "Setting Up Session",
    description: "Preparing the scan process",
    status: "pending" as const,
    icon: ShieldCheck,
  },
];


  return (
    <FullScreenLoader
      isOpen={isOpen}
      title="Preparing Scanner"
      subtitle="Configuring scanner and secure session..."
      steps={preparationSteps}
      useDefaultSteps={false}
      footerText="This should only take a few seconds"
    />
  );
}
