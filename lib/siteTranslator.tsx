"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export type SiteLanguageCode =
  | "ru"
  | "it"
  | "en"
  | "zh-CN"
  | "pt"
  | "es"
  | "de"
  | "fr"
  | "be"
  | "kk"
  | "uz"
  | "ky"
  | "tg"
  | "hy"
  | "az"
  | "tk"
  | "ar"
  | "fa";

export type SiteLanguage = {
  code: SiteLanguageCode;
  label: string;
  flagSrc: string;
  group: "main" | "cis" | "east";
  dir?: "rtl";
};

export const siteLanguages: SiteLanguage[] = [
  { code: "ru", label: "Русский", flagSrc: "/flags/ru.svg", group: "main" },
  { code: "it", label: "Italiano", flagSrc: "/flags/it.svg", group: "main" },
  { code: "en", label: "English", flagSrc: "/flags/gb.svg", group: "main" },
  { code: "zh-CN", label: "中文", flagSrc: "/flags/cn.svg", group: "main" },
  { code: "pt", label: "Português", flagSrc: "/flags/pt.svg", group: "main" },
  { code: "es", label: "Español", flagSrc: "/flags/es.svg", group: "main" },
  { code: "de", label: "Deutsch", flagSrc: "/flags/de.svg", group: "main" },
  { code: "fr", label: "Français", flagSrc: "/flags/fr.svg", group: "main" },
  { code: "be", label: "Беларуская", flagSrc: "/flags/by.svg", group: "cis" },
  { code: "kk", label: "Қазақша", flagSrc: "/flags/kz.svg", group: "cis" },
  { code: "uz", label: "O‘zbekcha", flagSrc: "/flags/uz.svg", group: "cis" },
  { code: "ky", label: "Кыргызча", flagSrc: "/flags/kg.svg", group: "cis" },
  { code: "tg", label: "Тоҷикӣ", flagSrc: "/flags/tj.svg", group: "cis" },
  { code: "hy", label: "Հայերեն", flagSrc: "/flags/am.svg", group: "cis" },
  { code: "az", label: "Azərbaycan", flagSrc: "/flags/az.svg", group: "cis" },
  { code: "tk", label: "Türkmençe", flagSrc: "/flags/tm.svg", group: "cis" },
  { code: "ar", label: "العربية", flagSrc: "/flags/sa.svg", group: "east", dir: "rtl" },
  { code: "fa", label: "فارسی", flagSrc: "/flags/ir.svg", group: "east", dir: "rtl" },
];

type TranslatorContextValue = {
  language: SiteLanguage;
  setLanguage: (code: SiteLanguageCode) => void;
  ready: boolean;
};

const TranslatorContext = createContext<TranslatorContextValue | null>(null);

const STORAGE_KEY = "matfak-site-language";
const SOURCE_LANGUAGE = "ru";
const GOOGLE_SCRIPT_ID = "matfak-google-translate-script";
const GOOGLE_ELEMENT_ID = "matfak-google-translate-element";

function findLanguage(code: string | null | undefined) {
  return siteLanguages.find((item) => item.code === code) ?? siteLanguages[0];
}

function cookieDomain() {
  if (typeof window === "undefined") return null;
  const host = window.location.hostname;
  if (!host || host === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(host)) return null;
  return `.${host}`;
}

