import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const BannerTimer = ({ data }) => {
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Extract timer info and products from map[0]
  const mapData = useMemo(() => {
    if (!data?.map || !Array.isArray(data.map) || data.map.length === 0) {
      return null;
    }
    return data.map[0];
  }, [data?.map]);

  const products = mapData?.products || [];
  const endDateStr = mapData?.endDate;

  // Parse endDate string to Date object
  const endDate = useMemo(() => {
    if (endDateStr) {
      // Parse as local time
      const [datePart, timePart] = endDateStr.split(" ");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hour, minute, second] = timePart.split(":").map(Number);
      return new Date(year, month - 1, day, hour, minute, second);
    }
    // Fallback: 24 hours from now
    const fallback = new Date();
    fallback.setHours(fallback.getHours() + 24);
    return fallback;
  }, [endDateStr]);

  useEffect(() => {
    const calc = () => {
      const diff = endDate - new Date();
      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return { hours, minutes, seconds };
    };

    setTimeLeft(calc());
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(timer);
  }, [endDate]);

  const backgroundColor =
    data.background?.trim() !== "" ? data.background : "#FF5733";

  const formatTime = (val) => (val < 10 ? `0${val}` : val);

  // Hide timer banner if finished
  if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return null;
  }

  return (
    <div
      className="rounded-2xl p-4 text-white flex flex-col gap-3"
      style={{ backgroundColor }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="text-lg font-semibold leading-tight">
            {data.name || "Limited Time Offer"}
          </div>
          <div className="text-sm">
            {formatTime(timeLeft.hours)}h {formatTime(timeLeft.minutes)}m{" "}
            {formatTime(timeLeft.seconds)}s remaining
          </div>
        </div>

        <button
          onClick={() => navigate(`/products/timer/${data.id}`)}
          className="text-white border border-white px-3 py-1 rounded-lg font-bold text-sm hover:bg-white hover:bg-opacity-20 transition-colors"
          disabled={!products.length}
        >
          View All →
        </button>
      </div>

      {!mapData && (
        <div className="text-sm text-white mt-2">
          No products or timer info set for this banner.
        </div>
      )}
    </div>
  );
};

export default BannerTimer;
