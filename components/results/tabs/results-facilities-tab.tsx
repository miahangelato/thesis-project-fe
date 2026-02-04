"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { FullScreenLoader } from "@/components/ui/full-screen-loader";
import type { MapPlace, ResultsParticipantData } from "@/types/results";
import { Hospital, MapPin, Phone, Smartphone, Mail } from "lucide-react";

export function ResultsFacilitiesTab({
  participantData,
  onOpenQR,
}: {
  participantData: ResultsParticipantData;
  onOpenQR: (facility: MapPlace) => void;
}) {
  const router = useRouter();
  const [loadingMore, setLoadingMore] = useState(false);

  const handleViewMore = useCallback(async () => {
    try {
      setLoadingMore(true);
      // small delay so loader is perceptible
      await new Promise((res) => setTimeout(res, 600));
      await router.push("/results/hospitals");
    } finally {
      setLoadingMore(false);
    }
  }, [router]);

  return (
    <>
      <FullScreenLoader
        isOpen={loadingMore}
        title="Loading centers"
        subtitle="Fetching nearby health facilities..."
        useDefaultSteps={false}
      />
      <div className="h-full min-h-0 flex flex-col">
        {participantData?.nearby_facilities &&
          participantData.nearby_facilities.length > 0 && (
            <div className="flex flex-col flex-1 min-h-0 h-full">
              <div className="flex items-start justify-between gap-4 mb-6 p-6 pb-0">
                <h2 className="text-4xl font-bold text-teal-900 flex items-center">
                  <Hospital className="w-10 h-10 mr-3 text-teal-600" />
                  Health Facilities Near You
                </h2>
              </div>

              <div className="relative flex-1 min-h-0">
                <div className="h-full overflow-y-auto px-6 pb-6 space-y-6">
                  {participantData.nearby_facilities.slice(0, 3).map((facility, idx) => (
                    <div
                      key={idx}
                      className="bg-white border-2 border-gray-100 rounded-4xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col min-h-[400px]"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center shrink-0 border border-teal-100">
                            <Hospital className="w-8 h-8 text-teal-600" />
                          </div>
                          <h4 className="font-bold text-3xl text-gray-900 leading-tight">
                            {facility.name}
                          </h4>
                        </div>

                        <div className="flex items-start gap-1 mb-4">
                          <MapPin className="w-8 h-8 text-gray-400 mt-1 shrink-0" />
                          <p className="text-2xl text-gray-500 font-medium leading-relaxed">
                            {facility.address}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {facility.type && (
                            <span className="inline-flex items-center px-4 py-2 bg-teal-50 text-teal-700 rounded-xl text-xl font-bold border border-teal-100">
                              {facility.type}
                            </span>
                          )}
                        </div>

                        <div className="space-y-3 mb-6">
                          {facility.phone && (
                            <div className="flex items-center gap-3 text-gray-600 font-bold text-2xl">
                              <Phone className="w-8 h-8 text-teal-500" /> {facility.phone}
                            </div>
                          )}
                          {facility.email && (
                            <div className="flex items-center gap-3 text-gray-500 font-medium text-2xl">
                              <Mail className="w-8 h-8 text-gray-400" /> {facility.email}
                            </div>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenQR(facility)}
                        className="w-full group relative overflow-hidden bg-white border-2 border-teal-500 hover:bg-teal-50 p-6 rounded-2xl transition-all active:scale-[0.98] cursor-pointer"
                      >
                        <div className="flex items-center justify-center gap-4">
                          <Smartphone className="w-14 h-14 text-teal-600" />
                          <div className="text-left">
                            <p className="text-3xl font-bold text-teal-900">
                              Get Info on Mobile
                            </p>
                            <p className="text-2xl font-bold text-teal-600/70 uppercase tracking-wider">
                              Scan QR Code
                            </p>
                          </div>
                        </div>
                      </button>
                    </div>
                  ))}

                  <div className="pt-2 pb-4 text-center">
                    <button
                      onClick={handleViewMore}
                      className="inline-flex items-center justify-center rounded-2xl bg-[#00c2cb] hover:bg-[#0099a0] px-12 py-6 text-4xl font-bold text-white shadow-lg shadow-cyan-100/50 transition-all transform hover:scale-[1.02] cursor-pointer"
                    >
                      View more facilities →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </>
  );
}
