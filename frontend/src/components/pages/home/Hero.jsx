import { useState, useEffect } from "react";

const motivationalTexts = [
  "Fashion that Cares for Tomorrow",
  "Weaving Sustainability into Style",
  "Threads of Change, Patterns of Hope",
  "Where Style Meets Sustainability",
  "Eco-Conscious Fashion for a Better World",
];

function Hero() {
  const [currentText, setCurrentText] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentPhrase = motivationalTexts[currentText];

    if (isTyping) {
      if (displayText.length < currentPhrase.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        setCurrentText((prev) => (prev + 1) % motivationalTexts.length);
        setIsTyping(true);
      }
    }
  }, [displayText, isTyping, currentText]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Animated Motivational Text */}
          <div className="space-y-8 animate-fadeInLeft">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                Welcome to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 animate-pulse">
                  EcoWeave
                </span>
              </h1>

              {/* Animated Typing Text */}
              <div className="h-16 flex items-center">
                <h2 className="text-2xl lg:text-3xl font-medium text-green-700 min-h-[3rem]">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </h2>
              </div>

              <p className="text-lg text-gray-600 leading-relaxed max-w-lg animate-slideUp">
                Discover sustainable fashion that cares for both you and the
                planet. Our eco-friendly clothing combines innovative design,
                comfort, and environmental responsibility to create a better
                future through fashion.
              </p>
            </div>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slideUp">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Shop Collection
              </button>
              <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 pt-8 animate-slideUp">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 animate-countUp">
                  500+
                </div>
                <div className="text-sm text-gray-600">Eco Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 animate-countUp">
                  10K+
                </div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 animate-countUp">
                  95%
                </div>
                <div className="text-sm text-gray-600">
                  Sustainable Materials
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Beautiful Sustainable Textile Image */}
          <div className="relative animate-fadeInRight">
            {/* Main Image Container */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-all duration-700 group">
              {/* Large Hero Image */}
              <div className="aspect-[5/4] relative bg-gradient-to-br from-green-100 to-emerald-100">
                <img
                  src="https://smallbizclub.com/wp-content/uploads/2024/07/AdobeStock_858672299-scaled.jpeg"
                  alt="Sustainable organic cotton textiles and eco-friendly fabrics"
                  className="w-full h-full object-cover object-center group-hover:scale-[1.05] transition-transform duration-700 rounded-3xl"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                  loading="lazy"
                  onError={(e) => {
                    console.log("Image failed to load, using fallback");
                    e.target.src =
                      "https://smallbizclub.com/wp-content/uploads/2024/07/AdobeStock_858672299-scaled.jpeg";
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Content Overlay */}
                <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                  <h3 className="text-3xl font-bold mb-2 drop-shadow-lg">
                    Sustainable Textiles
                  </h3>
                  <p className="text-lg opacity-90 drop-shadow-md">
                    Organic • Recycled • Biodegradable
                  </p>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg animate-bounce">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-600">
                    Certified Organic
                  </span>
                </div>
              </div>

              <div className="absolute top-24 right-6 bg-emerald-500 text-white rounded-full px-4 py-2 shadow-lg animate-pulse">
                <span className="text-sm font-semibold">100% Sustainable</span>
              </div>

              <div
                className="absolute bottom-20 right-6 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-xl animate-bounce"
                style={{ animationDelay: "0.5s" }}
              >
                <div className="text-sm font-bold text-green-600">
                  Carbon Neutral
                </div>
                <div className="text-xs text-gray-600">Manufacturing</div>
              </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-green-200 to-emerald-300 rounded-full opacity-30 animate-ping"></div>
            <div
              className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-emerald-200 to-green-300 rounded-full opacity-40 animate-ping"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 -right-4 w-16 h-16 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full opacity-25 animate-pulse"
              style={{ animationDelay: "2s" }}
            ></div>

            {/* Floating Icons */}
            <div
              className="absolute top-16 left-8 bg-white rounded-full p-3 shadow-lg animate-bounce"
              style={{ animationDelay: "1.5s" }}
            >
              <svg
                className="w-6 h-6 text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>

            <div
              className="absolute bottom-32 left-4 bg-emerald-100 rounded-full p-3 shadow-lg animate-pulse"
              style={{ animationDelay: "2.5s" }}
            >
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.61c.48-.03.96-.1 1.45-.21C10.83 15.67 11 8 17 8z" />
                <path d="M3.5 3l14 14-1.5 1.5-14-14z" />
              </svg>
            </div>

            {/* Quality Indicators */}
            <div className="absolute top-1/3 -left-4 bg-white rounded-lg p-4 shadow-xl border-l-4 border-green-500 animate-slideUp">
              <div className="text-2xl font-bold text-green-600">A+</div>
              <div className="text-xs text-gray-600">Eco Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
