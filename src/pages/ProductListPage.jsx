import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { URL } from "../utils/api";
import { BannerList } from "../componets/BannerList"; // need to render the banner list like that 

const ProductListPage = () => {
  const { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageTitle = location.state?.title || type || "Products";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let fetchedProducts = [];

        if (type === "category") {
          const res = await fetch(`${URL}/products/with-primary-image?category_id=${id}`);
          fetchedProducts = await res.json();
        }

        else if (type === "List") {
          const res = await fetch(`${URL}/banners/with-products/${id}`); 
          const data = await res.json();
          console.log(data[0]);
          
          fetchedProducts = data[0].map[0].products || [];
        }

        else if (type === "timer") {
          const res = await fetch(`${URL}/banners/with-products/${id}`);
          const bannerRes = await res.json();

          const banner = Array.isArray(bannerRes) ? bannerRes[0] : bannerRes;

          // Correct extraction for timer products
          if (banner?.map && Array.isArray(banner.map) && banner.map[0]?.products) {
            fetchedProducts = banner.map[0].products;
          } else {
            fetchedProducts = [];
          }
        }

        else {
          const res = await fetch(`${URL}/products/with-primary-image`);
          fetchedProducts = await res.json();
        }

        console.log("✅ Parsed products:", fetchedProducts);
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
      } catch (err) {
        console.error("❌ Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  return (
    <div className="relative min-h-screen flex flex-col max-w-sm mx-auto bg-[#F9F9F9]">
      {/* Header */}
      <div className="flex items-center relative p-4">
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
          {pageTitle}
        </h1>
      </div>

      {/* Loading or Product list */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-600">
          Loading products...
        </div>
      ) : (
        <div className="w-[95%] mx-auto mt-6">
          {products.length > 0 ? (
            <BannerList
              title={pageTitle}
              layout="grid"
              data={products}
              showHeader={false}
            />
          ) : (
            <div className="text-center text-gray-500 text-sm py-10">
              No products found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
