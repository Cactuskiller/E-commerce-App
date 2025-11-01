import { AiOutlineHome, AiOutlineHeart, AiOutlineShoppingCart, AiOutlineSearch, AiOutlineSetting } from "react-icons/ai";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: 'Home', icon: AiOutlineHome, route: '/home' },
  { label: 'Wishlist', icon: AiOutlineHeart, route: '/wishlist' },
  { label: 'Cart', icon: AiOutlineShoppingCart, route: '/shopping-cart' },
  { label: 'Search', icon: AiOutlineSearch, route: '/search' },
  { label: 'Setting', icon: AiOutlineSetting, route: '' },
];

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white shadow flex justify-between items-center px-2 py-4 z-10">
      {navItems.map((item) => {
        const isActive = item.route && location.pathname === item.route;
        if (item.label === 'Cart') {
          return (
            <div key={item.label} className="flex-1 flex justify-center" style={{ zIndex: 2 }}>
              <button
                onClick={() => navigate(item.route)}
                className={`-mt-8 rounded-full transition-all duration-200 shadow-lg ${isActive ? 'bg-red-500' : 'bg-white'} w-16 h-16 flex items-center justify-center border-4 border-white`}
                style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
              >
                <item.icon size={32} className={isActive ? 'text-white' : 'text-gray-600'} />
              </button>
            </div>
          );
        }
        return (
          <div key={item.label} className="flex-1 flex flex-col items-center justify-center">
            <button
              onClick={() => item.route && navigate(item.route)}
              className="flex flex-col items-center focus:outline-none"
            >
              <item.icon size={32} className={isActive ? 'text-red-500' : 'text-gray-600'} />
              <span className={`mt-1 text-sm ${isActive ? 'text-red-500 font-semibold' : 'text-black'}`}>{item.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NavBar;