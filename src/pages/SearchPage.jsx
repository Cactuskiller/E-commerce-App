import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../utils/api";
import { BannerList } from "../componets/BannerList";

// Skeleton card for loading effect
const SkeletonCard = () => (
  <div className="bg-white rounded-lg p-3 shadow-sm animate-pulse">
    <div className="w-full h-32 bg-gray-200 rounded-md mb-2" />
    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
    <div className="h-3 bg-gray-200 rounded mb-1 w-2/3" />
    <div className="flex justify-between items-center mt-2">
      <div className="h-4 bg-gray-200 rounded w-16" />
      <div className="h-3 bg-gray-200 rounded w-10" />
    </div>
  </div>
);

const SearchPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const res = await fetch(`${URL}/products/with-primary-image`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Filter products by search
  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative flex flex-col max-w-sm mx-auto bg-[#F9F9F9]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#F9F9F9] flex flex-col p-4">
        <div className="flex items-center mb-5 relative">
          <button
            onClick={() => navigate("/home")}
            className="absolute left-0 p-2"
            aria-label="Go back to home"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M15 18l-6-6 6-6"
                stroke="#222"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-[#2D2343] w-full text-center">
            Search Products
          </h1>
        </div>
        <div className="w-full flex items-center bg-white rounded-xl border border-gray-200 px-4 py-2  transition-all focus-within:border-[#FE6B8B] focus-within:ring-2 focus-within:ring-[#FE6B8B] mb-3 mt-2">
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="#A0A0A0"
            strokeWidth="2"
            className="mr-2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search any Product.."
            className="flex-1 bg-transparent outline-none text-gray-700 text-base caret-[#FE6B8B] transition-all"
          />
        </div>
      </div>

      {/* Product list or skeletons */}
      <div className="w-[95%] mx-auto mt-2">
        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[...Array(8)].map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <BannerList
            title="Products"
            layout="grid"
            data={filteredProducts}
            showHeader={false}
          />
        ) : (
          <div className="text-center text-gray-500 text-sm py-10">
            No products found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;