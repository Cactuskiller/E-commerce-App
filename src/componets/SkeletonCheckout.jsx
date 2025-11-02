import React from "react";

export default function SkeletonCheckout() {
  return (
    <div className="relative flex flex-col mx-auto bg-white pb-28 animate-pulse" style={{ maxWidth: "390px", width: "100%" }}>
      {/* Header skeleton */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 pb-3">
        <div className="w-[95%] mx-auto h-12 flex items-center justify-center relative">
          <div className="absolute left-0 w-8 h-8 bg-gray-200 rounded-full" />
          <div className="h-5 w-32 bg-gray-200 rounded mx-auto" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="w-[95%] mx-auto mt-4 space-y-4">
        {/* Delivery Address skeleton */}
        <div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          <div className="mt-3 rounded-2xl border border-gray-200 p-3 bg-white">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-40 bg-gray-200 rounded" />
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Items List skeleton */}
        <div className="space-y-3">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="relative rounded-lg p-2 shadow-sm bg-white"
              style={{ boxShadow: "0 2px 8px rgba(248, 55, 88, 0.12)" }}
            >
              <div className="flex gap-3">
                <div className="w-20 h-20 bg-gray-200 rounded-xl" />
                <div className="flex-1 flex flex-col justify-center gap-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-40 bg-gray-200 rounded" />
                  <div className="flex gap-2 mt-2">
                    <div className="h-5 w-16 bg-gray-200 rounded" />
                    <div className="h-5 w-16 bg-gray-200 rounded" />
                    <div className="h-5 w-12 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
              <div className="absolute top-2 right-2 w-8 h-8 bg-gray-200 rounded-full" />
            </div>
          ))}
        </div>

        <div className="h-6 bg-gray-200 rounded w-full my-4" />

        {/* Payment Details skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        </div>

        <div className="h-6 bg-gray-200 rounded w-full my-4" />

        {/* Order Total skeleton */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
          <div className="flex items-center gap-7">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      {/* Bottom bar skeleton */}
      <div className="fixed inset-x-0 bottom-0 z-50" style={{ maxWidth: "390px", margin: "0 auto" }}>
        <div className="mx-auto px-3 pb-4 pt-3 bg-[#F8F8F8] backdrop-blur rounded-t-3xl">
          <div className="w-full flex items-center gap-3">
            <div className="flex-1 px-2 py-2">
              <div className="h-5 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-16 bg-gray-200 rounded" />
            </div>
            <div className="flex-2">
              <div className="h-10 w-40 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}