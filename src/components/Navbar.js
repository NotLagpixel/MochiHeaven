import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Instagram, ShoppingBag, Menu as MenuIcon, X } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { useOrder } from "../App";

function TikTok(props) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" {...props}>
      <path d="M15.3 3c.4 2.2 1.7 3.5 3.7 3.9v2.5a8.8 8.8 0 0 1-3.7-1.1v6.1a5.6 5.6 0 1 1-4.8-5.5v2.6a3 3 0 1 0 2.3 2.9V3h2.5Z" />
    </svg>
  );
}

export default function Navbar() {
  const { content } = useContent();
  const { openOrder } = useOrder();
  const site = content.site;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);
  const handleOrder = () => {
    close();
    openOrder();
  };

  return (
    <header className={`topbar ${scrolled ? "is-scrolled" : ""}`} data-testid="site-header">
      <div className="shell nav">
        <Link className="brand" to="/" onClick={close} data-testid="brand-logo-link">
          <img src={`${process.env.PUBLIC_URL || ""}/assets/logo.png`} alt="Mochi Heaven" />
        </Link>

        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
          data-testid="mobile-menu-toggle"
        >
          {open ? <X size={26} /> : <MenuIcon size={26} />}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/" end onClick={close} data-testid="nav-home">Home</NavLink>
          <NavLink to="/menu" onClick={close} data-testid="nav-menu">Menu</NavLink>
          <NavLink to="/about" onClick={close} data-testid="nav-about">About</NavLink>
          <NavLink to="/visit" onClick={close} data-testid="nav-visit">Visit Us</NavLink>
          <button className="link-btn" onClick={handleOrder} data-testid="nav-order">Order Online</button>
        </nav>

        <div className="nav-right">
          <a className="social" href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" data-testid="nav-instagram">
            <Instagram size={22} />
          </a>
          <a className="social" href={site.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok" data-testid="nav-tiktok">
            <TikTok />
          </a>
          <button className="order-pill" onClick={openOrder} data-testid="nav-order-now">
            ORDER NOW <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
