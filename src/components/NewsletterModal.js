import React, { useEffect, useRef, useState } from "react";
import { Check, Mail, Send, X } from "lucide-react";
import { useContent } from "../context/ContentContext";

const STORAGE_KEY = "mochi-heaven-newsletter-prompt-seen";

export default function NewsletterModal() {
  const { content } = useContent();
  const newsletter = content?.site?.newsletter || {};
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: "", email: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const firstInput = useRef(null);

  useEffect(() => {
    let hasSeenPrompt = false;
    try {
      hasSeenPrompt = window.localStorage.getItem(STORAGE_KEY) === "true";
    } catch (err) {
      // The prompt can still work when storage is unavailable.
    }

    if (hasSeenPrompt) return undefined;
    const timer = window.setTimeout(() => setOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstInput.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const rememberPrompt = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "true");
    } catch (err) {
      // Closing the modal should never fail because storage is unavailable.
    }
  };

  const close = () => {
    rememberPrompt();
    setOpen(false);
  };

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    const firstName = form.firstName.trim();
    const email = form.email.trim();

    if (!firstName) {
      setError("Please enter your first name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const actionUrl = (newsletter.actionUrl || "").trim();
    if (!actionUrl) {
      setError("Newsletter signup is being set up. Please try again soon.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(actionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ firstName, email }),
      });
      if (!response.ok) throw new Error("Signup request failed");
      rememberPrompt();
      setDone(true);
      window.setTimeout(() => setOpen(false), 2200);
    } catch (err) {
      setError("We couldn't complete your signup. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="newsletter-modal" role="dialog" aria-modal="true" aria-labelledby="newsletter-modal-title">
      <button className="newsletter-modal-bg" type="button" onClick={close} aria-label="Close newsletter signup" />
      <div className="newsletter-modal-card">
        <button className="newsletter-modal-close" type="button" onClick={close} aria-label="Close">
          <X size={21} />
        </button>
        <div className="newsletter-modal-icon"><Mail size={28} /></div>
        <p className="eyebrow">A LITTLE SWEETNESS IN YOUR INBOX</p>
        <h2 id="newsletter-modal-title">Join our newsletter</h2>
        <p className="newsletter-modal-copy">
          Be first to hear about new flavors, special offers, and all things Mochi Heaven.
        </p>

        {done ? (
          <div className="newsletter-modal-success" role="status">
            <Check size={22} />
            <span>{newsletter.successMessage || "You're on the list! Welcome to Mochi Heaven."}</span>
          </div>
        ) : (
          <form className="newsletter-modal-form" onSubmit={submit} noValidate>
            <label>
              <span>First name</span>
              <input ref={firstInput} name="firstName" value={form.firstName} onChange={update} autoComplete="given-name" required />
            </label>
            <label>
              <span>Email address</span>
              <input name="email" type="email" value={form.email} onChange={update} autoComplete="email" placeholder="you@email.com" required />
            </label>
            {error && <p className="newsletter-modal-error" role="alert">{error}</p>}
            <button className="order-pill newsletter-modal-submit" type="submit" disabled={submitting}>
              {submitting ? "Joining..." : (newsletter.buttonText || "Join the list")} <Send size={16} />
            </button>
          </form>
        )}
        {!done && <button className="newsletter-modal-later" type="button" onClick={close}>No thanks, maybe later</button>}
      </div>
    </div>
  );
}
