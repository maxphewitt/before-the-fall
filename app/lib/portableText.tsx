import React from "react";
import Image from "next/image";
import { urlForImage } from "./sanity";
import type { PortableBlock } from "./articles";

/**
 * Minimal Portable Text renderer — no @portabletext/react dependency.
 *
 * Handles the blocks a blog actually uses: headings (h2–h4), paragraphs,
 * blockquotes, bullet/numbered lists, inline marks (strong, em, code,
 * links), and inline images. Anything unrecognized is skipped safely.
 * Styled in the BTF brand.
 */

type Span = { _key?: string; text?: string; marks?: string[] };
type MarkDef = { _key: string; _type: string; href?: string };

function Spans({
  spans,
  markDefs,
}: {
  spans?: Span[];
  markDefs?: MarkDef[];
}) {
  if (!spans) return null;
  return (
    <>
      {spans.map((span, i) => {
        let node: React.ReactNode = span.text ?? "";
        for (const mark of span.marks ?? []) {
          const def = markDefs?.find((d) => d._key === mark);
          if (def?._type === "link" && def.href) {
            node = (
              <a
                key={`l-${i}`}
                href={def.href}
                className="text-btf-sky underline underline-offset-2 hover:text-btf-sky-deep"
                {...(def.href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {node}
              </a>
            );
          } else if (mark === "strong") {
            node = <strong key={`s-${i}`}>{node}</strong>;
          } else if (mark === "em") {
            node = <em key={`e-${i}`}>{node}</em>;
          } else if (mark === "code") {
            node = (
              <code
                key={`c-${i}`}
                className="font-mono text-[0.9em] bg-btf-sky-pale/60 px-1.5 py-0.5 rounded"
              >
                {node}
              </code>
            );
          }
        }
        return <React.Fragment key={span._key ?? i}>{node}</React.Fragment>;
      })}
    </>
  );
}

function TextBlock({ block }: { block: PortableBlock }) {
  const inner = <Spans spans={block.children} markDefs={block.markDefs} />;
  switch (block.style) {
    case "h2":
      return (
        <h2 className="font-serif text-2xl md:text-3xl text-btf-sky-deep font-light mt-10 mb-3">
          {inner}
        </h2>
      );
    case "h3":
      return (
        <h3 className="font-serif text-xl md:text-2xl text-btf-sky-deep font-light mt-8 mb-2">
          {inner}
        </h3>
      );
    case "h4":
      return (
        <h4 className="font-medium text-lg text-btf-sky-deep mt-6 mb-2">
          {inner}
        </h4>
      );
    case "blockquote":
      return (
        <blockquote className="border-l-2 border-btf-gold pl-5 my-6 font-serif italic text-lg text-btf-text-mid">
          {inner}
        </blockquote>
      );
    default:
      return (
        <p className="text-btf-text-mid font-light leading-relaxed my-4">
          {inner}
        </p>
      );
  }
}

export function PortableText({ blocks }: { blocks: PortableBlock[] }) {
  const out: React.ReactNode[] = [];
  let list: { ordered: boolean; items: PortableBlock[] } | null = null;

  const flush = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    out.push(
      <Tag
        key={`list-${out.length}`}
        className={
          "my-4 pl-6 space-y-2 text-btf-text-mid font-light leading-relaxed " +
          (list.ordered ? "list-decimal" : "list-disc marker:text-btf-gold")
        }
      >
        {list.items.map((li, i) => (
          <li key={li._key ?? i}>
            <Spans spans={li.children} markDefs={li.markDefs} />
          </li>
        ))}
      </Tag>
    );
    list = null;
  };

  for (const block of blocks) {
    if (block._type === "block" && block.listItem) {
      const ordered = block.listItem === "number";
      if (!list || list.ordered !== ordered) {
        flush();
        list = { ordered, items: [] };
      }
      list.items.push(block);
      continue;
    }
    flush();

    if (block._type === "image" && block.asset?._ref) {
      const src = urlForImage(block.asset._ref, 1400);
      if (src) {
        out.push(
          <figure key={block._key ?? out.length} className="my-8">
            <Image
              src={src}
              alt={block.alt ?? ""}
              width={1400}
              height={900}
              className="w-full h-auto rounded-2xl"
            />
          </figure>
        );
      }
      continue;
    }

    if (block._type === "block") {
      out.push(<TextBlock key={block._key ?? out.length} block={block} />);
    }
  }
  flush();

  return <>{out}</>;
}
