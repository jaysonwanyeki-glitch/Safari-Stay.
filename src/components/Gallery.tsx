"use client";

import { useCallback, useEffect, useState } from "react";
import SmartImage from "./SmartImage";
import { ChevronLeft, ChevronRight, CloseIcon } from "./icons";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const close = useCallback(() => setOpen(false), []);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, next, prev]);

  const small = images.slice(1, 5);

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl">
        <button
          onClick={() => { setActive(0); setOpen(true); }}
          className="card-zoom relative col-span-2 row-span-2 h-full min-h-[260px] overflow-hidden sm:min-h-[440px]"
        >
          <SmartImage src={images[0]} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        </button>
        {small.map((src, i) => (
          <button
            key={src + i}
            onClick={() => { setActive(i + 1); setOpen(true); }}
            className={`card-zoom relative hidden overflow-hidden sm:block ${i === 3 ? "group" : ""}`}
          >
            <SmartImage src={src} alt={`${title} ${i + 2}`} className="absolute inset-0 h-full w-full object-cover" />
            {i === 3 && images.length > 5 && (
              <span className="absolute inset-0 grid place-items-center bg-black/35 text-sm font-bold text-white opacity-0 transition group-hover:opacity-100">
                +{images.length - 5} more
              </span>
            )}
          </button>
        ))}
        <div className="col-span-4 mt-3 flex justify-center sm:col-span-4 sm:mt-0 sm:block sm:justify-end">
          <button
            onClick={() => { setActive(0); setOpen(true); }}
            className="rounded-xl border border-slate-800 px-4 py-2 text-sm font-bold shadow-sm hover:bg-slate-800 hover:text-white"
          >
            📷 Show all photos
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-black/95 px-4 py-4">
          <div className="flex items-center justify-between text-white">
            <span className="text-sm font-semibold">
              {active + 1} / {images.length}
            </span>
            <button onClick={close} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10">
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center">
            <button onClick={prev} className="absolute left-0 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-black shadow hover:bg-white">
              <ChevronLeft className="h-6 w-6" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[active]}
              alt={`${title} ${active + 1}`}
              className="max-h-[78vh] max-w-full rounded-2xl object-contain"
            />
            <button onClick={next} className="absolute right-0 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-black shadow hover:bg-white">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          <p className="py-2 text-center text-sm text-white/80">{title}</p>
        </div>
      )}
    </>
  );
}
