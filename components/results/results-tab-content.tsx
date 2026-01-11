import React from "react";

import { ResultsAnalysisTab } from "@/components/results/tabs/results-analysis-tab";
import { ResultsBloodTab } from "@/components/results/tabs/results-blood-tab";
import { ResultsDownloadTab } from "@/components/results/tabs/results-download-tab";
import { ResultsFacilitiesTab } from "@/components/results/tabs/results-facilities-tab";
import type { ResultsParticipantData } from "@/types/results";

type TabType = "analysis" | "facilities" | "blood" | "download";

export function ResultsTabContent({
  activeTab,
  participantData,
  canShowBloodTab,
}: {
  activeTab: TabType;
  participantData: ResultsParticipantData;
  canShowBloodTab: boolean;
}) {
  const contentClassName =
    activeTab === "analysis"
      ? "h-full overflow-hidden p-5"
      : "h-full overflow-y-auto p-5";

  return (
    <div className="flex-1 bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden min-h-0">
      <div className={contentClassName}>
        {/* RESULTS */}
        {activeTab === "analysis" && (
          <ResultsAnalysisTab participantData={participantData} />
        )}

        {/* FACILITIES */}
        {activeTab === "facilities" && (
          <ResultsFacilitiesTab participantData={participantData} />
        )}

        {/* BLOOD DONATION */}
        {activeTab === "blood" && (
          <ResultsBloodTab
            participantData={participantData}
            canShowBloodTab={canShowBloodTab}
          />
        )}

        {activeTab === "download" && (
          <ResultsDownloadTab
            qrCodeUrl={participantData.qr_code_url}
            downloadUrl={participantData.download_url}
          />
        )}
      </div>
    </div>
  );
}
