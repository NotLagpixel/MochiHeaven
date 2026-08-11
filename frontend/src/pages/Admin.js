import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Lock, Save, Download, Upload, RotateCcw, KeyRound, Plus, Trash2,
  ExternalLink, Image as ImageIcon, Eye, LogOut, Check,
} from "lucide-react";
import {
  useContent, getAdminPassword, setAdminPassword, DEFAULT_ADMIN_PASSWORD,
} from "../context/ContentContext";

const SS_KEY = "mochi_admin_unlocked";

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ImageField({ value, onChange, label = "Image" }) {
  const ref = useRef();
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (file) onChange(await readFileAsDataURL(file));
  };
  const preview = value?.startsWith("/assets") ? (process.env.PUBLIC_URL || "") + value : value;
  return (
    <div className="img-field">
      <div className="img-preview">
        {value ? <img src={preview} alt="preview" /> : <ImageIcon size={22} />}
      </div>
      <div className="img-actions">
        <button className="btn-ghost sm" onClick={() => ref.current?.click()} type="button">
          <Upload size={14} /> Upload
        </button>
        {value && (
          <button className="btn-ghost sm danger" onClick={() => onChange("")} type="button">
            <Trash2 size={14} /> Remove
          </button>
        )}
        <input ref={ref} type="file" accept="image/*" hidden onChange={handleFile} />
        <input
          className="field mono"
          placeholder="or paste image URL"
          value={value && !value.startsWith("data:") ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

export default function Admin() {
  const { content, saveLocal, clearLocal } = useContent();
  const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SS_KEY) === "1");
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState("");
  const [draft, setDraft] = useState(null);
  const [tab, setTab] = useState("site");
  const [toast, setToast] = useState("");
  const importRef = useRef();

  useEffect(() => {
    if (content) setDraft(JSON.parse(JSON.stringify(content)));
  }, [content]);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const tryUnlock = (e) => {
    e.preventDefault();
    if (pwInput === getAdminPassword()) {
      sessionStorage.setItem(SS_KEY, "1");
      setUnlocked(true);
      setPwError("");
    } else {
      setPwError("Incorrect password. Try again.");
    }
  };

  const lock = () => {
    sessionStorage.removeItem(SS_KEY);
    setUnlocked(false);
    setPwInput("");
  };

  if (!unlocked) {
    return (
      <div className="admin-gate" data-testid="admin-gate">
        <form className="gate-card" onSubmit={tryUnlock}>
          <div className="gate-lock"><Lock size={30} /></div>
          <h1>Private Admin</h1>
          <p>Enter your password to edit the Mochi Heaven website.</p>
          <input
            type="password"
            className="field"
            placeholder="Password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            autoFocus
            data-testid="admin-password-input"
          />
          {pwError && <span className="gate-error" data-testid="admin-password-error">{pwError}</span>}
          <button className="order-pill big" type="submit" data-testid="admin-login-btn">Unlock</button>
          <small className="gate-hint">Default password: <code>{DEFAULT_ADMIN_PASSWORD}</code> — change it after first login.</small>
        </form>
      </div>
    );
  }

  if (!draft) return null;

  // ---- helpers to mutate draft immutably ----
  const setSite = (patch) => setDraft((d) => ({ ...d, site: { ...d.site, ...patch } }));
  const setNested = (section, patch) =>
    setDraft((d) => ({ ...d, site: { ...d.site, [section]: { ...d.site[section], ...patch } } }));
  const setFeature = (i, patch) =>
    setDraft((d) => {
      const features = d.site.features.map((f, idx) => (idx === i ? { ...f, ...patch } : f));
      return { ...d, site: { ...d.site, features } };
    });
  const setCat = (ci, patch) =>
    setDraft((d) => {
      const categories = d.categories.map((c, idx) => (idx === ci ? { ...c, ...patch } : c));
      return { ...d, categories };
    });
  const setItem = (ci, ii, patch) =>
    setDraft((d) => {
      const categories = d.categories.map((c, idx) => {
        if (idx !== ci) return c;
        const items = c.items.map((it, j) => (j === ii ? { ...it, ...patch } : it));
        return { ...c, items };
      });
      return { ...d, categories };
    });
  const addItem = (ci) =>
    setDraft((d) => {
      const categories = d.categories.map((c, idx) =>
        idx === ci ? { ...c, items: [...c.items, { name: "New Item", desc: "", price: "$0.00", image: "" }] } : c
      );
      return { ...d, categories };
    });
  const removeItem = (ci, ii) =>
    setDraft((d) => {
      const categories = d.categories.map((c, idx) =>
        idx === ci ? { ...c, items: c.items.filter((_, j) => j !== ii) } : c
      );
      return { ...d, categories };
    });

  const save = () => {
    saveLocal(draft);
    flash("Saved! Changes are live in this browser preview.");
  };

  const publish = () => {
    saveLocal(draft);
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.json";
    a.click();
    URL.revokeObjectURL(url);
    flash("Downloaded content.json — replace it in the repo & redeploy to publish.");
  };

  const doImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      setDraft(data);
      saveLocal(data);
      flash("Imported content.json.");
    } catch {
      flash("That file could not be read as valid content.json.");
    }
    e.target.value = "";
  };

  const resetPublished = async () => {
    if (!window.confirm("Discard local edits and reload the published content?")) return;
    await clearLocal();
    flash("Reset to published content.");
  };

  const changePw = () => {
    const np = window.prompt("Enter a new admin password:");
    if (np && np.trim()) {
      setAdminPassword(np.trim());
      flash("Password updated.");
    }
  };

  return (
    <div className="admin" data-testid="admin-panel">
      <header className="admin-bar">
        <div className="admin-brand">
          <img src={`${process.env.PUBLIC_URL || ""}/assets/logo.png`} alt="Mochi Heaven" />
          <span className="admin-tag">Admin</span>
        </div>
        <div className="admin-actions">
          <Link className="btn-ghost" to="/" target="_blank"><Eye size={15} /> View site</Link>
          <button className="btn-ghost" onClick={() => importRef.current?.click()}><Upload size={15} /> Import</button>
          <input ref={importRef} type="file" accept="application/json" hidden onChange={doImport} />
          <button className="btn-ghost" onClick={resetPublished}><RotateCcw size={15} /> Reset</button>
          <button className="btn-ghost" onClick={changePw}><KeyRound size={15} /> Password</button>
          <button className="btn-ghost" onClick={lock}><LogOut size={15} /> Lock</button>
          <button className="btn-solid" onClick={save} data-testid="admin-save-btn"><Save size={15} /> Save</button>
          <button className="btn-solid pub" onClick={publish} data-testid="admin-publish-btn"><Download size={15} /> Publish</button>
        </div>
      </header>

      <div className="admin-note">
        <strong>How publishing works:</strong> “Save” updates your live preview in this browser.
        To make changes visible to <em>everyone</em>, click <strong>Publish</strong> to download
        <code> content.json</code>, replace the file in <code>frontend/public/content.json</code>, and redeploy on Vercel.
      </div>

      <nav className="admin-tabs">
        {["site", "menu"].map((t) => (
          <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)} data-testid={`admin-tab-${t}`}>
            {t === "site" ? "Site Info" : "Menu Items"}
          </button>
        ))}
      </nav>

      <div className="admin-body">
        {tab === "site" && (
          <>
            <section className="admin-block">
              <h3>Order Online link</h3>
              <label className="field-label">External ordering URL (UberEats, DoorDash, your store…)</label>
              <div className="row">
                <input className="field mono" placeholder="https://..." value={draft.site.orderUrl}
                  onChange={(e) => setSite({ orderUrl: e.target.value })} data-testid="admin-order-url" />
                {draft.site.orderUrl && (
                  <a className="btn-ghost sm" href={draft.site.orderUrl} target="_blank" rel="noreferrer"><ExternalLink size={14} /> Test</a>
                )}
              </div>
              <small className="muted">Leave empty to show a friendly “coming soon” popup instead.</small>
            </section>

            <section className="admin-block">
              <h3>Hero</h3>
              <div className="grid2">
                <div><label className="field-label">Eyebrow</label>
                  <input className="field" value={draft.site.hero.eyebrow} onChange={(e) => setNested("hero", { eyebrow: e.target.value })} /></div>
                <div><label className="field-label">Customer favorite</label>
                  <input className="field" value={draft.site.customerFavorite} onChange={(e) => setSite({ customerFavorite: e.target.value })} /></div>
                <div><label className="field-label">Title line 1</label>
                  <input className="field" value={draft.site.hero.titleLine1} onChange={(e) => setNested("hero", { titleLine1: e.target.value })} /></div>
                <div><label className="field-label">Title line 2</label>
                  <input className="field" value={draft.site.hero.titleLine2} onChange={(e) => setNested("hero", { titleLine2: e.target.value })} /></div>
              </div>
              <label className="field-label">Lead paragraph</label>
              <textarea className="field" rows={2} value={draft.site.hero.lead} onChange={(e) => setNested("hero", { lead: e.target.value })} />
            </section>

            <section className="admin-block">
              <h3>Social links</h3>
              <div className="grid2">
                <div><label className="field-label">Instagram URL</label>
                  <input className="field mono" value={draft.site.instagram} onChange={(e) => setSite({ instagram: e.target.value })} /></div>
                <div><label className="field-label">TikTok URL</label>
                  <input className="field mono" value={draft.site.tiktok} onChange={(e) => setSite({ tiktok: e.target.value })} /></div>
              </div>
            </section>

            <section className="admin-block">
              <h3>About page</h3>
              <label className="field-label">Title</label>
              <input className="field" value={draft.site.about.title} onChange={(e) => setNested("about", { title: e.target.value })} />
              <label className="field-label">Story / body</label>
              <textarea className="field" rows={4} value={draft.site.about.body} onChange={(e) => setNested("about", { body: e.target.value })} />
              <label className="field-label">Store / team photo</label>
              <ImageField value={draft.site.about.photo} onChange={(v) => setNested("about", { photo: v })} />
            </section>

            <section className="admin-block">
              <h3>Visit page</h3>
              <div className="grid2">
                <div><label className="field-label">Address</label>
                  <input className="field" value={draft.site.visit.address} onChange={(e) => setNested("visit", { address: e.target.value })} /></div>
                <div><label className="field-label">Hours</label>
                  <input className="field" value={draft.site.visit.hours} onChange={(e) => setNested("visit", { hours: e.target.value })} /></div>
                <div><label className="field-label">Phone</label>
                  <input className="field" value={draft.site.visit.phone} onChange={(e) => setNested("visit", { phone: e.target.value })} /></div>
                <div><label className="field-label">Website</label>
                  <input className="field" value={draft.site.visit.website} onChange={(e) => setNested("visit", { website: e.target.value })} /></div>
              </div>
              <label className="field-label">Google Maps embed URL (optional)</label>
              <input className="field mono" placeholder="https://www.google.com/maps/embed?..." value={draft.site.visit.mapEmbed}
                onChange={(e) => setNested("visit", { mapEmbed: e.target.value })} />
            </section>

            <section className="admin-block">
              <h3>Highlights strip</h3>
              <div className="grid2">
                {draft.site.features.map((f, i) => (
                  <div key={i} className="mini-card">
                    <input className="field" value={f.title} onChange={(e) => setFeature(i, { title: e.target.value })} />
                    <input className="field" value={f.text} onChange={(e) => setFeature(i, { text: e.target.value })} />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {tab === "menu" && (
          <>
            {draft.categories.map((c, ci) => (
              <section className="admin-block" key={c.id} data-testid={`admin-cat-${c.id}`}>
                <div className="cat-head">
                  <input className="field emoji" value={c.emoji} onChange={(e) => setCat(ci, { emoji: e.target.value })} />
                  <input className="field cat-name" value={c.cardTitle} onChange={(e) => setCat(ci, { cardTitle: e.target.value, name: e.target.value })} />
                </div>
                <div className="grid2">
                  <div><label className="field-label">Card tagline</label>
                    <input className="field" value={c.tagline} onChange={(e) => setCat(ci, { tagline: e.target.value })} /></div>
                  <div><label className="field-label">Menu section subtitle</label>
                    <input className="field" value={c.sectionSubtitle} onChange={(e) => setCat(ci, { sectionSubtitle: e.target.value })} /></div>
                </div>
                <label className="field-label">Category banner image</label>
                <ImageField value={c.image} onChange={(v) => setCat(ci, { image: v })} />

                <div className="items-head">
                  <span>Items</span>
                  <button className="btn-ghost sm" onClick={() => addItem(ci)} data-testid={`admin-add-item-${c.id}`}><Plus size={14} /> Add item</button>
                </div>
                <div className="items-list">
                  {c.items.map((it, ii) => (
                    <div className="item-row" key={ii}>
                      <ImageField value={it.image} onChange={(v) => setItem(ci, ii, { image: v })} />
                      <div className="item-fields">
                        <div className="row">
                          <input className="field" placeholder="Name" value={it.name} onChange={(e) => setItem(ci, ii, { name: e.target.value })} />
                          <input className="field price" placeholder="$0.00" value={it.price} onChange={(e) => setItem(ci, ii, { price: e.target.value })} />
                          <button className="icon-btn danger" onClick={() => removeItem(ci, ii)} aria-label="Remove"><Trash2 size={16} /></button>
                        </div>
                        <input className="field" placeholder="Description" value={it.desc} onChange={(e) => setItem(ci, ii, { desc: e.target.value })} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </>
        )}
      </div>

      {toast && (
        <div className="admin-toast" data-testid="admin-toast"><Check size={16} /> {toast}</div>
      )}
    </div>
  );
}
