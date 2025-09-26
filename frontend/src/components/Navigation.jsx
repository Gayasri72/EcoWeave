import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStandardsOpen, setIsStandardsOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const standardsRef = useRef(null);
  const signInRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        standardsRef.current &&
        !standardsRef.current.contains(event.target)
      ) {
        setIsStandardsOpen(false);
      }
      if (signInRef.current && !signInRef.current.contains(event.target)) {
        setIsSignInOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const standardsItems = [
    {
      name: "ISO 14001",
      href: "/standards/iso14001",
      description: "Environmental Management",
    },
    {
      name: "GOTS",
      href: "/standards/gots",
      description: "Global Organic Textile Standard",
    },
    {
      name: "OEKO-TEX",
      href: "/standards/oekotex",
      description: "Textile Safety Standards",
    },
  ];

  const userGroups = [
    {
      name: "Customer",
      href: "/signin/customer",
      description: "Shop sustainable fashion",
    },
    {
      name: "Designer",
      href: "/signin/designer",
      description: "Create eco-friendly designs",
    },
    {
      name: "Manufacturer",
      href: "/signin/manufacturer",
      description: "Sustainable production",
    },
  ];

  return (
    <nav className="bg-[#DDF4E7] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors"
            >
              EcoWeave
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {/* Standards Dropdown */}
              <div className="relative" ref={standardsRef}>
                <button
                  onClick={() => setIsStandardsOpen(!isStandardsOpen)}
                  className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center"
                >
                  Standards
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform ${
                      isStandardsOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {isStandardsOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    {standardsItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="block px-4 py-3 hover:bg-green-50 transition-colors"
                        onClick={() => setIsStandardsOpen(false)}
                      >
                        <div className="font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.description}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/products"
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Products
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                T-shirt
              </Link>
            </div>
          </div>

          {/* Sign In Dropdown */}
          <div className="hidden lg:block relative" ref={signInRef}>
            <button
              onClick={() => setIsSignInOpen(!isSignInOpen)}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 flex items-center"
            >
              Sign In
              <svg
                className={`ml-1 h-4 w-4 transition-transform ${
                  isSignInOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {isSignInOpen && (
              <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                {userGroups.map((group) => (
                  <Link
                    key={group.name}
                    to={group.href}
                    className="block px-4 py-3 hover:bg-green-50 transition-colors"
                    onClick={() => setIsSignInOpen(false)}
                  >
                    <div className="font-medium text-gray-900">
                      {group.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {group.description}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile/Medium Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {/* Standards Section */}
              <div className="mb-4">
                <h3 className="px-3 py-2 text-sm font-semibold text-gray-900">
                  Standards
                </h3>
                {standardsItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-6 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Other Navigation Items */}
              <Link
                to="/products"
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              {/* Sign In Section */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="px-3 py-2 text-sm font-semibold text-gray-900">
                  Sign In As
                </h3>
                {userGroups.map((group) => (
                  <Link
                    key={group.name}
                    to={group.href}
                    className="block px-6 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="font-medium">{group.name}</div>
                    <div className="text-xs text-gray-500">
                      {group.description}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
