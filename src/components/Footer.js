import React from "react";
import { Link } from "react-router-dom";
import { Instagram, MapPin } from "lucide-react";
import { useContent } from "../context/ContentContext";
import { useOrder } from "../App";

function TikTok() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M15.3 3c.4 2.2 1.7 3.5 3.7 3.9v2.5a8.8 8.8 0 0 1-3.7-1.1v6.1a5.6 5.6 0 1 1-4.8-5.5v2.6a3 3 0 1 0 2.3 2.9V3h2.5Z" />
    </svg>
  );
}

export default function Footer() {
  const { content } = useContent();
  const { openOrder } = useOrder();
  const site = content.site;

  return (
    <footer className="site-footer" data-testid="site-footer">
      <div className="shell footer-inner">
        <div className="footer-brand">
          <img src={`${process.env.PUBLIC_URL || ""}/assets/logo.png`} alt="Mochi Heaven" />
          <p>{site.hero.lead}</p>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/about">About</Link>
          <Link to="/visit">Visit Us</Link>
          <button className="link-btn" onClick={openOrder}>Order Online</button>
        </div>

        <div className="footer-col">
          <h4>Visit</h4>
          <span className="foot-row"><MapPin size={15} /> {site.visit.address}</span>
          <span>{site.visit.hours}</span>
          <span>{site.visit.phone}</span>
        </div>

        <div className="footer-col">
          <h4>Follow</h4>
          <div className="footer-social">
            <a href={site.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
            <a href={site.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"><TikTok /></a>
          </div>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} {site.brandName}. {site.tagline}.</span>
        <span>Made with ♡ for our community.</span>
      </div>
    </footer>
  );
}
