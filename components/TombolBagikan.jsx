"use client";

import { useState } from "react";

// US-23: Bagikan atau salin link produk
export default function TombolBagikan({ nama }) {
  const [pesan, setPesan] = useState("");

  async function handleBagikan() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: nama,
          url,
        });
        return;
      } catch {
        // Fallback ke clipboard jika dibatalkan pengguna
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setPesan("Link tersalin!");
      setTimeout(() => setPesan(""), 2500);
    } catch {
      setPesan("Gagal menyalin link.");
      setTimeout(() => setPesan(""), 2500);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleBagikan}
        className="inline-flex items-center gap-1.5 rounded-lg border border-garis bg-latar px-3.5 py-2 text-xs font-semibold text-teks-lembut hover:border-utama hover:text-utama transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.8"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
          />
        </svg>
        Bagikan link
      </button>
      {pesan && (
        <span className="text-xs font-medium text-utama">
          {pesan}
        </span>
      )}
    </div>
  );
}
