import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStandardsOpen, setIsStandardsOpen] = useState(false);
  const standardsRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        standardsRef.current &&
        !standardsRef.current.contains(event.target)
      ) {
        setIsStandardsOpen(false);
      }
      // no sign-in dropdown to close
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const standardsItems = [
    {
      name: "HIGG INDEX",
      href: "/standards/higg-index",
      description: "Sustainability Assessment Tool",
    },
    {
      name: "DPP",
      href: "/standards/dpp",
      description: "Digital Product Passport",
    },
    {
      name: "PFMM",
      href: "/standards/pfmm",
      description: "Preferred Fiber & Materials Matrix ",
    },
  ];

  // Sign-in removed from navigation

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
              EcoJourney
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
                  Inspired By
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

              {/* Products listing removed to prevent public browsing of all items */}
              <Link
                to="/about"
                className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                T-shirt
              </Link>
            </div>
          </div>

          {/* Sign-in removed intentionally */}

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
                  Inspired By
                </h3>
                {standardsItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-6 py-3 text-base text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
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
              {/* Products link removed from mobile menu */}
              <Link
                to="/about"
                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-green-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              {/* Sign-in removed from mobile menu */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
