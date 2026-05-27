import Link from "next/link";
import { logoutAdminForm } from "../actions/admin";

/**
 * Unified admin navigation header.
 *
 * Drops into every page under /admin/*. Lets Max move between sections
 * without having to know the URLs. Highlights the current section.
 *
 * Sign-out form lives here too — submitting it clears btf_admin_id and
 * the next nav hits proxy without an admin cookie, which bounces to /.
 */

type AdminSection =
  | "review"
  | "incidents"
  | "beta-codes"
  | "analytics"
  | "grant-reports"
  | "audit";

const NAV_ITEMS: { label: string; href: string; section: AdminSection }[] = [
  { label: "Review", href: "/admin/review", section: "review" },
  { label: "Beta codes", href: "/admin/beta-codes", section: "beta-codes" },
  { label: "Analytics", href: "/admin/analytics", section: "analytics" },
  { label: "Grant reports", href: "/admin/grant-reports", section: "grant-reports" },
  { label: "Audit", href: "/admin/audit", section: "audit" },
];

export default function AdminNav({ current }: { current: AdminSection }) {
  return (
    <div className="mb-8 -mx-2 sm:-mx-3">
      <div className="flex items-center justify-between flex-wrap gap-3 px-2 sm:px-3">
        <nav className="flex flex-wrap items-center gap-x-1 gap-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = item.section === current;
            return (
              <Link
                key={item.section}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  "text-[11px] tracking-[0.22em] uppercase font-medium px-3 py-1.5 rounded-full transition-colors " +
                  (isActive
                    ? "bg-btf-sky-deep text-white"
                    : "text-btf-text-light hover:text-btf-sky-deep hover:bg-btf-sky-pale/50")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-[11px] tracking-[0.22em] uppercase text-btf-text-light hover:text-btf-sky-deep transition-colors"
          >
            ← Site
          </Link>
          <form action={logoutAdminForm}>
            <button
              type="submit"
              className="text-[11px] tracking-[0.22em] uppercase text-btf-text-light hover:text-btf-sky-deep transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