function setTranslateCookie(target: SiteLanguageCode) {
  if (typeof document === "undefined") return;

  const domain = cookieDomain();
  const base = "path=/;SameSite=Lax";

  if (target === SOURCE_LANGUAGE) {
    document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;${base}`;
    if (domain) {
      document.cookie = `googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;domain=${domain};${base}`;
    }
    return;
  }

  const value = `/${SOURCE_LANGUAGE}/${target}`;
  document.cookie = `googtrans=${value};${base}`;
  if (domain) document.cookie = `googtrans=${value};domain=${domain};${base}`;
}

function findGoogleCombo() {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLSelectElement>("select.goog-te-combo");
}

function applyGoogleLanguage(target: SiteLanguageCode) {
  if (target === SOURCE_LANGUAGE) return false;
  const combo = findGoogleCombo();
  if (!combo) return false;

  combo.value = target;
  combo.dispatchEvent(new Event("change", { bubbles: true }));
  return true;
}

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (
          options: {
            pageLanguage: string;
            includedLanguages: string;
            autoDisplay: boolean;
            multilanguagePage?: boolean;
          },
          elementId: string,
        ) => unknown;
      };
    };
    matfakGoogleTranslateInit?: () => void;
  }
}

export function SiteTranslatorProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [language, setLanguageState] = useState<SiteLanguage>(siteLanguages[0]);
  const [ready, setReady] = useState(false);
  const initialized = useRef(false);
  const languageRef = useRef(language);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  const applyWithRetry = useCallback((code: SiteLanguageCode) => {
    if (code === SOURCE_LANGUAGE) return;

    let attempt = 0;
    const run = () => {
      attempt += 1;
      if (applyGoogleLanguage(code)) return;
      if (attempt < 30) window.setTimeout(run, 180);
    };
    run();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = findLanguage(saved);
    setLanguageState(initial);
    languageRef.current = initial;
    setTranslateCookie(initial.code);

    window.matfakGoogleTranslateInit = () => {
      if (initialized.current) return;
      const TranslateElement = window.google?.translate?.TranslateElement;
      if (!TranslateElement) return;

      initialized.current = true;
      new TranslateElement(
        {
          pageLanguage: SOURCE_LANGUAGE,
          includedLanguages: siteLanguages
            .filter((item) => item.code !== SOURCE_LANGUAGE)
            .map((item) => item.code)
            .join(","),
          autoDisplay: false,
          multilanguagePage: true,
        },
        GOOGLE_ELEMENT_ID,
      );

      setReady(true);
      applyWithRetry(languageRef.current.code);
    };

    if (window.google?.translate?.TranslateElement) {
      window.matfakGoogleTranslateInit();
    } else if (!document.getElementById(GOOGLE_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = GOOGLE_SCRIPT_ID;
      script.src = "https://translate.google.com/translate_a/element.js?cb=matfakGoogleTranslateInit";
      script.async = true;
      script.onerror = () => setReady(false);
      document.head.appendChild(script);
    }

    return () => {
      // callback intentionally remains on window: Google may call it after a slow network response
    };
  }, [applyWithRetry]);

  useEffect(() => {
    document.documentElement.lang = language.code === "zh-CN" ? "zh" : language.code;
    document.documentElement.dir = language.dir === "rtl" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    if (language.code === SOURCE_LANGUAGE) return;
    const first = window.setTimeout(() => applyGoogleLanguage(language.code), 280);
    const second = window.setTimeout(() => applyGoogleLanguage(language.code), 900);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(second);
    };
  }, [pathname, language.code]);

  const setLanguage = useCallback(
    (code: SiteLanguageCode) => {
      const next = findLanguage(code);
      localStorage.setItem(STORAGE_KEY, next.code);
      setLanguageState(next);
      languageRef.current = next;
      setTranslateCookie(next.code);

      if (next.code === SOURCE_LANGUAGE) {
        // Google Translate does not reliably restore an already translated React tree.
        // A clean reload returns the original Russian markup without visual artifacts.
        window.location.reload();
        return;
      }

      applyWithRetry(next.code);
    },
    [applyWithRetry],
  );

  const value = useMemo(() => ({ language, setLanguage, ready }), [language, setLanguage, ready]);

  return (
    <TranslatorContext.Provider value={value}>
      {children}
      <div id={GOOGLE_ELEMENT_ID} className="matfak-google-translate-host notranslate" translate="no" />
      <style>{`
        .matfak-google-translate-host,
        .goog-te-banner-frame.skiptranslate,
        .goog-te-balloon-frame,
        #goog-gt-tt,
        .goog-te-spinner-pos,
        .goog-te-gadget {
          display: none !important;
        }

        html, body {
          top: 0 !important;
        }

        body > .skiptranslate {
          display: none !important;
        }

        .goog-text-highlight {
          background: transparent !important;
          box-shadow: none !important;
        }
      `}</style>
    </TranslatorContext.Provider>
  );
}

export function useSiteTranslator() {
  const value = useContext(TranslatorContext);
  if (!value) throw new Error("useSiteTranslator must be used inside SiteTranslatorProvider");
  return value;
}
