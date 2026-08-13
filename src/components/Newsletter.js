import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check, Send } from "lucide-react";
import { useContent } from "../context/ContentContext";

export default function Newsletter() {
  const { content } = useContent();
  const n = content.site.newsletter || {};
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const cleanFirstName = firstName.trim();
    if (!cleanFirstName) {
      setError("Please enter your first name.");
      return;
    }
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    const url = (n.actionUrl || "").trim();
    if (url) {
      try {
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ firstName: cleanFirstName, email: email.trim() }),
        });
      } catch (err) {
        /* form services may block CORS; treat as fire-and-forget */
      }
    }
    setDone(true);
    setFirstName("");
    setEmail("");
  };

  return (
    <section className="newsletter" id="newsletter" data-testid="newsletter-section">
      <div className="shell">
        <motion.div
          className="newsletter-card"
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="newsletter-icon"><Mail size={26} /></div>
          <p className="eyebrow">{n.eyebrow}</p>
          <h2>{n.title}</h2>
          <p className="newsletter-sub">{n.subtitle}</p>

          {done ? (
            <div className="newsletter-success" data-testid="newsletter-success">
              <Check size={20} /> {n.successMessage}
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={submit}>
              <input
                type="text"
                className="newsletter-input"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                aria-label="First name"
                data-testid="newsletter-first-name"
              />
              <input
                type="email"
                className="newsletter-input"
                placeholder={n.placeholder || "you@email.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                aria-label="Email address"
                data-testid="newsletter-email"
              />
              <button className="order-pill" type="submit" data-testid="newsletter-submit">
                {n.buttonText || "Subscribe"} <Send size={15} />
              </button>
            </form>
          )}
          {error && <span className="newsletter-error" data-testid="newsletter-error">{error}</span>}
        </motion.div>
      </div>
    </section>
  );
}
