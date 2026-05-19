"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateEntry,
  softDeleteEntry,
  type JournalEntry,
} from "../../actions/journal";

/**
 * Client subcomponent that owns the per-entry interaction state:
 * view ↔ edit modes, save handler, delete confirmation.
 * The parent server component already authenticated the user and
 * decrypted the entry; this component never touches plaintext that
 * the parent didn't already vouch for.
 */
export default function EntryEditor({ entry }: { entry: JournalEntry }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(entry.text);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const createdAt = formatEntryDate(entry.createdAt);
  const updatedAt = formatEntryDate(entry.updatedAt);
  const wasEdited = entry.createdAt !== entry.updatedAt;

  async function onSave() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await updateEntry(entry.id, text);
      if (res.success) {
        setEditing(false);
        router.refresh();
      } else {
        setError(res.error);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function onCancelEdit() {
    setText(entry.text);
    setEditing(false);
    setError(null);
  }

  async function onDelete() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await softDeleteEntry(entry.id);
      if (res.success) {
        router.push("/journal");
        router.refresh();
      } else {
        setError(res.error);
        setSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <p className="text-[11px] tracking-[0.25em] text-btf-gold uppercase font-semibold mb-3">
        {editing ? "Editing entry" : "Entry"}
      </p>
      <p className="text-xs text-btf-text-light font-light mb-1">
        Written {createdAt}
      </p>
      {wasEdited && (
        <p className="text-xs text-btf-text-light/80 font-light mb-1">
          Last edited {updatedAt}
        </p>
      )}

      <div className="mt-6">
        {editing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting}
            autoFocus
            rows={14}
            aria-label="Journal entry text"
            className="w-full rounded-2xl bg-white border-2 border-btf-sky focus:outline-none px-5 py-4 text-base text-btf-text-dark font-light leading-relaxed resize-y shadow-sm transition-colors"
          />
        ) : (
          <div className="rounded-2xl bg-white border-2 border-btf-sky-pale/60 px-5 py-5 shadow-sm">
            <p className="text-base text-btf-text-dark font-light leading-relaxed whitespace-pre-line">
              {entry.text}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm p-4"
        >
          {error}
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        {editing ? (
          <>
            <button
              type="button"
              onClick={onSave}
              disabled={submitting || text.trim().length === 0}
              className="flex-1 bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-3.5 rounded-full shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
            >
              {submitting ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              disabled={submitting}
              className="flex-1 bg-white border-2 border-btf-text-light/30 text-btf-text-mid font-medium px-8 py-3.5 rounded-full hover:bg-btf-off-white transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="flex-1 bg-gradient-to-br from-btf-sky to-btf-sky-deep text-white font-medium px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-0.5 transition-transform"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex-1 bg-white border-2 border-btf-text-light/30 text-btf-text-mid font-medium px-8 py-3.5 rounded-full hover:bg-btf-off-white transition-colors"
            >
              Delete
            </button>
          </>
        )}
      </div>

      {/* Delete confirmation modal — inline, simple. */}
      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !submitting && setConfirmDelete(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="delete-confirm-title"
              className="font-serif text-xl text-btf-sky-deep font-light mb-3"
            >
              Delete this entry?
            </h2>
            <p className="text-sm text-btf-text-mid font-light leading-relaxed mb-6">
              It will be removed from your journal. A record is retained internally for safety and compliance, but no one reviews entries unless a safety trigger fires.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onDelete}
                disabled={submitting}
                className="flex-1 bg-[#8b1a1a] hover:bg-[#a02020] disabled:opacity-50 text-white font-medium px-6 py-3 rounded-full transition-colors"
              >
                {submitting ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={submitting}
                className="flex-1 bg-white border-2 border-btf-text-light/30 text-btf-text-mid font-medium px-6 py-3 rounded-full hover:bg-btf-off-white transition-colors"
              >
                Keep it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function formatEntryDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
