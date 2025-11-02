import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import fashionShop1 from '../assets/fashion-shop1.png';
import salesConsulting from '../assets/Sales-consulting.png';
import shoppingBag from '../assets/Shopping-bag.png';


const screens = [
  {
    image:fashionShop1,
    title: "Choose Products",
    description:
      "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
  },
  {
    image: salesConsulting,
    title: "Make Payment",
    description:
      "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
  },
  {
    image:shoppingBag,
    title: "Get Your Order",
    description:
      "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit.",
  },
];


const Onboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-between h-[100dvh] bg-white px-4 py-6 max-w-sm mx-auto">

      {/* Onboarding Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <img
          src={screens[step].image}
          alt={screens[step].title}
          className="w-80 h-80 object-contain mb-6 mx-auto"
        />
        <h2 className="text-2xl font-bold text-center mb-2">
          {screens[step].title}
        </h2>
        <p className="text-gray-400 text-center max-w-xs mb-8">
          {screens[step].description}
        </p>
      </div>

      {/* Progress and navigation */}
      <div className="w-full flex flex-col items-center justify-center">
        {/* Progress Dots */}
        <div className="flex items-center justify-between w-full px-8 mb-2">
          {/* Prev Button */}
          <button
            className={`text-sm ${step === 0 ? "text-gray-300" : "text-gray-500"}`}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
          >
            Prev
          </button>

          {/* Progress Dots */}
          <div className="flex items-center">
            {screens.map((_, idx) => (
              <span
                key={idx}
                className={`mx-1 rounded-full transition-all duration-300 ${
                  idx === step
                    ? "bg-gray-900 w-8 h-2"
                    : "bg-gray-300 w-2 h-2"
                } inline-block`}
              ></span>
            ))}
          </div>

          {/* Next/Get Started Button */}
          {step < screens.length - 1 ? (
            <button
              className="text-sm text-red-500 font-semibold"
              onClick={() => setStep((s) => Math.min(s + 1, screens.length - 1))}
            >
              Next
            </button>
          ) : (
            <button
              className="text-sm text-red-500 font-semibold"
              onClick={() => navigate("/auth")}
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Onboarding;
