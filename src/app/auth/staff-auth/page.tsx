import { Suspense } from "react";
import StaffAuth from "@/components/Auth/StaffAuth";

export const dynamic = "force-dynamic";

function StaffAuthLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-background px-4">
      <p>Loading authentication form...</p>
    </div>
  );
}

export default function StaffAuthPage() {
  return (
    <Suspense fallback={<StaffAuthLoadingFallback />}>
      <StaffAuth />
    </Suspense>
  );
}
