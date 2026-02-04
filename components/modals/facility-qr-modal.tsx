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

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      zIndexClassName="z-[9999]"
      backdropZIndexClassName="z-[9998]"
      containerClassName="p-4"
      backdropClassName="bg-slate-900/80 backdrop-blur-lg"
      panelClassName="max-w-3xl rounded-[2.5rem] border-2 border-[#00c2cb] flex flex-col shadow-2xl shadow-[#00c2cb]/20"
      showTopBar
    >
      <div className="p-7 bg-linear-to-br from-white to-[#f0fdfa]">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 bg-linear-to-br from-[#00c2cb] to-[#00adb5] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00c2cb]/30">
              <Smartphone className="w-14 h-14 text-white" />
            </div>
            <div>
              <h2 className="text-5xl font-bold text-slate-900 leading-tight">
                Take Info with You
              </h2>
              <p className="text-slate-600 font-semibold text-2xl">
                Scan to access on your mobile device
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-[#00c2cb]/10 rounded-full transition-all duration-200 group cursor-pointer"
          >
            <X className="w-12 h-12 text-slate-400 group-hover:text-[#00c2cb] transition-colors" />
          </button>
        </div>

        <div className="bg-linear-to-r from-[#00c2cb]/10 to-[#00adb5]/10 rounded-2xl p-5 mb-6 border-2 border-[#00c2cb]/20 min-h-[110px] flex flex-col justify-center shadow-inner">
          <p className="text-2xl font-black text-[#00c2cb] uppercase tracking-widest mb-2">
            Facility
          </p>
          <p className="text-4xl font-black text-slate-900 leading-tight">
            {facility.name}
          </p>
        </div>

        <div className="flex gap-2 mb-6 bg-linear-to-r from-[#00c2cb]/5 to-[#00adb5]/5 p-2 rounded-2xl border border-[#00c2cb]/15">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-3xl font-bold transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-linear-to-r from-[#00c2cb] to-[#00adb5] text-white shadow-lg shadow-[#00c2cb]/30 transform scale-[1.02]"
                  : "text-slate-600 hover:text-[#00c2cb] hover:bg-white/70 font-semibold"
              }`}
            >
              <tab.icon
                className={`w-10 h-10 ${activeTab === tab.id ? "text-white" : "text-[#00c2cb]/60"}`}
              />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center bg-linear-to-br from-white to-[#f8fafc] border-2 border-[#00c2cb]/30 rounded-4xl p-6 mb-6 shadow-xl">
          <div className="bg-white p-2 rounded-3xl shadow-2xl border-2 border-[#00c2cb]/20">
            <QRCodeSVG
              value={currentTab.value}
              size={300}
              level="H"
              includeMargin={true}
            />
          </div>
          <div className="mt-8 flex items-center gap-3 bg-linear-to-r from-[#00c2cb] to-[#00adb5] text-white px-6 py-4 rounded-full shadow-lg shadow-[#00c2cb]/30">
            <Info className="w-6 h-6" />
            <p className="text-3xl font-bold">Point your camera at the code</p>
          </div>
        </div>

        <Button
          onClick={onClose}
          className="w-full h-16 bg-linear-to-r from-[#00c2cb] to-[#00adb5] hover:from-[#00adb5] hover:to-[#00c2cb] text-white text-4xl font-black rounded-2xl shadow-xl shadow-[#00c2cb]/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] border-2 border-[#00c2cb]/20 cursor-pointer"
        >
          Done
        </Button>
      </div>
    </ModalShell>
  );
}
