"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutUser } from "../../actions/userSession";
import { OliveBranch } from "../../components/OliveBranch";

/**
 * PlatformNav — the persistent navigation for the gated platform shell.
 *
 * Replaces the old top bar + the per-page "← Home" back button. Two
 * presentations of the SAME destinations, switched purely by breakpoint:
 *
 *   - MOBILE  (< md): a floating bottom dock (Home · Explore · Support ·
 *     Grove · You) with a raised centre "Support now" action.
 *   - DESKTOP (≥ md): a fixed left sidebar with the brand mark, the same
 *     destinations as labelled rows, a Support button, and Sign out.
 *
 * Active state is derived from the current path so the right item lights
 * up on every page. Icons are inline SVG only (no emoji/dingbats), per
 * the brand rules. The gold cross is the brand marker.
 */

type Item = {
  href: string;
  label: string;
  /** Match this path prefix for the active state. */
  match: string;
  icon: React.ReactNode;
};

const homeIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.5V21h14V9.5" />
  </svg>
);
const exploreIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);
const groveIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 11l9-8 9 8" />
    <path d="M12 3v18" />
    <circle cx="12" cy="14" r="3" />
  </svg>
);
const youIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

const bibleIcon = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <path d="M12 6v6M9.5 8.5h5" />
  </svg>
);

// Desktop-sidebar-only item for faith users (the mobile dock references
// ITEMS by index, so the Bible is inserted separately — see sidebarItems).
// href opens the reader at the saved position (or Genesis 1); match stays
// on the section root so the book grid and chapter pages light it up too.
const BIBLE_ITEM: Item = { href: "/catholic-path/bible/read", label: "Bible", match: "/catholic-path/bible", icon: bibleIcon };

const ITEMS: Item[] = [
  { href: "/home", label: "Home", match: "/home", icon: homeIcon },
  { href: "/explore", label: "Explore", match: "/explore", icon: exploreIcon },
  { href: "/today/grove", label: "Grove", match: "/today/grove", icon: groveIcon },
  { href: "/you", label: "You", match: "/you", icon: youIcon },
];

function isActive(pathname: string, match: string): boolean {
  return pathname === match || pathname.startsWith(match + "/");
}

export default function PlatformNav({ secular = false }: { secular?: boolean }) {
  const pathname = usePathname() || "";
  // Faith users get the Bible in the desktop sidebar, right after Explore.
  const sidebarItems = secular
    ? ITEMS
    : [...ITEMS.slice(0, 2), BIBLE_ITEM, ...ITEMS.slice(2)];

  return (
    <>
      {/* ─── Desktop sidebar ─── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[236px] z-30 flex-col px-4 py-7 border-r border-white/10 bg-[rgba(8,20,34,0.55)] backdrop-blur-md">
        <Link href="/home" className="flex items-center gap-2.5 px-2 pb-6">
          {secular ? <OliveBranch className="w-4 h-5" /> : <GoldCross className="w-4 h-5" />}
          <span className="font-cinzel text-sm tracking-[0.12em] text-[#eaf2f9]">
            BEFORE THE FALL
          </span>
        </Link>

        {sidebarItems.map((it) => {
          const active = isActive(pathname, it.match);
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? "page" : undefined}
              className={
                "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors " +
                (active
                  ? "bg-btf-gold/15 border border-btf-gold/30 text-btf-gold-light"
                  : "text-[#9fb6c8] hover:bg-white/5 hover:text-[#dbe8f3] border border-transparent")
              }
            >
              {it.icon}
              {it.label}
            </Link>
          );
        })}

        <Link
          href="/tools"
          className="mt-3.5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-btf-gold-light to-btf-gold text-[#2a2008] font-bold text-[13px] py-3 transition-transform hover:-translate-y-0.5"
        >
          <PlusIcon />
          Support now
        </Link>

        <div className="flex-1" />

        <form action={signOutUser}>
          <button
            type="submit"
            className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-[13px] text-[#8aa0b0] hover:text-[#cfe0ee] transition-colors"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="m16 17 5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
            Sign out
          </button>
        </form>
      </aside>

      {/* ─── Mobile bottom dock ─── */}
      <nav
        aria-label="Primary"
        className="md:hidden fixed left-1/2 -translate-x-1/2 bottom-[18px] z-30 w-[calc(100%-36px)] max-w-[444px] flex items-center justify-around rounded-[20px] px-2 py-2.5 border border-white/12 bg-[rgba(8,20,34,0.82)] backdrop-blur-lg shadow-[0_16px_40px_-16px_rgba(0,0,0,0.8)]"
      >
        <DockItem item={ITEMS[0]} pathname={pathname} />
        <DockItem item={ITEMS[1]} pathname={pathname} />
        <Link
          href="/tools"
          aria-label="Support now"
          className="flex-none w-[52px] h-[52px] -mt-[26px] rounded-full grid place-items-center bg-gradient-to-b from-btf-gold-light to-btf-gold shadow-[0_12px_28px_-8px_rgba(201,168,76,0.8)]"
        >
          <span className="text-[#2a2008]"><PlusIcon size={24} /></span>
        </Link>
        <DockItem item={ITEMS[2]} pathname={pathname} />
        <DockItem item={ITEMS[3]} pathname={pathname} />
      </nav>
    </>
  );
}

function DockItem({ item, pathname }: { item: Item; pathname: string }) {
  const active = isActive(pathname, item.match);
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={
        "flex flex-1 flex-col items-center gap-1 text-[10px] tracking-[0.04em] " +
        (active ? "text-btf-gold-light" : "text-[#9fb6c8]")
      }
    >
      {item.icon}
      {item.label}
    </Link>
  );
}

function GoldCross({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 13 16" fill="none" aria-hidden>
      <path d="M5.2 1.4h2.6v4.2H12v2.6H7.8V15H5.2V8.2H1V5.6h4.2V1.4z" fill="#e8cc7a" />
    </svg>
  );
}

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
