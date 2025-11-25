import { BrowserRouter, Route, Routes } from "react-router-dom";

import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Info from "./components/pages/Info";
import ContactUs from "./components/pages/ContactUs";
import Home from "./components/pages/Home";
// Products listing removed — product details are accessible only via QR
import ProductDetail from "./components/pages/ProductDetail";
import { Dpp } from "./components/pages/standards/Dpp";
import { Pfmm } from "./components/pages/standards/Pfmm";
import { HiggIndex } from "./components/pages/standards/HiggIndex";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen justify-between">
        <Navigation />

        <main className="flex-1 gap-2 m-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/info" element={<Info />} />
            <Route path="/products/:productId" element={<ProductDetail />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/standards/higg-index" element={<HiggIndex/>} />
            <Route path="/standards/dpp" element={<Dpp />} />
            <Route path="/standards/pfmm" element={<Pfmm />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
