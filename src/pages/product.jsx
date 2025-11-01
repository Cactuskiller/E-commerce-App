import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { URL } from "../utils/api";
import { BannerList } from "../componets/BannerList";
import Button from "../componets/button";

const Dot = ({ active }) => (
  <span
    className={`inline-block rounded-full ${
      active ? "bg-[#F83758]" : "bg-gray-300"
    }`}
    style={{ width: 8, height: 8 }}
  />
);

const SizePill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`text-[13px] px-3 py-2 rounded-md border-2 transition ${
      active
        ? "bg-[#FE6B8B] text-white border-[#FE6B8B]"
        : "bg-white text-[#FE6B8B] border-[#FE6B8B]"
    }`}
  >
    {label}
  </button>
);

const QtyStepper = ({ qty, updateCartQty, stock }) => {
  const isOutOfStock = stock <= 0;
  const canIncrement = !isOutOfStock && qty < stock;

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
        <button
          onClick={() => !isOutOfStock && updateCartQty(Math.max(qty - 1, 0))}
          disabled={isOutOfStock || qty <= 0}
          className={`w-10 h-10 grid place-items-center text-2xl ${
            isOutOfStock ? "text-gray-400" : "text-gray-700"
          }`}
          style={{ border: "none", background: "none" }}
        >
          –
        </button>

        <div className="w-10 h-10 grid place-items-center text-gray-900 text-base font-medium bg-white">
          {isOutOfStock ? "0" : qty}
        </div>

        <button
          onClick={() => canIncrement && updateCartQty(qty + 1)}
          disabled={!canIncrement}
          className={`w-10 h-10 grid place-items-center text-2xl ${
            canIncrement ? "text-gray-700" : "text-gray-400"
          }`}
          style={{ border: "none", background: "none" }}
        >
          +
        </button>
      </div>

      {isOutOfStock && (
        <p className="text-red-500 text-sm mt-1">Out of stock</p>
      )}
      {!isOutOfStock && qty >= stock && (
        <p className="text-orange-500 text-sm mt-1">Max available: {stock}</p>
      )}
    </div>
  );
};

