import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        <p className="text-lg font-medium text-blue-900 animate-pulse">Loading Sipsawiya...</p>
      </div>
    </div>
  );
}
