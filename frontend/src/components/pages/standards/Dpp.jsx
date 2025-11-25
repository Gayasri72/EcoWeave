import React from "react";

export function Dpp() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center animate-fadeIn">
      <h1 className="text-4xl font-bold text-blue-700 mb-6 text-center">
        Digital Product Passport (DPP)
      </h1>

      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-2xl font-semibold text-blue-600">
            What is a Digital Product Passport?
          </h2>
        </div>
        <div className="p-6 text-gray-700 leading-relaxed space-y-4">
          <p>
            A Digital Product Passport (DPP) gives every product a digital
            identity. It contains sustainability and supply-chain data
            accessible usually via a QR code.
          </p>

          <p className="font-semibold">DPP includes:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Material composition</li>
            <li>Production stages & factory data</li>
            <li>Environmental impact</li>
            <li>Repairability & recyclability</li>
            <li>Lifetime traceability</li>
          </ul>

          <p>
            The goal is transparency: Consumers and brands can track how
            sustainable a product truly is.
          </p>
        </div>
      </div>
    </div>
  );
}