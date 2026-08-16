"use client";

import { useState } from "react";

const CATEGORIES = [
  "Safety or security concern",
  "Property not as described",
  "Cleanliness or maintenance",
  "Payment or refund issue",
  "Harassment or discrimination",
  "Something else",
];

function caseRef() {
  return `RC-${Math.floor(10000 + Math.random() * 89999)}`;
}

/** Demo report form — validates locally and shows a confirmation. No data is sent. */
export default function ReportForm() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [ref, setRef] = useState("");
  const [contact, setContact] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (details.trim().length < 20) {
      setError("Please describe the issue in a little more detail (at least 20 characters).");
      return;
    }
    if (contact.trim().length < 5) {
      setError("Add a phone number or email so we can follow up with you.");
      return;
    }
    setError("");
    setDone(caseRef());
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="text-4xl">✅</div>
        <h3 className="font-display mt-3 text-xl font-bold text-ink">Concern received</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-sand-700">
          Your reference is <span className="font-mono font-bold">{done}</span>. Our team reviews every report within 24 hours and
          follows up on the contact you provided. You can keep this reference to track your case.
        </p>
        <button
          onClick={() => {
            setDone(null);
            setDetails("");
            setRef("");
            setContact("");
          }}
          className="mt-5 rounded-full border border-ink px-5 py-2 text-sm font-bold hover:bg-ink hover:text-white"
        >
          Report another concern
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-3xl border border-sand-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div>
        <label htmlFor="report-category" className="mb-1.5 block text-sm font-semibold text-ink">
          What would you like to report?
        </label>
        <select
          id="report-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border border-sand-300 px-4 py-3 text-sm outline-none transition focus:border-brand"
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">
            Booking reference or listing (optional)
          </span>
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="e.g. SS-00012"
            className="w-full rounded-xl border border-sand-300 px-4 py-3 text-sm outline-none transition focus:border-brand"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">Phone or email</span>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="+254 7XX XXX XXX"
            className="w-full rounded-xl border border-sand-300 px-4 py-3 text-sm outline-none transition focus:border-brand"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">What happened?</span>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows={5}
          placeholder="Tell us the details — dates, the stay, and what went wrong. The more context, the faster we can help."
          className="w-full resize-y rounded-xl border border-sand-300 px-4 py-3 text-sm outline-none transition focus:border-brand"
        />
      </label>

      {error && (
        <p className="rounded-xl bg-ember-50 px-4 py-3 text-sm font-semibold text-brand">{error}</p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-sand-600">
          🔒 Demo form — nothing is sent. Reports are reviewed within 24 hours and kept confidential.
        </p>
        <button
          type="submit"
          className="brand-bg rounded-full px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90"
        >
          Submit report
        </button>
      </div>
    </form>
  );
}
