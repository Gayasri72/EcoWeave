import { useState, useEffect } from "react";

function Info() {
  const [activeCard, setActiveCard] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sustainableFeatures = [
    {
      title: "Organic Cotton",
      description:
        "Grown without harmful pesticides, protecting soil and water while ensuring softer, healthier fabrics.",
      image:
        "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: "🌱",
      stats: "70% less water usage",
    },
    {
      title: "Recycled Fibers",
      description:
        "Transforming waste into beautiful textiles, reducing landfill burden and creating circular fashion.",
      image:
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: "♻️",
      stats: "80% reduced carbon footprint",
    },
    {
      title: "Natural Dyes",
      description:
        "Colors derived from plants, minerals, and earth elements for vibrant hues without toxic chemicals.",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
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
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-800 mb-6">
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
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
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
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
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
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
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
