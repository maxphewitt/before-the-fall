"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { markUrgeReviewed } from "../../actions/fieldJournal";

export default function ReviewButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      onClick={async () => {
        setBusy(true);
        await markUrgeReviewed(id);
        router.refresh();
      }}
      disabled={busy}
      className="rounded-full bg-btf-sky text-white text-xs font-medium px-4 py-2 disabled:opacity-50 cursor-pointer"
    >
      {busy ? "…" : "Mark reviewed"}
    </button>
  );
}
