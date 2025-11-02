import React from "react";

export default function SkeletonHome() {
  return (
    <>
      {/* Search bar skeleton */}
      <div className="w-[95%] mx-auto mt-4">
        <div className="bg-gray-200 rounded-xl h-12 animate-pulse mb-4" />
      </div>
      {/* Category slider skeleton: only circles */}
      <div className="w-[95%] mx-auto flex gap-x-5 mb-4">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="flex items-center justify-center">
            <div className="w-14 h-14 bg-gray-200 rounded-full animate-pulse" />
          </div>
        ))}
      </div>
      {/* Banner skeletons */}
      <div className="w-[95%] mx-auto">
        <div className="bg-gray-200 rounded-xl h-40 animate-pulse mb-4" />
      </div>
      <div className="w-[95%] mx-auto">
        <div className="bg-gray-200 rounded-xl h-16 animate-pulse mb-4" />
      </div>
      {/* Product grid skeleton */}
      <div className="w-[95%] mx-auto">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-3 animate-pulse" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-3 shadow-sm animate-pulse"
              style={{ height: "260px", display: "flex", flexDirection: "column" }}
            >
              <div className="w-full h-[150px] bg-gray-200 rounded-md mb-2" />
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
              <div className="h-3 bg-gray-200 rounded mb-1 w-2/3" />
              <div className="flex justify-between items-center mt-auto">
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-3 bg-gray-200 rounded w-10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}