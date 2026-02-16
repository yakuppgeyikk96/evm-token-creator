"use client";

import { useState } from "react";

export type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultTab?: string;
};

export function Tabs({ tabs, defaultTab }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.id);

  const active = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  if (tabs.length === 0) return null;

  return (
    <div>
      <div role="tablist" className="flex gap-1 border-b border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={active?.id === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              active?.id === tab.id
                ? "border-b-2 border-white text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {active && (
        <div
          role="tabpanel"
          id={`tabpanel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          className="pt-4"
        >
          {active.content}
        </div>
      )}
    </div>
  );
}
