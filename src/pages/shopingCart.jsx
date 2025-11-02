import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Tickmark from '../componets/Tickmark';
import Button from '../componets/button';
import NavBar from '../componets/NavBar';
import { URL } from '../utils/api';

export default function ShoppingCart() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get passed data from checkout
  const { address, items, voucher, summary } = location.state || {};

  const handleContinue = async () => {
    // Use items instead of cartItems
    for (const item of items) {
      if (item.qty > item.stock) {
        alert(`Not enough stock for ${item.title}. Available: ${item.stock}`);
        return;
      }
    }

    // Get user info from localStorage
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

    const payload = {
  user_id: currentUser.id,
  items: items.map(item => ({
    product_id: item.id,
    quantity: item.qty,
    price: item.price,
    name: item.title,
    image: item.primary_image,
    // options: item.options, // if you have options
    // notes: item.notes,     // if you have notes
  })),
  phone: currentUser.phone,
  address: address.address,
  status: "Created",
  created_at: new Date().toISOString(),
  active: true,
  voucher_info: voucher || null,
  delivery_cost: 0,
  voucher_id: voucher?.id || null,
};

    try {
      setLoading(true);
      const token = localStorage.getItem("token"); // Or wherever you store your JWT

      const res = await fetch(`${URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      setLoading(false);
      if (!res.ok) {
        alert(result.error || "Order failed");
        return;
      }
      setShowPaymentSuccess(true);
    } catch (err) {
      setLoading(false);
      alert("Network error");
    }
  };

  useEffect(() => {
    if (showPaymentSuccess) {
      const timer = setTimeout(() => {
        navigate("/home");
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [showPaymentSuccess, navigate]);

  return (
    <div className="h-[100dvh] bg-[#FDFDFD] flex flex-col">
      {/* Payment Success Popup */}
      {showPaymentSuccess && (
        <div className="fixed inset-0 bg-gray bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-xs w-full text-center flex flex-col items-center">
            <Tickmark />
            <h2 className="text-lg font-semibold mt-4 mb-2 text-[#222]">
              Payment done successfully.
            </h2>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur">
        <div className="mx-auto w-full max-w-sm border-b border-gray-200 pb-5 pt-5">
          <div className="w-[95%] mx-auto h-12 flex items-center justify-center relative">
            <button
              onClick={() => navigate(-1)}
              className="absolute left-0 w-8 h-8 grid place-items-center rounded-full hover:bg-gray-100"
              aria-label="Go back"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 6l-6 6 6 6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <h1 className="text-base font-semibold text-[#111827]">Checkout</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-sm mx-auto w-[95%] flex-1 pb-[120px] pt-4 space-y-6">
        {/* Summary rows */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-gray-400">
            <span>Order</span>
            <span>$ {summary?.orderAmount?.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <span>Shipping</span>
            <span>$ {summary?.delivery?.toLocaleString('en-IN') || "0"}</span>
          </div>
          <div className="flex items-center justify-between text-[#111827] font-medium mt-2">
            <span>Total</span>
            <span className="text-base font-bold text-[#F83758]">
              $ {summary?.total?.toLocaleString('en-IN')}
            </span>
          </div>
          <hr className="border-gray-200 mt-2" />
        </div>

        {/* Address Details */}
        <div className="space-y-8">
          <h2 className="text-[15px] font-semibold text-[#111827]">Address Details</h2>
          <div>
            <label className="text-sm text-gray-500">Address</label>
            <div className="mt-1 rounded-xl border border-gray-400 px-4 py-3 text-[#111827] font-medium">
              {address ? `${address.address}, ${address.city} ${address.country}` : ""}
            </div>
          </div>
        </div>

        {/* Items List - Improved Card Style */}
        <div className="space-y-3">
          <h2 className="text-[15px] font-semibold text-[#111827]">Products</h2>
          {items?.length > 0 ? (
            items.map((it, idx) => (
              <div key={idx} className="flex items-center gap-3 border rounded-lg p-3 mb-2 bg-white shadow-sm">
                {it.primary_image && (
                  <img
                    src={it.primary_image}
                    alt={it.title}
                    className="w-14 h-14 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <div className="font-semibold text-[#222]">{it.title}</div>
                  <div className="text-xs text-gray-500">Qty: {it.qty}</div>
                  <div className="text-xs text-gray-500">Price: ${it.price}</div>
                </div>
                <div className="font-bold text-[#F83758] text-base">
                  ${(it.price * it.qty).toLocaleString('en-IN')}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No products found.</p>
          )}
        </div>

        {/* Voucher Info */}
        {voucher && (
          <div className="mt-4">
            <h2 className="text-[15px] font-semibold text-[#111827]">Voucher</h2>
            <div className="text-sm text-gray-700">
              Code: {voucher.code}<br />
              Discount: {voucher.type} {voucher.value}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="pt-2">
          <Button onClick={handleContinue} disabled={loading}>
            {loading ? "Processing..." : "Continue"}
          </Button>
        </div>
      </div>

   
    </div>
  );
}

