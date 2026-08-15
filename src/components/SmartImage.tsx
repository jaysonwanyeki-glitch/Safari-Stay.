"use client";

import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  /** Optional gradient fallback shown while loading or if the image errors. */
  fallbackClassName?: string;
};

/**
 * Lightweight <img> wrapper with graceful fallback. We use a plain <img> so we
 * can load arbitrary remote photography without per-domain next/image config.
 */
export default function SmartImage({
  src,
  alt,
  className,
  loading = "lazy",
  fallbackClassName = "bg-gradient-to-br from-amber-100 via-rose-100 to-emerald-100",
}: Props) {
  const [errored, setErrored] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  // Reset image state when the src changes (React-recommended pattern for
  // adjusting state when a prop changes — setState during render is allowed).
  if (src !== prevSrc) {
    setPrevSrc(src);
    setErrored(false);
    setLoaded(false);
  }

  if (errored) {
    return <div role="img" aria-label={alt} className={`${fallbackClassName} ${className ?? ""}`} />;
  }

  return (
    <>
      {!loaded && <div aria-hidden className={`${fallbackClassName} ${className ?? ""}`} />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`${className ?? ""} ${loaded ? "opacity-100" : "absolute opacity-0"} transition-opacity duration-500`}
      />
    </>
  );
}
