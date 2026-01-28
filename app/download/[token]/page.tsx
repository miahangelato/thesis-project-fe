import { Suspense } from "react";
import { TokenDownloadContent } from "./token-download-content";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";

export const dynamic = "force-dynamic";

export default function TokenDownloadPage() {
  return (
    <Suspense fallback={<FullScreenLoader title="Loading..." subtitle="Please wait" />}>
      <TokenDownloadContent />
    </Suspense>
  );
}
