"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, SearchX, Search } from "lucide-react";
import { COUNTRIES } from "@/constants/gap-analyzer";

export function CountryDropdown({
  selectedCountry,
  onSelect,
}: {
  selectedCountry: string | null;
  onSelect: (c: string | null) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className="border-border bg-card absolute top-14 left-0 z-50 w-full overflow-hidden rounded-xl border shadow-lg"
    >
      <div className="border-border border-b p-2">
        <div className="relative">
          <Search
            size={14}
            className="absolute top-1/2 left-2.5 -translate-y-1/2 text-(--text-dim)"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search country..."
            className="border-border focus:border-primary h-9 w-full rounded-lg border bg-(--surface-1) pr-3 pl-8 text-sm transition-colors outline-none"
          />
        </div>
      </div>
      <div className="scrollbar-thin max-h-56 overflow-y-auto p-1.5">
        {!query && (
          <button
            onClick={() => onSelect(null)}
            className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
              !selectedCountry
                ? "text-primary bg-primary/5 font-bold"
                : "text-foreground hover:bg-(--surface-2)"
            }`}
          >
            <span>All Countries</span>
            {!selectedCountry && <Check size={14} className="text-primary" />}
          </button>
        )}
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <button
              key={country.name}
              onClick={() => onSelect(country.name)}
              className={`flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                selectedCountry === country.name
                  ? "text-primary bg-primary/5 font-bold"
                  : "text-foreground hover:bg-(--surface-2)"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </span>
              {selectedCountry === country.name && (
                <Check size={14} className="text-primary" />
              )}
            </button>
          ))
        ) : (
          <div className="flex flex-col items-center py-4 text-center">
            <SearchX size={16} className="text-muted-foreground mb-1" />
            <span className="text-xs text-(--text-dim)">No country found</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
