import React, { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useContent } from "../context/ContentContext";
import Reveal from "../components/Reveal";
import { useOrder } from "../App";

const PUB = process.env.PUBLIC_URL || "";

function ItemImage({ item }) {
  if (item.image) {
    const src = item.image.startsWith("/assets") ? PUB + item.image : item.image;
    return <img src={src} alt={item.name} />;
  }
  return <div className="item-placeholder">ADD PHOTO</div>;
}

export default function MenuPage() {
  const { content } = useContent();
  const { openOrder } = useOrder();
  const [active, setActive] = useState("all");

  const cats = content.categories;
  const jump = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main id="top" className="menu-page">
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow">MOCHI HEAVEN</p>
          <h1 className="page-title">Our Menu</h1>
          <p className="page-subtitle">Choose a category or scroll through everything.</p>
          <nav className="jump-nav" data-testid="menu-jump-nav">
            {cats.map((c) => (
              <button key={c.id} onClick={() => jump(c.id)} data-testid={`jump-${c.id}`}>
                <span className="fe">{c.emoji}</span> {c.cardTitle}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {cats.map((c, idx) => (
        <section
          key={c.id}
          id={c.id}
          className={`category-section ${idx % 2 ? "tint" : ""}`}
          data-testid={`menu-section-${c.id}`}
        >
          <div className="shell">
            <div className="category-heading">
              <div>
                <p className="eyebrow"><span className="fe">{c.emoji}</span> {c.cardTitle}</p>
                <h2>{c.sectionSubtitle}</h2>
              </div>
              <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                Back to top <ArrowUp size={14} />
              </button>
            </div>
            <div className="category-banner">
              {c.image ? (
                <img src={c.image.startsWith("/assets") ? PUB + c.image : c.image} alt={c.cardTitle} />
              ) : (
                <span>ADD CATEGORY PHOTO</span>
              )}
            </div>
            <div className="product-grid">
              {c.items.map((item, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <article className="product-card" data-testid={`product-${c.id}-${i}`}>
                    <div className={`product-media ${c.id}`}>
                      <ItemImage item={item} />
                    </div>
                    <h3>{item.name}</h3>
                    <p>{item.desc}</p>
                    <strong>{item.price}</strong>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="menu-cta">
        <div className="shell">
          <h2>Hungry yet?</h2>
          <p>Come visit us or order online for pickup.</p>
          <button className="order-pill big" onClick={openOrder} data-testid="menu-order-btn">Order Online</button>
        </div>
      </section>
    </main>
  );
}
