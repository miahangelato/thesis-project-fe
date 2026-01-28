import { ModalShell } from "@/components/ui/modal-shell";
import { Button } from "@/components/ui/button";
import { RefreshCcw, AlertCircle } from "lucide-react";

interface RetakeConfirmModalProps {
  isOpen: boolean;
  fingerName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function RetakeConfirmModal({
  isOpen,
  fingerName,
  onConfirm,
  onCancel,
}: RetakeConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onCancel}
      closeOnBackdrop={true}
      closeOnEscape={true}
      zIndexClassName="z-50"
      backdropClassName="bg-slate-900/60 backdrop-blur-md"
      panelClassName="max-w-lg border-2 border-teal-100"
      showTopBar
    >
      <div className="p-10 flex flex-col items-center text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-linear-to-br from-teal-50 to-cyan-50 rounded-3xl flex items-center justify-center shadow-sm border border-teal-100">
            <RefreshCcw className="w-12 h-12 text-[#00c2cb]" strokeWidth={2.5} />
          </div>
          <div className="absolute inset-0 rounded-3xl border-4 border-teal-100 opacity-50 animate-pulse" />
        </div>

        <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
          Retake Fingerprint?
        </h3>
        <p className="text-xl text-slate-600 mb-6 leading-relaxed max-w-sm mx-auto">
          You're about to retake <span className="font-bold text-[#00c2cb]">{fingerName}</span>.
        </p>

        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl px-5 py-4 mb-8 w-full">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-lg text-blue-900 text-left leading-relaxed">
              The current scan will be replaced. Make sure you're ready to rescan this finger.
            </p>
          </div>
        </div>

        <div className="flex flex-row gap-4 w-full">
          <Button
            type="button"
            onClick={onCancel}
            className="flex-1 h-16 text-xl font-bold rounded-2xl bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-16 text-xl font-bold rounded-2xl bg-[#00c2cb] hover:bg-[#00adb5] text-white shadow-lg shadow-teal-100/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Yes, Retake
          </Button>
        </div>
      </div>
    </ModalShell>
  );
}
