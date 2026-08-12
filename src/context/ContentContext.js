import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import defaultContent from "../content.default.json";

const ContentContext = createContext(null);

const LS_KEY = "mochi_content_v1";
const LS_PW_KEY = "mochi_admin_pw_v1";
export const DEFAULT_ADMIN_PASSWORD = "mochiheaven";

// Deep-merge published/stored content over defaults so new fields never break the UI.
function mergeDefaults(base, override) {
  if (Array.isArray(base)) return override !== undefined ? override : base;
  if (base && typeof base === "object") {
    const out = { ...base };
    const src = override && typeof override === "object" ? override : {};
    Object.keys({ ...base, ...src }).forEach((k) => {
      out[k] = mergeDefaults(base[k], src[k]);
    });
    return out;
  }
  return override !== undefined ? override : base;
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(() => mergeDefaults(defaultContent, {}));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // 1) Local unpublished edits (admin preview in this browser)
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
          setContent(mergeDefaults(defaultContent, JSON.parse(raw)));
          setLoaded(true);
          return;
        }
      } catch (e) {}
      // 2) Shared live content from Vercel Blob
      try {
        const res = await fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setContent(mergeDefaults(defaultContent, data));
        }
      } catch (e) {}
      if (!cancelled) setLoaded(true);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const saveLocal = (next) => {
    setContent(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch (e) {}
  };

  const clearLocal = async () => {
    try {
      localStorage.removeItem(LS_KEY);
    } catch (e) {}
    try {
      const res = await fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" });
      const data = res.ok ? await res.json() : {};
      setContent(mergeDefaults(defaultContent, data));
    } catch (e) {
      setContent(mergeDefaults(defaultContent, {}));
    }
  };

  const hasLocalEdits = () => {
    try {
      return !!localStorage.getItem(LS_KEY);
    } catch (e) {
      return false;
    }
  };

  const value = useMemo(
    () => ({ content, loaded, saveLocal, clearLocal, hasLocalEdits }),
    [content, loaded]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}

export function getAdminPassword() {
  try {
    return localStorage.getItem(LS_PW_KEY) || DEFAULT_ADMIN_PASSWORD;
  } catch (e) {
    return DEFAULT_ADMIN_PASSWORD;
  }
}

export function setAdminPassword(pw) {
  try {
    localStorage.setItem(LS_PW_KEY, pw);
  } catch (e) {}
}
