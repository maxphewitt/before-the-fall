"use client";

import { useState, useTransition } from "react";
import { setHabitSchedule } from "../../../actions/habitSchedules";
import type { HabitSlug } from "../../../lib/habits";
import { formatScheduleTime } from "../../../lib/habitTypes";

export type SchedulerItem = {
  slug: HabitSlug;
  label: string;
  description: string;
  time: string | null; // "HH:MM" or null
};

/**
 * Per-habit time picker. Each row has a native time input; changing it saves
 * immediately via setHabitSchedule. A subtle status shows the saved state.
 */
export default function HabitScheduler({ items }: { items: SchedulerItem[] }) {
  return (
    <ul className="space-y-3 pb-2">
      {items.map((item) => (
        <Row key={item.slug} item={item} />
      ))}
    </ul>
  );
}

function Row({ item }: { item: SchedulerItem }) {
  const [time, setTime] = useState(item.time ?? "");
  const [saved, setSaved] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [, startTransition] = useTransition();

  function commit(next: string) {
    setTime(next);
    setSaved("saving");
    startTransition(async () => {
      const res = await setHabitSchedule(item.slug, next === "" ? null : next);
      setSaved(res.success ? "done" : "error");
    });
  }

  return (
    <li className="rounded-[18px] bg-white/[0.055] border border-white/[0.09] p-4 flex items-center gap-4">
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-medium">{item.label}</div>
        <div className="text-[12px] text-[#9fb6c8] leading-snug mt-0.5">
          {saved === "done" && time
            ? `In your day at ${formatScheduleTime(time)}`
            : saved === "done" && !time
              ? "No set time"
              : saved === "error"
                ? "Couldn't save — try again"
                : item.description}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-none">
        <input
          type="time"
          value={time}
          onChange={(e) => commit(e.target.value)}
          className="bg-white/[0.06] border border-white/15 rounded-lg px-2.5 py-1.5 text-[#e9f1f8] outline-none focus:border-btf-gold/50 [color-scheme:dark]"
        />
        {time && (
          <button
            type="button"
            onClick={() => commit("")}
            className="text-[#9fb6c8] hover:text-white text-xs"
            aria-label={`Clear time for ${item.label}`}
          >
            Clear
          </button>
        )}
      </div>
    </li>
  );
}
