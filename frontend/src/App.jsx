import { BrowserRouter, Route, Routes } from "react-router-dom";

import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import Info from "./components/pages/Info";
import ContactUs from "./components/pages/ContactUs";
import Home from "./components/pages/Home";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen justify-between">
        <Navigation />

        <main className="flex-1 gap-2 m-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/info" element={<Info />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
