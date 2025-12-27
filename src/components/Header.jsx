import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Menu, Search } from "lucide-react";
import bell from "../assets/SVG/bell.svg";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DefaultProfile from "../assets/Images/rid_profile.jpg";
import { globalSearch } from "../services/searchService";

const Header = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState({
    partners: [],
    travelers: [],
    riders: [],
  });
  const [loading, setLoading] = useState(false);

  const { user, notifications, markAsRead, markAllAsRead, logout } = useAuth();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  const unreadCount = (notifications && notifications.length) || 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
      // close search dropdown when clicking outside
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults({ partners: [], travelers: [], riders: [] });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setProfileDropdown(!profileDropdown);

  const handleNotificationClick = async (notification) => {
    try {
      await markAsRead(notification.id);
      setShowDropdown(false);
      if (notification.data?.url) navigate(notification.data.url);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setShowDropdown(false);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const normalizeSearchResponse = (data) => {
    
    if (data && typeof data === "object" && !Array.isArray(data)) {
      return {
        partners: data.partners || data.partner || [],
        travelers: data.travelers || data.traveler || [],
        riders: data.riders || data.rider || [],
      };
    }

        if (Array.isArray(data)) {
          const normalized = { partners: [], travelers: [], riders: [] };
          data.forEach((item) => {
            // Safety check: ensure item exists before accessing its properties
            if (!item) return;
            
            const t = (item.type || "").toString().toLowerCase();
            if (t.includes("partner")) normalized.partners.push(item);
            else if (t.includes("traveler")) normalized.travelers.push(item);
            else if (t.includes("rider")) normalized.riders.push(item);
           
          });
          return normalized;
        }

    return { partners: [], travelers: [], riders: [] };
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value || !value.trim()) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      setSearchResults({ partners: [], travelers: [], riders: [] });
      setLoading(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await globalSearch(value);
        const normalized = normalizeSearchResponse(data);
        setSearchResults(normalized);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults({ partners: [], travelers: [], riders: [] });
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const handleSelect = (type, id) => {
    const lower = (type || "").toString().toLowerCase();
    if (lower === "partner") navigate(`/partners/profile/${id}`);
    else if (lower === "traveler") navigate(`/travelers/profile/${id}`);
    else if (lower === "rider") navigate(`/riders/profile/${id}`);
    setSearchTerm("");
    setSearchResults({ partners: [], travelers: [], riders: [] });
  };

  return (
    <header className="bg-white shadow-sm p-6 flex items-center justify-between w-full z-10 relative">
      <button
        className="md:hidden text-gray-700 focus:outline-none"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Search */}
      <div
        ref={searchRef}
        className="relative text-gray-400 w-full max-w-[380px] mr-4"
      >
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search Partner, Traveler, Rider..."
          className="pl-8 pr-4 py-3 border border-gray-300 rounded-xl text-base w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-label="Search"
          value={searchTerm}
          onChange={handleSearch}
        />

        {/* Dropdown */}
        {(loading ||
          (searchResults.partners && searchResults.travelers && searchResults.riders && (
            searchResults.partners.length > 0 ||
            searchResults.travelers.length > 0 ||
            searchResults.riders.length > 0
          ))) && (
            <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-[900px] z-20 p-4">
              {loading ? (
                <p className="text-center text-gray-500 text-sm py-2">Searching...</p>
              ) : (
                <div className="grid grid-cols-3 gap-4 text-sm">

                  <div>
                    <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">
                      Partner
                    </h4>
                    {Array.isArray(searchResults.partners) &&
                      searchResults.partners.length > 0 ? (
                      searchResults.partners.map((p) => (
                        <div
                          key={p.id}
                          className="py-1 cursor-pointer hover:text-orange-600 transition"
                          onClick={() => handleSelect("partner", p.id)}
                        >
                          <p>{p.name}</p>
                          <small>{p.business_name}</small>

                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic">No Record</p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">
                      Traveler
                    </h4>
                    {Array.isArray(searchResults.travelers) &&
                      searchResults.travelers.length > 0 ? (
                      searchResults.travelers.map((t) => (
                        <div
                          key={t.id}
                          className="py-1 cursor-pointer hover:text-orange-600 transition"
                          onClick={() => handleSelect("traveler", t.id)}
                        >
                          {t.name}

                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic">No Record</p>
                    )}
                  </div>

                  {/* Rider Column */}
                  <div>
                    <h4 className="font-semibold text-gray-700 border-b pb-1 mb-2">
                      Rider
                    </h4>
                    {Array.isArray(searchResults.riders) &&
                      searchResults.riders.length > 0 ? (
                      searchResults.riders.map((r) => (
                        <div
                          key={r.id}
                          className="py-1 cursor-pointer hover:text-orange-600 transition"
                          onClick={() => handleSelect("rider", r.id)}
                        >
                          {r.first_name || r.name || ""}{" "}
                          {r.last_name ? r.last_name : ""}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic">No Record</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="relative" ref={dropdownRef}>
          <button
            className="relative text-gray-400 w-6 h-6"
            onClick={() => setShowDropdown(!showDropdown)}
            aria-label={`Notifications (${unreadCount} unread)`}
            aria-expanded={showDropdown}
          >
            <img src={bell} alt="Notifications" className="w-full h-full" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div
              className="absolute right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-20 animate-fadeIn"
              role="menu"
              aria-labelledby="notifications"
            >
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-300">
                <span className="text-sm font-semibold text-gray-800">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs font-medium text-orange-600 hover:text-orange-800"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 text-sm border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${!n.read_at ? "bg-orange-50" : ""
                        }`}
                      onClick={() => handleNotificationClick(n)}
                      role="menuitem"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleNotificationClick(n);
                        }
                      }}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read_at && (
                          <span
                            className="w-2 h-2 mt-1.5 bg-orange-500 rounded-full"
                            aria-hidden="true"
                          />
                        )}
                        <div className="flex-1">
                          {n.data.title && (
                            <strong className="text-gray-800 font-medium">
                              {n.data.title}
                            </strong>
                          )}
                          <p className="text-gray-600 mt-1">{n.data.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center" role="alert">
                    No notification
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className=" items-center gap-3 relative hidden md:block" ref={profileRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 focus:outline-none hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <img
              src={user?.profile_photo || DefaultProfile}
              alt="Profile"
              className="w-12 h-12 rounded-[10px]"
            />
            <span className="text-base font-medium text-left text-[#232323] hidden md:inline leading-[150%]">
              {user?.name || `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || "User"}
              <br />
              <span className="text-xs font-medium text-[#9A9A9A] hidden md:inline leading-[150%]">
                {user?.email || "user@example.com"}
              </span>
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${profileDropdown ? "rotate-180" : ""
                }`}
              strokeWidth={2.5}
            />
          </button>

          {profileDropdown && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <button
                onClick={() => {
                  navigate("/settings");
                  setProfileDropdown(false);
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-[#4F4F4F] hover:bg-[#FEF2E6] transition-colors"
              >
                <span>Settings</span>
              </button>
              <button
                onClick={async () => {
                  setProfileDropdown(false);
                  try {
                    await logout();
                  } catch (error) {
                    console.error("Logout failed:", error);
                  }
                }}
                className="flex items-center w-full px-4 py-3 text-sm text-[#4F4F4F] hover:bg-[#FEF2E6] transition-colors border-t border-gray-100"
              >
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
