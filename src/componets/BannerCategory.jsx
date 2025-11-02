import React from "react";
import { useNavigate } from "react-router-dom";

const BannerCategory = ({ type, data, onCategorySelect }) => {
  const navigate = useNavigate();
  const categories = Array.isArray(data?.map) ? data.map : [];
  const validCategories = categories.filter(cat => cat && cat.id);

  console.log("Categories from backend:", validCategories);

  if (validCategories.length === 0) {
    return null;
  }

  const sortedCategoryItems = [...validCategories].sort(
    (a, b) => (a.priority || 0) - (b.priority || 0)
  );

  // Default fallback image (inline SVG to avoid network issues)
  const defaultImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23374151' font-size='10' font-family='Arial, sans-serif'%3ECategory%3C/text%3E%3C/svg%3E";

  return (
    <div className="flex justify-between items-center w-full mx-auto mt-6 mb-2 gap-2 overflow-x-auto no-scrollbar ">
      {sortedCategoryItems.map((cat, index) => {
        // Handle category name
        const name = cat.name || `Category ${index + 1}`;

        // Handle image URL - prioritize Uploadcare URLs
        let image = defaultImage;

        if (cat.image && cat.image.includes("ucarecdn.net")) {
          image = cat.image;
        } else if (cat.image && cat.image.startsWith("http")) {
          image = cat.image;
        }

        return (
          <div
            key={cat.id || name || index}
            className="flex flex-col items-center flex-shrink-0"
          >
            <button
              onClick={() => {
                const categoryId = cat.id;
                // Instead of just calling onCategorySelect, navigate to product list page
                navigate(`/products/category/${categoryId}`, {
                  state: { title: cat.name }
                });
              }}
              className="flex flex-col items-center flex-shrink-0 focus:outline-none"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Image failed to load:", image);
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                />
              </div>
              <span className="mt-2 text-[15px] text-[#2D2343] font-medium text-center">
                {name}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default BannerCategory;