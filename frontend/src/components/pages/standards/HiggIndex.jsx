import React from "react";

export function HiggIndex() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center animate-fadeIn">
      <h1 className="text-4xl font-bold text-green-700 mb-6 text-center">
        Higg Index – Sustainability Measurement
      </h1>

      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-green-600">
            What is the Higg Index?
          </h2>
        </div>
        <div className="p-6 text-gray-700 leading-relaxed space-y-4">
          <p>
            The Higg Index is a sustainability assessment tool used in the
            apparel and textile industry. It measures environmental impact
            across the entire product lifecycle.
          </p>
          <p className="font-semibold">Higg measures:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Water usage</li>
            <li>Energy consumption</li>
            <li>Chemical impact</li>
            <li>Carbon emissions</li>
            <li>Waste generation</li>
          </ul>
          <p>
            The goal is to help brands understand and reduce their environmental
            footprint.
          </p>
        </div>
      </div>
    </div>
  );
}