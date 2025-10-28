import React, { useState, useEffect } from "react";
import { URL } from "../utils/api";

const BannerSlider = ({ data }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const ensureAbsoluteUrl = (url) => {
    if (!url) return "https://via.placeholder.com/300?text=No+Image";
    if (/^https?:\/\//i.test(url)) return url;
    return `${URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const slides = Array.isArray(data)
    ? data.filter(Boolean).map((slide) => ({
        ...slide,
        image: ensureAbsoluteUrl(slide.image || ""),
      }))
    : [];

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = 5000;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[activeSlide] || {};
  const image = currentSlide.image || "";
  const title = currentSlide.name || "Untitled";
  const subtitle = currentSlide.subtitle || "";
  const details = currentSlide.details || "";
  const link = currentSlide.link;
  const cta = currentSlide.cta || "Shop Now";

  const handleCTA = (e) => {
    e.stopPropagation();
    if (link) window.location.href = link;
  };

  return (
    <>
      <div
        className="rounded-2xl relative overflow-hidden flex items-center min-h-[220px] p-0"
        style={{
          backgroundImage: image ? `url(${image})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "right center",
          backgroundColor: image ? "transparent" : "#F83758",
          transition: "background-image 0.5s ease-in-out",
        }}
      >
        <div className="absolute inset-0"></div>
        <div className="relative z-10 flex-1 pl-5 py-8 pr-0 flex flex-col justify-center items-start">
          <div className="text-xl font-extrabold text-white mb-2 leading-tight text-left">
            {title}
          </div>
          <div className="text-white text-sm mb-1 font-normal text-left">
            {subtitle}
          </div>
          <div className="text-white text-sm mb-3 font-normal">{details}</div>

          <button
            className="text-white border-1 border-white px-3 py-1 rounded-lg font-medium text-base text-left mt-1 mb-2 shadow-none flex items-center gap-2"
            onClick={handleCTA}
            type="button"
          >
            {cta} <span className="text-lg">&rarr;</span>
          </button>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="flex gap-2 justify-center mt-5 mb-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-2.5 h-2.5 rounded-full ${
                index === activeSlide ? "bg-[#FFA3B3]" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default BannerSlider;
