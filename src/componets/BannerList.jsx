import React from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

export const BannerList = ({
  title,
  layout,
  showHeader = true,
  centerTitle = false,
  showArrow = true,
  data = [],
  bannerId,
  bannerType,
}) => {
  const navigate = useNavigate();

  const products = Array.isArray(data) ? data : [];

  const productIds = products.map((p) => p.id);

  const headerContent = showHeader && (
    <div className="flex items-center justify-between mb-3 relative">
      <h2
        className={`text-lg font-bold text-[#2D2343] ${
          centerTitle ? "text-center w-full" : ""
        }`}
      >
        {title}
      </h2>
      {showArrow && !centerTitle && products.length > 0 && (
        <button
          onClick={() => navigate(`/products/${bannerType}/${bannerId}`)}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition absolute right-0"
          aria-label="See all products"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path
              d="M9 6l6 6-6 6"
              stroke="#222"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </div>
  );

  if (layout === "horizontal") {
    return (
      <>
        {headerContent}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {products.map((p, idx) => (
            <div
              key={p?.id ?? idx}
              className="shrink-0 w-[180px] cursor-pointer"
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <ProductCard
                data={{
                  ...p,
                  image:
                    Array.isArray(p.images) && p.images.length > 0
                      ? p.images[0].link
                      : "",
                  rating: p?.avg_rating,
                  ratingCount: p?.rating_count,
                  discount:
                    typeof p.price === "number" &&
                    typeof p.endprice === "number" &&
                    p.endprice < p.price
                      ? `${Math.round(
                          ((p.price - p.endprice) / p.price) * 100
                        )}%`
                      : "",
                }}
              />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {headerContent}
      <div className="grid grid-cols-2 gap-3">
        {products.map((p, idx) => (
          <div
            key={p.id ?? idx}
            className="cursor-pointer"
            onClick={() => navigate(`/product/${p.id}`)}
          >
            <ProductCard
              data={{
                ...p,
                image:
                  Array.isArray(p.images) && p.images.length > 0
                    ? p.images[0].link
                    : "",
                rating: p?.avg_rating,
                ratingCount: p?.rating_count,
                discount:
                  typeof p.price === "number" &&
                  typeof p.endprice === "number" &&
                  p.endprice < p.price
                    ? `${Math.round(((p.price - p.endprice) / p.price) * 100)}%`
                    : "",
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};
