import React from "react";

export default function SkeletonProductCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm w-full max-w-sm mx-auto animate-pulse p-0 pb-8">
      {/* Navigation and shopping cart skeletons */}
      <div className="flex items-center justify-between px-4 pt-20 mb-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full" /> {/* Back arrow */}
        <div className="w-10 h-10 bg-gray-200 rounded-full" /> {/* Cart icon */}
      </div>
      {/* Space before image */}
      <div className="h-2" />
      {/* Product image skeleton */}
      <div className="w-full h-[280px] bg-gray-200 rounded-2xl mb-6" />
      {/* Title and heart icon */}
      <div className="flex items-center justify-between px-4 mb-5">
        <div className="h-6 w-40 bg-gray-200 rounded" />
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
      </div>
      {/* Color pills */}
      <div className="flex flex-wrap gap-3 px-4 mb-5">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="h-7 w-20 bg-gray-200 rounded-full" />
        ))}
        <div className="h-7 w-28 bg-gray-200 rounded-full" />
      </div>
      {/* Price and discount */}
      <div className="flex items-center gap-4 px-4 mb-4">
        <div className="h-5 w-12 bg-gray-200 rounded" />
        <div className="h-5 w-12 bg-gray-200 rounded" />
        <div className="h-5 w-16 bg-gray-200 rounded" />
      </div>
      {/* Rating stars and reviews */}
      <div className="flex items-center gap-3 px-4 mb-4">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="h-5 w-5 bg-gray-200 rounded" />
        ))}
        <div className="h-4 w-20 bg-gray-200 rounded ml-2" />
      </div>
      {/* Product details */}
      <div className="px-4 mb-4">
        <div className="h-4 w-full bg-gray-200 rounded mb-3" />
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-1/3 bg-gray-200 rounded mb-3" />
      </div>
      {/* Quantity stepper and checkout button */}
      <div className="flex items-center gap-4 px-4 mt-6 mb-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white mb-3">
            <div className="w-10 h-10 bg-gray-200" />
            <div className="w-10 h-10 bg-gray-200" />
            <div className="w-10 h-10 bg-gray-200" />
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg" />
      </div>
      {/* Similar products title skeleton */}
      <div className="px-4 mb-4">
        <div className="h-5 w-32 bg-gray-200 rounded" />
      </div>
      {/* Similar products skeleton cards */}
      <div className="px-4 mb-4 flex gap-4">
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="w-24 h-32 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  );
}