import React from "react";
import { MapPin, Clock, Phone, Globe } from "lucide-react";
import { useContent } from "../context/ContentContext";
import Reveal from "../components/Reveal";
import { useOrder } from "../App";

export default function Visit() {
  const { content } = useContent();
  const { openOrder } = useOrder();
  const v = content.site.visit;

  const details = [
    { icon: MapPin, label: "ADDRESS", value: v.address },
    { icon: Clock, label: "HOURS", value: v.hours },
    { icon: Phone, label: "PHONE", value: v.phone },
    { icon: Globe, label: "WEBSITE", value: v.website },
  ];

  return (
    <main className="simple-page">
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow">{v.eyebrow}</p>
          <h1 className="page-title">{v.title}</h1>
          <p className="page-subtitle">We can’t wait to serve you something sweet.</p>
        </div>
      </section>

      <section className="visit-section">
        <div className="shell visit-layout">
          <Reveal>
            <div className="visit-grid" data-testid="visit-details">
              {details.map((d, i) => {
                const Icon = d.icon;
                return (
                  <div className="visit-detail" key={i}>
                    <small><Icon size={14} /> {d.label}</small>
                    <strong>{d.value}</strong>
                  </div>
                );
              })}
            </div>
            <button className="order-pill big" onClick={openOrder} data-testid="visit-order-btn">Order Online</button>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="map-box" data-testid="visit-map">
              {v.mapEmbed ? (
                <iframe title="Store location" src={v.mapEmbed} loading="lazy" />
              ) : (
                <span>ADD MAP EMBED OR STORE PHOTO</span>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
