"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "safari:wishlist";
const CHANGE_EVENT = "safari:wishlist-change";

export function readWishlist(): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as number[];
  } catch {
    return [];
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

/** Reactive `is id in wishlist` — driven by an external store (localStorage). */
export function useWishlist(id: number): boolean {
  return useSyncExternalStore(
    subscribe,
    () => readWishlist().includes(id),
    () => false
  );
}

/** Toggle an id in the wishlist and notify every listener. */
export function toggleWishlist(id: number): void {
  const set = new Set(readWishlist());
  if (set.has(id)) set.delete(id);
  else set.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
