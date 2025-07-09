import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { fetchDoctorProfile } from "../services/api";

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);

    const checkDoctor = async () => {
      try {
        const data = await fetchDoctorProfile();
        if (data && data.specialization) {
          setIsDoctor(true);
        }
      } catch (err) {
        setIsDoctor(false);
      }
    };

    if (token) {
      checkDoctor();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    setMobileOpen(false);
    navigate("/login");
  };

  // Helper function to determine if a link is active
  const isActiveLink = (href) => {
    // Special case for home page
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  const guestLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "#" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const authLinksBase = [
    { name: "Home", href: "/" },
    { name: "Services", href: "#" },
    { name: "Doctors", href: "/doctors" },
    { name: "Appointments", href: "/my-appointments" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Profile", href: "/profile" },
  ];

  const dashboardLink = { name: "Dashboard", href: "/doctor/doctor_profile" };
  const docAppointments = { name: "My Schedule", href: "/doc-appointments" };
  const applyForDoctor = { name: "Apply For Doctor", href: "/doctor/apply" };
  const logoutLink = { name: "Logout", href: "/" };

  const authLinks = isDoctor
    ? [...authLinksBase, docAppointments, dashboardLink, logoutLink]
    : [...authLinksBase, applyForDoctor, logoutLink];

  const linksToShow = isLoggedIn ? authLinks : [...guestLinks, 
    { name: "Login", href: "/login" },
    { name: "Register", href: "/register" }
  ];

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg backdrop-blur-sm bg-opacity-90" : "bg-white border-b border-gray-100"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              DocMate
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-1 items-center">
            {linksToShow.map((link) =>
              link.name === "Logout" ? (
                <button
                  key={link.name}
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {link.name}
                </button>
              ) : link.name === "Login" || link.name === "Register" ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {link.name}
                </Link>
              ) : (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActiveLink(link.href)
                      ? "text-blue-600 bg-blue-50 font-semibold"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(true)}
              className="text-gray-600 hover:text-blue-600 p-2 focus:outline-none transition-colors duration-300"
              aria-label="Open menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              DocMate
            </span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-300"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 space-y-2">
          {linksToShow.map((link) =>
            link.name === "Logout" ? (
              <button
                key={link.name}
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300"
              >
                {link.name}
              </button>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => {
                  setMobileOpen(false);
                }}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActiveLink(link.href)
                    ? "text-blue-600 bg-blue-50 font-semibold"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {link.name}
              </Link>
            )
          )}
        </div>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0  bg-opacity-50  z-40 transition-opacity duration-300"
        />
      )}
    </nav>
  );
}