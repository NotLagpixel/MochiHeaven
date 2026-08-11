import React from "react";
import { Sparkles, Leaf, Heart, Smile } from "lucide-react";
import { useContent } from "../context/ContentContext";
import Reveal from "../components/Reveal";

const FEATURE_ICONS = { sparkles: Sparkles, leaf: Leaf, heart: Heart, smile: Smile };
const PUB = process.env.PUBLIC_URL || "";

export default function About() {
  const { content } = useContent();
  const about = content.site.about;
  const features = content.site.features;

  return (
    <main className="simple-page">
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow">{about.eyebrow}</p>
          <h1 className="page-title">{about.title}</h1>
        </div>
      </section>

      <section className="about-section">
        <div className="shell about-grid">
          <Reveal>
            <p className="about-copy" data-testid="about-body">{about.body}</p>
            <div className="about-features">
              {features.map((f, i) => {
                const Icon = FEATURE_ICONS[f.icon] || Sparkles;
                return (
                  <div key={i} className="about-feature">
                    <Icon size={22} />
                    <div>
                      <strong>{f.title}</strong>
                      <small>{f.text}</small>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="about-photo" data-testid="about-photo">
              {about.photo ? (
                <img src={about.photo.startsWith("/assets") ? PUB + about.photo : about.photo} alt="Mochi Heaven" />
              ) : (
                <span>ADD STORE OR TEAM PHOTO</span>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
