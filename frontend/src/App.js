import React, { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./styles.css";
import { useContent } from "./context/ContentContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import OrderModal from "./components/OrderModal";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import About from "./pages/About";
import Visit from "./pages/Visit";
import Admin from "./pages/Admin";

const OrderContext = createContext(null);
export const useOrder = () => useContext(OrderContext);

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { content } = useContent();
  const location = useLocation();
  const [orderOpen, setOrderOpen] = useState(false);
  const isAdmin = location.pathname.startsWith("/admin");

  const openOrder = () => {
    const url = content?.site?.orderUrl?.trim();
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      setOrderOpen(true);
    }
  };

  return (
    <OrderContext.Provider value={{ openOrder }}>
      <ScrollManager />
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/visit" element={<Visit />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {!isAdmin && <Footer />}
      <OrderModal open={orderOpen} onClose={() => setOrderOpen(false)} />
    </OrderContext.Provider>
  );
}
