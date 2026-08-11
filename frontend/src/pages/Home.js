import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, Sparkles, Leaf, Heart, Smile, ArrowRight } from "lucide-react";
import { useContent } from "../context/ContentContext";
import Reveal from "../components/Reveal";
import Newsletter from "../components/Newsletter";

const FEATURE_ICONS = { sparkles: Sparkles, leaf: Leaf, heart: Heart, smile: Smile };
const PUB = process.env.PUBLIC_URL || "";

function Sparkle({ className, size = 20, delay = 0 }) {
  return (
    <motion.span
      className={`spark ${className}`}
      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.15, 0.8], rotate: [0, 25, 0] }}
      transition={{ duration: 3.4, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <Sparkles size={size} />
    </motion.span>
  );
}

export default function Home() {
  const { content } = useContent();
  const site = content.site;
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const shown = content.categories.filter((c) => filter === "all" || c.id === filter);
  const about = site.about;

  return (
    <main>
      {/* HERO */}
      <section className="hero" id="home">
        <div className="shell hero-inner">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">{site.hero.eyebrow}</p>
            <h1 data-testid="hero-title">
              {site.hero.titleLine1}
              <br />
              {site.hero.titleLine2}
            </h1>
            <div className="tiny-rule"><Heart size={16} fill="currentColor" /></div>
            <p className="lead">{site.hero.lead}</p>

            <Link className="visit-pill" to="/visit" data-testid="hero-visit-btn">
              <MapPin size={18} /> <span>VISIT US</span>
            </Link>

            <div className="favorite-box" data-testid="favorite-box">
              <span>★ CUSTOMER FAVORITE</span>
              <strong>{site.customerFavorite} <ArrowUpRight size={18} /></strong>
            </div>
          </motion.div>

          <motion.div
            className="hero-image-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.1, ease: "easeOut" }}
          >
            <img
              src={`${PUB}/assets/hero-products.png`}
              alt="Mochi Heaven featured products"
              data-testid="hero-image"
            />
          </motion.div>
        </div>
      </section>

      {/* MENU */}
      <section className="menu-area" id="menu">
        <div className="shell">
          <Reveal className="menu-heading">
            <p className="eyebrow">OUR MENU</p>
            <h2>What are you craving?</h2>
            <p>Click a category to filter the menu.</p>
          </Reveal>

          <div className="filters" data-testid="filter-bar">
            <button
              className={`filter ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
              data-testid="filter-all"
            >
              <span className="fe">🍩</span> <span>All</span>
            </button>
            {content.categories.map((c) => (
              <button
                key={c.id}
                className={`filter ${filter === c.id ? "active" : ""}`}
                onClick={() => setFilter(c.id)}
                data-testid={`filter-${c.id}`}
              >
                <span className="fe">{c.emoji}</span>
                <span>{c.cardTitle.replace("KOREAN ", "").split(" ").map((w) => w[0] + w.slice(1).toLowerCase()).join(" ")}</span>
              </button>
            ))}
          </div>

          <motion.div layout className="cards" data-testid="category-cards">
            {shown.map((c, i) => (
              <motion.article
                layout
                key={c.id}
                className="menu-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                data-testid={`category-card-${c.id}`}
              >
                <h3><span className="fe">{c.emoji}</span> {c.cardTitle}</h3>
                <div className="image-box">
                  <img src={c.image?.startsWith("/assets") ? PUB + c.image : c.image} alt={c.cardTitle} />
                </div>
                <p>{c.tagline}</p>
                <button
                  className="view-btn"
                  onClick={() => navigate(`/menu#${c.id}`)}
                  data-testid={`view-${c.id}`}
                >
                  VIEW {c.name.replace("KOREAN ", "")} <ArrowRight size={15} />
                </button>
              </motion.article>
            ))}
          </motion.div>

          <Reveal className="feature-strip" delay={0.1}>
            {site.features.map((f, i) => {
              const Icon = FEATURE_ICONS[f.icon] || Sparkles;
              return (
                <div key={i}>
                  <span className="feature-icon"><Icon size={30} /></span>
                  <span>
                    <strong>{f.title}</strong>
                    <small>{f.text}</small>
                  </span>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* ABOUT US */}
      <section className="about-home" id="about-us" data-testid="about-home-section">
        <div className="shell about-home-grid">
          <Reveal className="about-home-photo" data-testid="about-home-photo">
            {about.photo ? (
              <img src={about.photo.startsWith("/assets") ? PUB + about.photo : about.photo} alt="Mochi Heaven" />
            ) : (
              <span>ADD STORE OR TEAM PHOTO</span>
            )}
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">{about.eyebrow}</p>
            <h2>{about.title}</h2>
            <p className="about-home-body">{about.body}</p>
            <Link className="visit-pill" to="/about" data-testid="about-home-readmore">
              <span>Read our story</span> <ArrowRight size={17} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* NEWSLETTER */}
      <Newsletter />
    </main>
  );
}
