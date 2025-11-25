import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function HiggIndex() {
return (
<div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
<motion.h1
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
className="text-4xl font-bold text-green-700 mb-6"
>
Higg Index – Sustainability Measurement
</motion.h1>


<Card className="max-w-3xl shadow-xl rounded-2xl">
<CardHeader>
<CardTitle className="text-2xl font-semibold text-green-600">
What is the Higg Index?
</CardTitle>
</CardHeader>
<CardContent className="text-gray-700 leading-relaxed space-y-4">
<p>
The Higg Index is a sustainability assessment tool used in the apparel
and textile industry. It measures environmental impact across the entire
product lifecycle.
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
</CardContent>
</Card>
</div>
);
}