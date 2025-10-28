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
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeSize, setActiveSize] = useState("");
  const [activeColor, setActiveColor] = useState("");
  const [qty, setQty] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // Load qty from localStorage on mount
  useEffect(() => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // match product + size + color
    const existing = cart.find(
      (item) =>
        item.id === Number(id) &&
        (item.size || "default") === (activeSize || "default") &&
        (item.color || "default") === (activeColor || "default")
    );

    if (existing?.qty) {
      setQty(existing.qty);
    } else {
      setQty(0); // default if not in cart
    }
  }, [id, activeSize, activeColor]);

  const updateCartQty = (newQty) => {
    // ✅ Prevent adding or increasing out-of-stock items
    if (product?.stock <= 0) {
      alert("❌ This product is out of stock and cannot be added to the cart.");
      return;
    }
    if (newQty > product.stock) {
      alert(`⚠️ Only ${product.stock} left in stock.`);
      return;
    }

    // ✅ Normal cart handling
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    setQty(newQty);

    const existingItemIndex = cart.findIndex((item) => item.id === Number(id));

    if (existingItemIndex >= 0) {
      if (newQty === 0) {
        cart.splice(existingItemIndex, 1);
      } else {
        cart[existingItemIndex].qty = newQty; // update qty
      }
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Use the new endpoint!
        const res = await fetch(`${URL}/products/${id}/with-primary-image`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();

        // Parse options
        let sizes = [];
        let colors = [];
        try {
          let optionsArr = [];
          if (Array.isArray(data.options)) {
            optionsArr = data.options;
          } else if (typeof data.options === "string") {
            optionsArr = JSON.parse(data.options);
          }
          // Parse sizes and colors from options
          optionsArr.forEach((opt) => {
            if (
              opt.name.toLowerCase().includes("size") &&
              Array.isArray(opt.values)
            ) {
              sizes = sizes.concat(opt.values);
            }
            if (
              opt.name.toLowerCase().includes("color") &&
              Array.isArray(opt.values)
            ) {
              colors = colors.concat(opt.values);
            }
          });
          // Remove duplicates
          sizes = [...new Set(sizes)];
          colors = [...new Set(colors)];
        } catch (e) {
          console.error("Options parse error:", e);
        }

        // Build images array from response
        const images = Array.isArray(data.images)
          ? data.images.map((img) => img.link)
          : [];

        if (data.primary_image && !images.includes(data.primary_image)) {
          images.unshift(data.primary_image);
        }

        setProduct({
          id: data.id,
          title: data.name,
          subtitle: data.description,
          rating: data.avg_rating || 0,
          ratingCount: data.rating_count || 0,
          price: data.endprice || data.price,
          oldPrice: data.price,
          stock: data.stock || 0, // ✅ Add this line
          discount:
            data.price && data.endprice
              ? `${Math.round(
                  ((data.price - data.endprice) / data.price) * 100
                )}%`
              : "0%",
          sizes: sizes.length ? sizes : [],
          colors: colors.length ? colors : [],
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

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading product...</p>
      </div>
    );
  }

  // Checkout handler
  const handleCheckout = () => {
    if (qty === 0) return; // do nothing if no qty
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
        {/* Product image */}
        <div
          className="w-full rounded-2xl overflow-x-auto bg-gray-100 aspect-[4/3] flex gap-3 scrollbar-hide"
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

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div className="mt-3">
            <p className="text-base font-semibold text-[#2D2343]">
              Size: <span className="font-normal">{activeSize}</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.sizes.map((s) => (
                <SizePill
                  key={s}
                  label={s}
                  active={activeSize === s}
                  onClick={() => setActiveSize(s)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {product.colors?.length > 0 && (
          <div className="mt-3">
            <p className="text-base font-semibold text-[#2D2343]">
              Color: <span className="font-normal">{activeColor}</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {product.colors.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveColor(c)}
                  className={`px-3 py-2 rounded-md border text-sm ${
                    activeColor === c
                      ? "bg-[#FE6B8B] text-white border-[#FE6B8B]"
                      : "bg-gray-100 text-[#2D2343] border-[#FE6B8B]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product details */}
        <div className="mt-3">
          <h1 className="text-xl font-bold text-[#2D2343]">{product.title}</h1>
          <p className="text-sm text-gray-600">{product.subtitle}</p>
          <div className="flex items-center gap-2 mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={product.rating >= star ? "#FFC107" : "#E0E0E0"}
                strokeWidth="1"
                className="inline"
              >
                <polygon points="12,2 15,9 22,9.3 17,14 18.5,21 12,17.5 5.5,21 7,14 2,9.3 9,9" />
              </svg>
            ))}
            <span className="ml-2 text-gray-600 text-sm">
              {product.ratingCount}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-lg text-gray-400 line-through">
              ₹{product.oldPrice}
            </span>
            <span className="text-xl font-semibold text-gray-600">
              ₹{product.price}
            </span>
            <span className="text-lg font-semibold text-[#FE735C]">
              {product.discount} Off
            </span>
          </div>
        </div>

        {/* Product description */}
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
