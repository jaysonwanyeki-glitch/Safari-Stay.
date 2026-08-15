"use client";

import { useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n";

const STORAGE_KEY = "safari:locale";
const CHANGE_EVENT = "safari:locale-change";

export function readLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    return localStorage.getItem(STORAGE_KEY) === "sw" ? "sw" : "en";
  } catch {
    return "en";
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Reactive current locale (en | sw) — driven by an external store (localStorage). */
export function useLocale(): Locale {
  return useSyncExternalStore(subscribe, readLocale, () => "en" as Locale);
}

/** Switch the site language and notify every listener. */
export function setLocale(locale: Locale): void {
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* private mode — in-memory only */
  }
  if (typeof document !== "undefined") {
    document.documentElement.lang = locale;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
