"use client";
import { useEffect, useMemo } from "react";

type ScanPreviewProps = {
  file?: File | null;
  alt: string;
  className?: string;
};

export function ScanPreview({ file, alt, className }: ScanPreviewProps) {
  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(
    () => () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    },
    [objectUrl]
  );

  if (!objectUrl) return null;

  return (
    <img
      src={objectUrl}
      alt={alt}
      className={`absolute inset-0 h-full w-full ${className ?? "object-cover"}`}
      draggable={false}
    />
  );
}
