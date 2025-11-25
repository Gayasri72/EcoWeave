import { useState, useEffect } from "react";

function Info() {
  const [activeCard, setActiveCard] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sustainableFeatures = [
    {
      title: "Knitting",
      description:
        "Grown without harmful pesticides, protecting soil and water while ensuring softer, healthier fabrics.",
      image:
        "data:image/jpeg;base64,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",
      icon: "🌱",
      stats: "70% less water usage",
    },
    {
      title: "Finishing",
      description:
        "Transforming waste into beautiful textiles, reducing landfill burden and creating circular fashion.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpIZMaZmkyuAm6o5chusCJJ20ppEICJYNLOQ&s",
      icon: "♻️",
      stats: "80% reduced carbon footprint",
    },
    {
      title: "Sewing",
      description:
        "Colors derived from plants, minerals, and earth elements for vibrant hues without toxic chemicals.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG9wcD7weSq7VXlMvFHkA8QKPvCW4UwQlEVA&s",
      icon: "🎨",
      stats: "100% chemical-free coloring",
    },
  ];

  const impactStats = [
    { number: "2.7B", label: "Gallons of water saved", icon: "💧" },
    { number: "45%", label: "Less CO2 emissions", icon: "🌍" },
    { number: "90%", label: "Biodegradable materials", icon: "🍃" },
    { number: "5M", label: "Trees protected", icon: "🌳" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Hero Section */}
      <section className="py-12 lg:py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-3xl lg:text-7xl font-bold text-gray-800 mb-6">
              What Are{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 animate-pulse">
                Sustainable Textiles?
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the revolutionary approach to fashion that heals our
              planet while creating beautiful, durable, and comfortable clothing
              for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Cards Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {sustainableFeatures.map((feature, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer transition-all duration-700 transform hover:scale-105 ${
                  activeCard === index ? "scale-105" : ""
                }`}
                onMouseEnter={() => setActiveCard(index)}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-96 group-hover:shadow-2xl transition-all duration-500">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                    {/* Floating Icon */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full w-12 h-12 flex items-center justify-center text-2xl animate-bounce">
                      {feature.icon}
                    </div>

                    {/* Stats Badge */}
                    <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {feature.stats}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Our Environmental Impact
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Every sustainable choice creates ripples of positive change across
              our planet
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <div
                key={index}
                className="text-center group animate-slideUp"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-4xl mb-4 group-hover:animate-bounce">
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-sm lg:text-base opacity-90">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Visualization */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
              From Nature to Fashion
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Follow the journey of sustainable textiles from their natural
              origins to your wardrobe
            </p>
          </div>

          {/* Process Steps */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-20 left-0 w-full h-1 bg-gradient-to-r from-green-300 via-emerald-400 to-green-500 hidden lg:block"></div>

            <div className="grid lg:grid-cols-4 gap-8 relative">
              {[
                {
                  step: "1",
                  title: "Sustainable Sourcing",
                  desc: "Organic farms & recycled materials",
                  icon: "🌾",
                },
                {
                  step: "2",
                  title: "Eco-Friendly Processing",
                  desc: "Natural dyes & clean water systems",
                  icon: "⚗️",
                },
                {
                  step: "3",
                  title: "Ethical Manufacturing",
                  desc: "Fair wages & safe working conditions",
                  icon: "🏭",
                },
                {
                  step: "4",
                  title: "Your Wardrobe",
                  desc: "Beautiful, sustainable fashion",
                  icon: "👕",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center relative animate-fadeInUp"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Step Circle */}
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-lg hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className="text-4xl mb-4 hover:animate-bounce">
                    {item.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-emerald-50 to-green-100">
        <div className="max-w-4xl mx-auto text-center px-4">
          <div className="animate-slideUp">
            <h2 className="text-3xl lg:text-5xl font-bold text-gray-800 mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of conscious consumers choosing sustainable fashion
              for a better tomorrow
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                Shop Sustainable Collection
              </button>
              <button className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Learn More About Our Mission
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Info;
