import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";


export function Dpp() {
return (
<div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
<motion.h1
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
className="text-4xl font-bold text-blue-700 mb-6"
>
Digital Product Passport (DPP)
</motion.h1>


<Card className="max-w-3xl shadow-xl rounded-2xl">
<CardHeader>
<CardTitle className="text-2xl font-semibold text-blue-600">
What is a Digital Product Passport?
</CardTitle>
</CardHeader>
<CardContent className="text-gray-700 leading-relaxed space-y-4">
<p>
A Digital Product Passport (DPP) gives every product a digital identity.
It contains sustainability and supply-chain data accessible usually via
a QR code.
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
The goal is transparency: Consumers and brands can track how sustainable
a product truly is.
</p>
</CardContent>
</Card>
</div>
);
}