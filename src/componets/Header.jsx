

const Header = ({ logo, profile }) => (
  <div className="sticky top-0 z-20 bg-[#F9F9F9] flex items-center justify-between px-4 py-2 mt-5">
    <button className="bg-[#F2F2F2] rounded-full p-2">
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <rect x="4" y="7" width="16" height="2" rx="1" fill="#333" />
        <rect x="4" y="11" width="16" height="2" rx="1" fill="#333" />
        <rect x="4" y="15" width="16" height="2" rx="1" fill="#333" />
      </svg>
    </button>
    <img src={logo} alt="Stylish Logo" className="h-8" />
    <img src={profile} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
  </div>
);
export default Header;