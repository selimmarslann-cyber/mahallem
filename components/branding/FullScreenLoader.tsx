"use client";

import { HizmetgoLogoLoader } from "./HizmetgoLogoLoader";

export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-max flex items-center justify-center bg-[#F5F5F7]">
      <div className="text-center">
        <HizmetgoLogoLoader size={120} />
        <p className="mt-6 text-slate-600 font-medium">Yükleniyor...</p>
      </div>
    </div>
  );
}
