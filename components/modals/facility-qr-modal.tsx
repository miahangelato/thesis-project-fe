"use client";
import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/components/ui/button";
import { ModalShell } from "@/components/ui/modal-shell";
import { X, MapPin, Globe, Facebook, Smartphone, Info } from "lucide-react";

interface FacilityQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility: {
    name: string;
    google_query: string;
    website?: string;
    facebook?: string;
  } | null;
}

export function FacilityQRModal({ isOpen, onClose, facility }: FacilityQRModalProps) {
  type TabId = "location" | "website" | "facebook";
  type Tab = {
    id: TabId;
    label: string;
    icon: typeof MapPin;
    value?: string;
  };
  const [activeTab, setActiveTab] = useState<TabId>("location");

  if (!isOpen || !facility) return null;

  const allTabs: Tab[] = [
    {
      id: "location",
      label: "Location",
      icon: MapPin,
      value: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        facility.google_query
      )}`,
    },
    { id: "website", label: "Website", icon: Globe, value: facility.website },
    { id: "facebook", label: "Facebook", icon: Facebook, value: facility.facebook },
  ];

  const tabs = allTabs.filter((tab): tab is Tab & { value: string } =>
    Boolean(tab.value)
  );

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];
  if (!currentTab) return null;

  const CurrentTabIcon = currentTab.icon;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      zIndexClassName="z-[9999]"
      backdropZIndexClassName="z-[9998]"
      containerClassName="select-none p-4"
      backdropClassName="bg-linear-to-br from-teal-900/30 via-cyan-900/30 to-teal-900/30 backdrop-blur-md"
      panelClassName="rounded-3xl max-w-6xl border-2 border-teal-100 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
      showTopBar
    >
      <div className="p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(550px,360px)_1fr] items-stretch">
          <div className="order-2 lg:order-2 mt-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-2 mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xl font-bold border transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#00c2cb] border-[#00c2cb] text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:text-[#00c2cb]"
                  }`}
                >
                  <tab.icon
                    className={`w-7 h-7 ${activeTab === tab.id ? "text-white" : "text-[#00c2cb]/70"}`}
                  />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-3 flex items-center justify-center">
              <QRCodeSVG
                value={currentTab.value}
                size={400}
                level="H"
                includeMargin={true}
              />
            </div>
            <div className="mt-4 flex items-center gap-3 text-slate-600">
              <Info className="w-5 h-5 text-[#00c2cb] shrink-0" />
              <p className="text-xl font-semibold">Point your camera at the code</p>
            </div>
          </div>

          <div className="order-1 lg:order-1 flex flex-col">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 bg-linear-to-br from-teal-50 to-cyan-50 rounded-2xl flex items-center justify-center border border-teal-100 shrink-0">
                <Smartphone className="w-10 h-10 text-[#00c2cb]" />
              </div>
              <div>
                <h2 className="text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                  Take Info with You
                </h2>
                <p className="text-slate-600 font-medium text-2xl leading-relaxed mt-2">
                  Scan to access on your mobile device
                </p>
              </div>
            </div>

            <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-6 mb-5 shadow-sm">
              <p className="text-xl font-extrabold text-teal-700 uppercase tracking-wide mb-2">
                Facility
              </p>
              <p className="text-4xl font-bold text-slate-900 leading-tight">
                {facility.name}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                  <CurrentTabIcon className="w-7 h-7 text-[#00c2cb]" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    Current QR: {currentTab.label}
                  </p>
                  <p className="text-xl text-slate-600 mt-1 leading-relaxed">
                    Switch tabs on the left to generate QR for location, website, or
                    Facebook.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <Button
                onClick={onClose}
                className="w-full h-20 text-2xl font-bold rounded-2xl bg-[#00c2cb] hover:bg-[#00adb5] text-white shadow-lg shadow-teal-100/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
