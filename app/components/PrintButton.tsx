"use client";

/**
 * Compact "save as PDF or print" affordance for any standalone article.
 *
 * Calls window.print(). On modern browsers, the print dialog lets the
 * user save to PDF directly (Mac: "Save as PDF" dropdown; Windows:
 * "Microsoft Print to PDF" or "Save as PDF"; iOS Safari: share sheet
 * after preview; Android Chrome: "Save as PDF" destination).
 *
 * The print stylesheet in globals.css hides the chrome (header nav,
 * crisis ramp, PWA banner, this button itself) so the saved file is
 * clean article text. Add `data-print-hide` to any element you want
 * suppressed during print.
 */
export default function PrintButton({
  label = "Save as PDF or print",
}: {
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      data-print-hide="true"
      className="inline-flex items-center gap-2 text-xs text-btf-sky-deep underline underline-offset-4 hover:text-btf-sky font-medium"
    >
      <span aria-hidden>↓</span> {label}
    </button>
  );
}
