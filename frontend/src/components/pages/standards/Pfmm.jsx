import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function Pfmm() {
return (
<div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
<motion.h1
initial={{ opacity: 0, y: -20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
className="text-4xl font-bold text-purple-700 mb-6"
>
PFMM – Fiber & Materials Impact Ranking
</motion.h1>


<Card className="max-w-3xl shadow-xl rounded-2xl">
<CardHeader>
<CardTitle className="text-2xl font-semibold text-purple-600">
What is PFMM?
</CardTitle>
</CardHeader>
<CardContent className="text-gray-700 leading-relaxed space-y-4">
<p>
The Preferred Fiber & Materials Matrix (PFMM) evaluates how sustainable
different fibers are. It helps companies choose better materials.
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
Examples: recycled polyester scores better than virgin polyester, and
organic cotton scores better than conventional cotton.
</p>
</CardContent>
</Card>
</div>
);
}