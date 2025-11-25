import React from "react";

export function Pfmm() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center animate-fadeIn">
      <h1 className="text-4xl font-bold text-purple-700 mb-6 text-center">
        PFMM – Fiber & Materials Impact Ranking
      </h1>

      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-purple-600">
            What is PFMM?
          </h2>
        </div>
        <div className="p-6 text-gray-700 leading-relaxed space-y-4">
          <p>
            The Preferred Fiber & Materials Matrix (PFMM) evaluates how
            sustainable different fibers are. It helps companies choose better
            materials.
          </p>

          <p className="font-semibold">PFMM ranks fibers based on:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Water footprint</li>
            <li>Energy required</li>
            <li>Chemical intensity</li>
            <li>Biodiversity impact</li>
            <li>Carbon emissions</li>
          </ul>

          <p>
            Examples: recycled polyester scores better than virgin polyester,
            and organic cotton scores better than conventional cotton.
          </p>
        </div>
      </div>
    </div>
  );
}