export default function ProductPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [activeSize, setActiveSize] = useState("");
  const [activeColor, setActiveColor] = useState("");
  const [qty, setQty] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [userRating, setUserRating] = useState(0); // Rating fetched from backend
  const [selectedRating, setSelectedRating] = useState(0); // Rating selected by user
  const [submittingRating, setSubmittingRating] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isWishlisted, setIsWishlisted] = useState(false); // New state for wishlist

  // Load qty from localStorage on mount
  useEffect(() => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find(
      (item) =>
        item.id === Number(id) &&
        (item.size || "default") === (activeSize || "default") &&
        (item.color || "default") === (activeColor || "default")
    );
    if (existing?.qty) setQty(existing.qty);
    else setQty(0);
  }, [id, activeSize, activeColor]);

  const updateCartQty = (newQty) => {
    if (product?.stock <= 0) {
      alert("❌ This product is out of stock.");
      return;
    }
    if (newQty > product.stock) {
      alert(`⚠️ Only ${product.stock} left in stock.`);
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    setQty(newQty);
    const existingItemIndex = cart.findIndex((item) => item.id === Number(id));

    if (existingItemIndex >= 0) {
      if (newQty === 0) cart.splice(existingItemIndex, 1);
      else cart[existingItemIndex].qty = newQty;
    } else if (newQty > 0 && product) {
      cart.push({
        id: product.id,
        title: product.title,
        subtitle: product.subtitle,
        image: product.images[0],
        size: activeSize || "default",
        color: activeColor || "default",
        qty: newQty,
        price: product.price,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  // Fetch product info
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${URL}/products/${id}/with-primary-image`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        // Parse options (sizes, colors)
        let sizes = [],
          colors = [];
        let optionsArr = [];
        try {
          optionsArr = Array.isArray(data.options)
            ? data.options
            : JSON.parse(data.options || "[]");
        } catch {}
        optionsArr.forEach((opt) => {
          if (opt.name.toLowerCase().includes("size"))
            sizes.push(...opt.values);
          if (opt.name.toLowerCase().includes("color"))
            colors.push(...opt.values);
        });
        sizes = [...new Set(sizes)];
        colors = [...new Set(colors)];

        const images = Array.isArray(data.images)
          ? data.images.map((img) => img.link)
          : [];
        if (data.primary_image && !images.includes(data.primary_image))
          images.unshift(data.primary_image);

        setProduct({
          id: data.id,
          title: data.name,
          subtitle: data.description,
          rating: data.avg_rating || 0,
          ratingCount: data.rating_count || 0,
          price: data.endprice || data.price,
          oldPrice: data.price,
          stock: data.stock || 0,
          discount:
            data.price && data.endprice
              ? `${Math.round(
                  ((data.price - data.endprice) / data.price) * 100
                )}%`
              : "0%",
          sizes,
          colors,
          options: optionsArr,
          images,
          details: data.description || "—",
          category_id: data.category_id,
          related: data.related,
        });

        if (sizes.length) setActiveSize(sizes[0]);
        if (colors.length) setActiveColor(colors[0]);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // Add this useEffect after product is set
  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.related) return;

      try {
        let relatedIds = [];
        if (Array.isArray(product.related)) {
          relatedIds = product.related;
        } else if (typeof product.related === "string") {
          relatedIds = JSON.parse(product.related);
        }

        if (!relatedIds.length) return;

        const res = await fetch(`${URL}/products/${id}/related`);
        if (!res.ok) throw new Error("Failed to fetch related products");
        const data = await res.json();

        setSimilarProducts(data.filter((p) => p.id !== product.id));
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    fetchRelated();
  }, [product?.related, product?.id, id]);

  // Fetch user’s existing rating
  useEffect(() => {
    const fetchUserRating = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id || !id) return;
      try {
        // use plural "ratings" to match backend router mount
        const res = await fetch(`${URL}/ratings/user/${user.id}/product/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.rating?.value) {
            setUserRating(Number(data.rating.value));
            setSelectedRating(Number(data.rating.value)); // Ensure both are numbers
          } else {
            setUserRating(0);
            setSelectedRating(0);
          }
        }
      } catch (err) {
        console.error("Error fetching user rating:", err);
      }
    };
    fetchUserRating();
  }, [id]);

  // Handle star click (select rating, don't send yet)
  const handleStarClick = (value) => {
    setSelectedRating(value);
  };

  // Send rating to backend
  const sendRating = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id || !selectedRating) return;

    setSubmittingRating(true);
    try {
      const res = await fetch(`${URL}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
          value: selectedRating,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setUserRating(Number(selectedRating));
        setSelectedRating(Number(selectedRating)); // Ensure both are numbers
        setProduct((prev) => ({
          ...prev,
          // rating: data.avg_rating,
          // ratingCount: data.rating_count,
        }));
      }
    } catch (err) {
      console.error("Rating error:", err);
    } finally {
      setSubmittingRating(false);
    }
  };

  // Handle add to wishlist
  const handleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (isWishlisted) {
      // Remove from wishlist
      const updated = wishlist.filter(pid => pid !== product.id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setIsWishlisted(false);
    } else {
      // Add to wishlist
      wishlist.push(product.id);
      localStorage.setItem("wishlist", JSON.stringify([...new Set(wishlist)]));
      setIsWishlisted(true);
    }
  };

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(wishlist.includes(product?.id));
  }, [product?.id]);

  if (!product)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading product...</p>
      </div>
    );

  const handleCheckout = () => {
    if (qty === 0) return;
    navigate("/checkout");
  };

  return (
    <div className="relative min-h-screen flex flex-col max-w-sm mx-auto bg-white pb-24 pt-5">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur">
        <div className="w-[95%] mx-auto h-12 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 grid place-items-center rounded-full"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 6l-6 6 6 6"
                stroke="#222"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div />
          <button
            className="w-9 h-9 grid place-items-center rounded-full bg-white shadow-sm ring-1 ring-gray-200"
            onClick={() => navigate("/checkout")}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#222"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61l1.38-7.39H6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="w-[95%] mx-auto mt-4">
        {/* Product images */}
        <div
          className="w-full rounded-2xl overflow-x-auto bg-gray-100 aspect-[4/5] flex gap-3 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {product.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={product.title}
              className="w-full h-full object-cover rounded-2xl"
              style={{ minWidth: "100%", scrollSnapAlign: "center" }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mt-5">
          <h1 className="text-xl font-bold text-[#2D2343]">{product.title}</h1>
          <button
            onClick={handleWishlist}
            className="ml-2 transition-transform hover:scale-110"
            aria-label="Add to wishlist"
            style={{
              boxShadow: "0 2px 8px rgba(248,55,88,0.15)",
              borderRadius: "50%",
              background: "#fff",
              padding: "6px",
              border: "none",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {isWishlisted ? (
              // Filled heart
              <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="#F83758">
                <path d="M12.1 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54l-1.35 1.31z"/>
              </svg>
            ) : (
              // Outline heart
              <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#F83758" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.1 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54l-1.35 1.31z"/>
              </svg>
            )}
          </button>
        </div>

        <div className="mt-5">
          {/* Product Options (Colors & Sizes) under the title
          {(product.colors.length > 0 || product.sizes.length > 0) && (
            <div className="mt-2 mb-2">
              {product.colors.length > 0 && (
                <div className="mb-1">
                  <span className="font-semibold text-sm text-[#2D2343] mr-2">
                    Colors:
                  </span>
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setActiveColor(color)}
                      className={`px-3 py-1 rounded-full border-2 mr-2 mb-1 text-sm transition ${
                        activeColor === color
                          ? "bg-[#FE6B8B] text-white border-[#FE6B8B]"
                          : "bg-white text-[#FE6B8B] border-[#FE6B8B]"
                      }`}
                    >
                      {color.trim()}
                    </button>
                  ))}
                </div>
              )}
              {product.sizes.length > 0 && (
                <div>
                  <span className="font-semibold text-sm text-[#2D2343] mr-2">
                    Sizes:
                  </span>
                  {product.sizes.map((size) => (
                    <SizePill
                      key={size}
                      label={size}
                      active={activeSize === size}
                      onClick={() => setActiveSize(size)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) */}

          {/* Product Options (Additional) - new section */}
          {product.options && product.options.length > 0 && (
            <div className="mt-3 mb-3">
              {product.options.map((opt) => (
                <div key={opt.name} className="mb-1">
                  <span className="font-semibold text-sm text-[#2D2343] mr-2">
                    {opt.name}:
                  </span>
                  {opt.values.map((val) => (
                    <button
                      key={val}
                      onClick={() =>
                        setSelectedOptions((prev) => ({
                          ...prev,
                          [opt.name]: val,
                        }))
                      }
                      className={`px-3 py-1 rounded-full border-2 mr-2 mb-1 text-sm transition ${
                        selectedOptions[opt.name] === val
                          ? "bg-[#FE6B8B] text-white border-[#FE6B8B]"
                          : "bg-white text-[#FE6B8B] border-[#FE6B8B]"
                      }`}
                    >
                      {val.trim()}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Price Section */}
          <div className="flex items-center gap-3 mt-1">
            {/* Only show old price if there is a discount */}
            {product.discount !== "0%" && (
              <span className="text-lg text-gray-400 line-through">
                ${product.oldPrice}
              </span>
            )}
            <span className="text-xl font-semibold text-gray-600">
              ${product.price}
            </span>
            {/* Only show discount if there is a discount */}
            {product.discount !== "0%" && (
              <span className="text-lg font-semibold text-[#FE735C]">
                {product.discount} Off
              </span>
            )}
          </div>

          {/* ⭐ Rating Section - moved here under price */}
          <div className="flex items-center gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={star <= selectedRating ? "#FFC107" : "#E0E0E0"}
                strokeWidth="1"
                className="inline cursor-pointer hover:scale-110 transition-transform"
                onClick={() => handleStarClick(star)}
              >
                <polygon points="12,2 15,9 22,9.3 17,14 18.5,21 12,17.5 5.5,21 7,14 2,9.3 9,9" />
              </svg>
            ))}
            <span className="ml-2 text-gray-600 text-sm">
              ({product.ratingCount} reviews)
            </span>
          </div>
          {/* Show Save button only if a rating is selected and it's different from the last saved */}
          {selectedRating !== userRating && !submittingRating && (
            <div className="mt-2">
              <button
                onClick={sendRating}
                disabled={!selectedRating}
                className={`px-4 py-2 rounded bg-[#F83758] text-white`}
              >
                Save
              </button>
            </div>
          )}
          {submittingRating && (
            <div className="mt-2">
              <button
                disabled
                className="px-4 py-2 rounded bg-gray-300 text-gray-500 cursor-not-allowed"
              >
                Saving...
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="mt-4">
          <h3 className="text-base font-semibold text-[#2D2343]">
            Product Details
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {expanded ? product.details : product.details.slice(0, 160)}
            {!expanded && product.details.length > 160 ? "…" : ""}
          </p>
          {product.details.length > 160 && (
            <button
              className="text-sm text-[#FE6B8B] mt-1"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Show less" : "More"}
            </button>
          )}
        </div>

        {/* Qty + Checkout */}
        <div className="flex items-center gap-3 mt-4">
          <div>
            <p className="text-sm text-black-600 mb-2 font-semibold">
              Select Quantity
            </p>
            <QtyStepper
              qty={qty}
              updateCartQty={updateCartQty}
              stock={product.stock}
            />
          </div>
          <Button
            onClick={handleCheckout}
            disabled={qty === 0}
            className={`${
              qty === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#F83758] text-white"
            }`}
          >
            Checkout
          </Button>
        </div>

        {/* Similar products */}
        {similarProducts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-base font-semibold text-[#2D2343] mb-3">
              Similar To
            </h3>
            <BannerList
              title="Similar Products"
              layout="horizontal"
              data={similarProducts}
              showHeader={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
