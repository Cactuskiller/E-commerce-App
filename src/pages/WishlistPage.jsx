import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../utils/api";
import { BannerList } from "../componets/BannerList";

const WishlistPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    Promise.all(
      wishlist.map(async (pid) => {
        const res = await fetch(`${URL}/products/${pid}/with-primary-image`);
        return res.ok ? await res.json() : null;
      })
    ).then((prods) => {
      setProducts(prods.filter(Boolean));
      setLoading(false);
    });
  }, []);

  // const handleRemoveItem = (pid) => {
  //   const newWishlist = products.filter((item) => item.id !== pid);
  //   setProducts(newWishlist);
  //   localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  // };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("wishlist");
  };

  return (
    <div className="relative h-[100dvh] flex flex-col max-w-sm mx-auto bg-[#F9F9F9]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center relative p-4 bg-[#F9F9F9]">
        <button
          onClick={() => navigate("/home")}
          className="absolute left-4 p-2"
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
        <h1 className="text-lg font-bold text-center w-full text-[#2D2343]">
          Wishlist
        </h1>
      </div>

      {/* Loading or Wishlist list */}
      {loading ? (
        <div className="w-[95%] mx-auto mt-6 grid grid-cols-2 gap-3">
          {[...Array(8)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm animate-pulse"
              style={{ height: "260px", display: "flex", flexDirection: "column" }}
            >
              <div className="w-full h-[150px] bg-gray-200 rounded-t-xl" />
              <div className="px-3 pt-2 flex-1 flex flex-col justify-center">
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-200 rounded mb-1 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-[95%] mx-auto mt-6">
          {products.length > 0 ? (
            <BannerList
              title="Wishlist"
              layout="grid"
              data={products}
              showHeader={false}
            />
          ) : (
            <div className="text-center text-gray-500 text-sm py-10">
              No products in your wishlist.
            </div>
          )}
        </div>
      )}
    
    </div>
  );
};

export default WishlistPage;