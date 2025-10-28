import React from "react";

// Default fallback image (inline SVG)
const defaultImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'%3E%3Crect width='180' height='180' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23374151' font-size='18' font-family='Arial, sans-serif'%3EBanner%3C/text%3E%3C/svg%3E";

const BannerSingle = ({ type, data, onItemClick }) => {
  const item = Array.isArray(data) ? data[0] : data;
  const mapObj = Array.isArray(item?.map) ? item.map[0] : item?.map || {};

  // Image selection
  let imgSrc =
    mapObj?.image && mapObj.image.startsWith("http") ? mapObj.image
    : item?.image && item.image.startsWith("http") ? item.image
    : item?.primary_image && item.primary_image.startsWith("http") ? item.primary_image
    : item?.background && item.background.startsWith("http") ? item.background
    : defaultImage;

  // Title and subtitle
  const title = mapObj?.title || mapObj?.name || item?.title || item?.name || "Untitled";
  const subtitle = mapObj?.subtitle || mapObj?.description || item?.subtitle || item?.description || "";

  // Link for navigation
  const link = mapObj?.link;

  const handleViewAll = () => {
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <div
      className="rounded-[8px] bg-white shadow overflow-hidden cursor-pointer"
      onClick={() => onItemClick?.(item)}
    >
      {/* Banner image */}
      <img
        src={imgSrc}
        alt={title}
        className="w-full h-[180px] object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultImage;
        }}
      />

      {/* Text and button */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex-1 pr-3">
          <div className="text-xl font-medium text-[#1F2937]">
            {title}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {subtitle}
          </div>
        </div>
        <button
          className="bg-[#F83758] text-white px-2 py-1 rounded-[4px] font-medium text-sm flex items-center gap-2 whitespace-nowrap shrink-0"
          onClick={handleViewAll}
          type="button"
        >
          View all <span className="text-base">&rarr;</span>
        </button>
      </div>
    </div>
  );
};

export default BannerSingle;
