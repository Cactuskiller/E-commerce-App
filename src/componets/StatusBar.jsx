const StatusBar = () => (
  <div className="flex items-center justify-between w-full px-4 ">
    <span className="text-xs text-gray-500 font-semibold">9:41</span>
    <div className="flex items-center space-x-1">
      {/* Signal Icon */}
      <svg width="18" height="10" fill="none" viewBox="0 0 18 10">
        <rect x="0" y="6" width="2" height="4" fill="#333" />
        <rect x="3" y="4" width="2" height="6" fill="#333" />
        <rect x="6" y="2" width="2" height="8" fill="#333" />
        <rect x="9" y="0" width="2" height="10" fill="#333" />
      </svg>
      {/* WiFi Icon */}
      <svg width="14" height="10" fill="none" viewBox="0 0 14 10">
        <path d="M7 8a1 1 0 100 2 1 1 0 000-2zm-3-2a5 5 0 016 0" stroke="#333" strokeWidth="1" fill="none"/>
        <path d="M2 4a9 9 0 0110 0" stroke="#333" strokeWidth="1" fill="none"/>
      </svg>
      {/* Battery Icon */}
      <svg width="24" height="10" fill="none" viewBox="0 0 24 10">
        <rect x="0.5" y="1.5" width="20" height="7" rx="1.5" stroke="#333" />
        <rect x="22" y="3" width="2" height="4" rx="1" fill="#333" />
        <rect x="2" y="3" width="16" height="4" rx="1" fill="#333" />
      </svg>
    </div>
  </div>
);

export default StatusBar;