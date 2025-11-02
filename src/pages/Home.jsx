import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../componets/NavBar";
import BannerSingle from "../componets/BannerSingle";
import BannerSlider from "../componets/BannerSlider";
import { BannerList } from "../componets/BannerList";
import BannerTimer from "../componets/BannerTimer";
import BannerCategory from "../componets/BannerCategory";
import Header from "../componets/Header";
import SearchBar from "../componets/SearchBar";
import logoImg from "../assets/logo.png";
import profileHeaderImg from "../assets/profile-image.jpg";
import { URL } from "../utils/api";

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [listBannerProducts, setListBannerProducts] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const getBanners = async () => {
    try {
      setLoading(true);
      const resp = await fetch(`${URL}/banners/with-products`);
      if (resp.ok) {
        const data = await resp.json();
        setBanners(data);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBanners();
  }, []);

  useEffect(() => {
    if (!banners.length) return;

    const fetchListBannerProducts = async () => {
      const newListBannerProducts = {};

      for (const banner of banners) {
        if (
          banner.type?.toLowerCase() === "list" &&
          Array.isArray(banner.map) &&
          banner.map[0]?.productIds
        ) {
          const ids = banner.map[0].productIds;
          // Fetch all products for these IDs
          const productPromises = ids.map(async (pid) => {
            try {
              const res = await fetch(
                `${URL}/products/${pid}/with-primary-image`
              );
              if (!res.ok) return null;
              const data = await res.json();
              if (data && !data.message) return data;
              return null;
            } catch {
              return null;
            }
          });
          const products = (await Promise.all(productPromises)).filter(Boolean);
          newListBannerProducts[banner.id] = products;
        }
      }

      setListBannerProducts(newListBannerProducts);
    };

    fetchListBannerProducts();
  }, [banners]);

  const handleCategorySelect = async (categoryId) => {
    setSelectedCategory(categoryId);
    try {
      const resp = await fetch(`${URL}/products?category_id=${categoryId}`);
      if (resp.ok) {
        const data = await resp.json();
        setProducts(data);
      } else {
        console.error("Error fetching products");
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  function renderBanner(banner, extra) {
    switch (banner.type?.toLowerCase()) {
      case "single":
        return <BannerSingle data={banner} {...extra} />;
      case "slider":
        return <BannerSlider data={banner?.map} {...extra} />;
      case "list":
        // Extract products from map[0].products
        const products =
          Array.isArray(banner.map) && banner.map[0]?.products
            ? banner.map[0].products
            : [];
        return (
          <BannerList
            title={banner?.name}
            layout="horizontal"
            data={products}
            bannerId={banner.id}
            bannerType={banner.type}
          />
        );
      case "timer":
        return <BannerTimer data={banner} {...extra} />;
      case "category":
        return (
          <BannerCategory
            data={banner}
            onCategorySelect={handleCategorySelect}
          />
        );
      default:
        return null;
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    localStorage.removeItem("products");
    setProducts([]);
    setShowLogoutModal(false);
    navigate("/auth");
  };

  return (
    <div className="relative min-h-screen flex flex-col max-w-sm mx-auto bg-[#F9F9F9] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        {/* Burger menu button */}
        <button
          className="rounded-full bg-gray-100 w-10 h-10 flex items-center justify-center mr-2"
          aria-label="Menu"
          // Add your menu toggle logic here if needed
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#222"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="5" y1="7" x2="19" y2="7" />
            <line x1="5" y1="12" x2="19" y2="12" />
            <line x1="5" y1="17" x2="19" y2="17" />
          </svg>
        </button>
        {/* Logo and title */}
        <div className="flex-1 flex items-center justify-center">
          <img src={logoImg} alt="Logo" className="h-8 mr-2" />
          
        </div>
        {/* Profile button */}
        <button
          className="rounded-full overflow-hidden w-10 h-10 ml-2"
          aria-label="Profile"
        >
          <img
            src={profileHeaderImg}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>

      <SearchBar />

      {/* Render banners from backend */}
      {Array.isArray(banners) &&
        banners
          .filter((banner) => Boolean(banner.active) && !Boolean(banner.hidden))
          .map((banner, idx) => (
            <div key={idx} className="w-[95%] mx-auto mt-3">
              {renderBanner(banner)}
            </div>
          ))}

      {/* Display filtered products when a category is selected */}
      {selectedCategory && products.length > 0 && (
        <div className="w-[95%] mx-auto mt-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#2D2343]">
              Category Products
            </h2>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setProducts([]);
              }}
              className="text-sm text-gray-500 underline"
            >
              Clear Filter
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <img
                    src={
                      product.primary_image ||
                      product.image ||
                      "https://via.placeholder.com/150"
                    }
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <h3 className="font-semibold text-sm truncate">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-xs truncate">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-[#F83758]">
                      ${product.endprice || product.price}
                    </span>
                    {product.price !== product.endprice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <NavBar />

      {/* Logout Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-gray-400 bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setShowLogoutModal(false)}
        >
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-xs w-full text-center">
            <h2 className="text-lg font-semibold mb-2">Confirm Logout</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-200 text-gray-800 rounded px-4 py-2"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#F83758] text-white rounded px-4 py-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
