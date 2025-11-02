import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "../componets/orderCard";
import Button from "../componets/button";
import Icon from "../assets/icon.png";
import { URL } from "../utils/api";

export default function Checkout() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [voucherCode, setVoucherCode] = useState("");
  const [voucher, setVoucher] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [address, setAddress] = useState({
    address: "",
    city: "",
    country: "",
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [voucherError, setVoucherError] = useState(""); 
  const [addressError, setAddressError] = useState(""); 
  const [deleteProductId, setDeleteProductId] = useState(null); // Track product to delete

  // 🗑️ Delete a product from the cart
  const handleDeleteProduct = (productId) => {
    const updatedItems = items.filter((it) => it.id !== productId);
    setItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
  };

  const applyVoucher = async () => {
    setVoucherError(""); 
    if (!voucherCode) return;
    try {
      const res = await fetch(`${URL}/vouchers/code/${voucherCode}`);
      if (!res.ok) {
        setVoucher(null);
        setVoucherError("Invalid or expired voucher code");
        return;
      }
      const data = await res.json();

      const cartTotal = items.reduce(
        (sum, it) => sum + (it.price || 0) * (it.qty || 1),
        0
      );
      if (data.min_value && cartTotal < data.min_value) {
        setVoucher(null);
        setVoucherError(
          `Voucher requires a minimum cart value of $${data.min_value}.`
        );
        return;
      }

      if (data.is_first) {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const ordersRes = await fetch(`${URL}/orders?user_id=${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const orders = await ordersRes.json();
        if (orders && orders.length > 0) {
          setVoucher(null);
          setVoucherError(
            "This voucher can only be used for your first order."
          );
          return;
        }
      }

      setVoucher(data);
    } catch (err) {
      setVoucher(null);
      setVoucherError("Failed to apply voucher. Please try again.");
    }
  };

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = async () => {
      const storeCart = JSON.parse(localStorage.getItem("cart")) || [];
      const filteredCart = storeCart.filter((item) => item.qty > 0);

      const detailedItems = await Promise.all(
        filteredCart.map(async (item) => {
          try {
            const res = await fetch(
              `${URL}/products/${item.id}/with-primary-image`
            );
            if (!res.ok) return item;
            const data = await res.json();
            return {
              ...item,
              images: data.images,
              primary_image: data.primary_image,
              title: data.name,
              subtitle: data.description,
            };
          } catch {
            return item;
          }
        })
      );

      localStorage.setItem("cart", JSON.stringify(detailedItems));
      setItems(detailedItems);
    };

    loadCart();
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, []);

  // Order summary
  const summary = useMemo(() => {
    const orderAmount = items.reduce(
      (sum, it) => sum + (it.price || 0) * (it.qty || 1),
      0
    );
    const convenience = 0;
    const delivery = 0;
    let discount = 0;
    if (voucher) {
      if (voucher.type === "per" && voucher.value) {
        discount = (orderAmount * voucher.value) / 100;
      } else if (voucher.type === "flat" && voucher.value) {
        discount = voucher.value;
      }
    }

    const total = orderAmount - discount + convenience + delivery;
    return { orderAmount, convenience, delivery, discount, total };
  }, [items, voucher]);

  const handleProceedToPayment = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowAuthModal(true);
      return;
    }
    if (
      !address.address.trim() ||
      !address.city.trim() ||
      !address.country.trim()
    ) {
      setAddressError("Please fill in all address fields before proceeding.");
      return;
    }
    setAddressError(""); 
    navigate("/shopping-cart", {
      state: {
        address,
        items,
        voucher,
        summary,
      },
    });
  };

  return (
    <div className="relative h-[100dvh] flex flex-col max-w-sm mx-auto bg-white pb-28">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200 pb-3">
        <div className="w-[95%] mx-auto h-12 flex items-center justify-center relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute left-0 w-8 h-8 grid place-items-center rounded-full hover:bg-gray-100"
            aria-label="Go back"
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
          <h1 className="text-base font-semibold text-[#111827]">Checkout</h1>
        </div>
      </div>

      {/* Content */}
      <div className="w-[95%] mx-auto mt-4 space-y-4">
        {/* Delivery Address */}
        <div>
          <div className="flex items-center gap-2 text-[#111827]">
            <svg
              className="shrink-0"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 21s-7-5.25-7-12a7 7 0 0 1 14 0c0 6.75-7 12-7 12Z"
                stroke="#111827"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="9"
                r="2.5"
                stroke="#111827"
                strokeWidth="1.6"
              />
            </svg>
            <span className="text-[15px] font-medium">Delivery Address</span>
          </div>

          <div className="mt-3 rounded-2xl border border-gray-200 p-3 bg-white">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-700">Address :</p>
                <p className="text-sm text-gray-700 mt-1 leading-snug">
                  {address.address && address.city && address.country
                    ? `${address.address}, ${address.city} ${address.country}`
                    : "No address entered"}
                </p>
              </div>
              <button
                className="w-8 h-8 grid place-items-center rounded-lg hover:bg-gray-100"
                aria-label="Edit address"
                onClick={() => setShowAddressModal((prev) => !prev)}
              >
                <img src={Icon} alt="Edit" className="w-5 h-5" />
              </button>
            </div>

            {showAddressModal && (
              <>
                <hr className="my-3 border-gray-200" />
                <div className="mt-2 p-3 rounded bg-gray-40">
                  <h2 className="text-base font-semibold mb-2">
                    Address Details
                  </h2>
                  <input
                    type="text"
                    className="border border-gray-200 p-2 rounded w-full mb-2 text-sm"
                    placeholder="Address"
                    value={address.address}
                    onChange={(e) =>
                      setAddress({ ...address, address: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    className="border border-gray-200 p-2 rounded w-full mb-2 text-sm"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    className="border border-gray-200 p-2 rounded w-full mb-2 text-sm"
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) =>
                      setAddress({ ...address, country: e.target.value })
                    }
                  />
                  <Button
                    className="bg-[#F83758] text-white rounded w-full py-2 text-base"
                    onClick={() => setShowAddressModal(false)}
                  >
                    Save
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 🛒 Items List */}
        <div className="space-y-3">
          {items.length > 0 ? (
            items.map((it) => (
              <div
                key={`${it.id}-${it.size}-${it.color}`}
                className="relative rounded-lg p-2 shadow-sm bg-white cursor-pointer"
                style={{ boxShadow: "0 2px 8px rgba(248, 55, 88, 0.12)" }}
                onClick={() => navigate(`/product/${it.id}`)}
              >
                <OrderCard
                  image={
                    Array.isArray(it.images) && it.images.length > 0
                      ? it.images.find((img) => img.priority === 1)?.link ||
                        it.images[0].link
                      : it.primary_image || null
                  }
                  title={it.title}
                  subtitle={it.subtitle}
                  color={it.color}
                  size={it.size}
                  qty={it.qty}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    setDeleteProductId(it.id);
                  }}
                  className="absolute top-2 right-2 text-white bg-[#F83758] hover:bg-[#d32f2f] transition rounded-full shadow-lg p-2"
                  title="Remove product"
                  style={{ zIndex: 2, border: "none" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No items in cart.</p>
          )}
        </div>

        <hr className="border-gray-200" />

        {/* Payment Details */}
        <div className="space-y-3">
          <h2 className="text-[15px] font-semibold text-[#111827]">
            Order Payment Details
          </h2>

          <div className="flex items-center justify-between">
            <span className="text-[15px] text-[#111827]">Order Amount</span>
            <span className="text-[15px] font-semibold">
              ${" "}
              {summary.orderAmount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Voucher Section */}
          <div className="flex flex-col gap-2 mt-3 pt-3">
            <div className="flex justify-between items-center">
              <h1 className="text-[16px] font-[400]">
                Convenience{" "}
                <a className="text-[#EA1712] text-[13px]">Know More</a>
              </h1>
              <p
                className="text-[16px] font-[600] text-[#EA1712] cursor-pointer"
                onClick={() => setVoucherCode(voucherCode === "" ? " " : "")}
              >
                Apply Coupon
              </p>
            </div>

            {voucherCode !== "" && (
              <input
                type="text"
                value={voucherCode.trim()}
                placeholder="Enter voucher code"
                onChange={(e) => setVoucherCode(e.target.value)}
                className="border p-2 rounded w-full mt-2"
              />
            )}

            {voucher && (
              <p className="text-green-600 text-sm mt-2">
                Voucher "{voucher.code}" applied!{" "}
                {voucher.type === "per"
                  ? `Discount: ${voucher.value}%`
                  : `Discount: $${voucher.value}`}
              </p>
            )}

            {voucherError && (
              <p className="text-red-600 text-sm mt-2">{voucherError}</p>
            )}

            {voucherCode !== "" && (
              <Button onClick={applyVoucher} className="mt-2 self-start">
                Apply
              </Button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[15px] text-[#111827]">Delivery Fee</span>
            <span className="text-[15px] text-[#F83758] font-semibold">
              Free
            </span>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[15px] text-[#111827]">Order Total</span>
            <span className="text-[15px] font-semibold">
              ${" "}
              {summary.total.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex items-center justify-start gap-7">
            <span className="text-[15px] text-[#111827] whitespace-pre">
              EMI Available
            </span>
            <button className="text-[13px] text-[#F83758] font-semibold">
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Address Error Message */}
      {addressError && (
        <div className="w-[95%] mx-auto mt-2">
          <p className="text-red-600 text-sm">{addressError}</p>
        </div>
      )}

      {/* Bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-50">
        <div className="mx-auto max-w-sm px-3 pb-4 pt-3 bg-[#F8F8F8] backdrop-blur rounded-t-3xl">
          <div className="w-full flex items-center gap-3">
            <div className="flex-1 px-2 py-2">
              <div className="text-base font-semibold text-[#000000]">
                ${" "}
                {summary.total.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </div>
              <button className="text-[12px] text-[#F83758]">
                View Details
              </button>
            </div>
            <div className="flex-2">
              <Button
                className="bg-[#F83758] text-white rounded-[3px] text-base"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Simple modal overlay */}
      {showAuthModal && (
        <div
          className="fixed inset-0 bg-gray-400 bg-opacity-40 flex items-center justify-center z-50"
          onClick={() => setShowAuthModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 shadow-lg max-w-xs w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-2">
              Authentication Required
            </h2>
            <p className="mb-4 text-gray-700">
              You must be logged in to place an order.
            </p>
            <Button
              className="bg-[#F83758] text-white rounded px-4 py-2"
              onClick={() => navigate("/auth")}
            >
              Go to Login
            </Button>
          </div>
        </div>
      )}

      {/* Delete Product Confirmation Modal */}
      {deleteProductId !== null && (
        <div
          className="fixed inset-0 bg-gray tr bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setDeleteProductId(null)}
        >
          <div
            className="bg-white rounded-lg p-4 shadow-lg min-w-[220px] text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-3 text-base font-semibold text-[#F83758]">
              Remove product from cart?
            </div>
            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-1 rounded bg-gray-200 text-gray-700"
                onClick={() => setDeleteProductId(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-1 rounded bg-[#F83758] text-white"
                onClick={() => {
                  handleDeleteProduct(deleteProductId);
                  setDeleteProductId(null);
                }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
