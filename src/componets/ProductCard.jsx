import React from "react";

// Reusable product card used across Home and Banner list (simple)
const ProductCard = ({
  data = {},
  useOriginalImageHeight = false,
  hideOldPrice = false,
}) => {
  const imageUrl = data.primary_image|| data.image || "";
  const resolvedTitle = data.title || "";
  const truncatedTitle = data.name;
  const resolvedDesc = data.description || "";
  const truncatedDesc = resolvedDesc
    ? resolvedDesc.length > 60
      ? resolvedDesc.slice(0, 60).trimEnd() + "…"
      : resolvedDesc
    : "";
  const resolvedPrice = data.endprice ?? data.price;
	const resolvedOldPrice = data.price; 

  return (
    <div className="relative bg-white rounded-2xl shadow-sm data-0 w-full max-w-xs flex flex-col border border-gray-100 hover:shadow-md transition-all">
      <div
        className={`w-full overflow-hidden rounded-t-2xl bg-gray-50 ${
          useOriginalImageHeight ? "" : "aspect-[3/4]"
        }`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={resolvedTitle}
            className={`${
              useOriginalImageHeight
                ? "w-full h-auto object-contain"
                : "object-cover w-full h-full"
            } block`}
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="px-4 pt-3 pb-4 flex flex-col flex-1">
        <h3 className="text-[15px] font-normal text-[#1f2937] leading-tight mb-1 truncate">
          {truncatedTitle}
        </h3>
        {truncatedDesc ? (
          <data className="text-[12px] text-gray-600 leading-snug">
            {truncatedDesc}
          </data>
        ) : null}

             <div className="mb-1">
          <span className="text-[15px] font-medium text-[#000000]">
            ${resolvedPrice}
          </span>
          {resolvedOldPrice && (
            <span className="text-[15px] text-gray-400 line-through ml-2">
              ${resolvedOldPrice}
            </span>
          )}
        </div>

        {!hideOldPrice && (data.oldPrice || data.discount) && (
          <div className="flex items-center gap-3">
            {data.oldPrice && (
              <span className="text-[16px] text-gray-400 line-through">
                ${data.oldPrice}
              </span>
            )}
            {data.discount && (
              <span className="text-[12px] text-[#FE735C]">
                {data.discount} Off
              </span>
            )}
          </div>
        )}

        {typeof data.rating === "number" && (
          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(data?.rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill={i < Math.round(data?.rating) ? "#facc15" : "#d1d5db"}
                viewBox="0 0 20 20"
              >
                <polygon points="10,1 12.59,7.36 19.51,7.64 14,12.14 15.82,18.99 10,15.27 4.18,18.99 6,12.14 0.49,7.64 7.41,7.36" />
              </svg>
            ))}
            {typeof data.ratingCount === "number" && (
              <span className="text-gray-400 text-[15px] ml-2">
                {data.ratingCount.toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
