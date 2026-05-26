import { ImageResponse } from "next/og";

/**
 * Open Graph image for social sharing — 1200x630, the cross-platform
 * standard. Twitter/X, Facebook, Slack, iMessage, Discord all use it.
 *
 * Composition: brand cross on deep-sky gradient, Cinzel-style serif
 * wordmark, scripture eyebrow, locked tagline. Maintains the platform's
 * brand voice even outside the site.
 *
 * No external font loading — relies on system serif fallback so the
 * generator can't fail at runtime.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(160deg, #0e2a47 0%, #1a4068 50%, #2a5a8c 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Gold glow */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,164,74,0.25) 0%, rgba(212,164,74,0) 70%)",
          }}
        />

        {/* Cross */}
        <div
          style={{
            position: "relative",
            width: "80px",
            height: "80px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "14px",
              height: "80px",
              background: "linear-gradient(180deg, #e0b56c 0%, #d4a44a 100%)",
              borderRadius: "2px",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "50px",
              height: "14px",
              background:
                "linear-gradient(90deg, #d4a44a 0%, #e0b56c 50%, #d4a44a 100%)",
              borderRadius: "2px",
              transform: "translateY(-18px)",
            }}
          />
        </div>

        {/* Eyebrow scripture */}
        <p
          style={{
            fontSize: 26,
            fontStyle: "italic",
            color: "rgba(224, 181, 108, 0.95)",
            margin: "0 0 8px 0",
            textAlign: "center",
            letterSpacing: "0.01em",
          }}
        >
          &ldquo;For the Son of Man has come to seek and to save what was lost.&rdquo;
        </p>
        <p
          style={{
            fontSize: 14,
            color: "rgba(212, 164, 74, 0.85)",
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            margin: "0 0 50px 0",
          }}
        >
          Luke 19:10
        </p>

        {/* Headline */}
        <h1
          style={{
            fontSize: 64,
            color: "white",
            fontWeight: 300,
            lineHeight: 1.1,
            textAlign: "center",
            margin: "0 0 24px 0",
            maxWidth: "900px",
          }}
        >
          You are not a monster.
        </h1>
        <h2
          style={{
            fontSize: 56,
            color: "#e0b56c",
            fontStyle: "italic",
            fontWeight: 300,
            lineHeight: 1.15,
            textAlign: "center",
            margin: "0 0 50px 0",
          }}
        >
          You don&rsquo;t have to become one.
        </h2>

        {/* Wordmark */}
        <p
          style={{
            fontSize: 18,
            color: "rgba(255,255,255,0.7)",
            textTransform: "uppercase",
            letterSpacing: "0.4em",
            margin: 0,
            fontWeight: 500,
          }}
        >
          Before the Fall
        </p>
        <p
          style={{
            fontSize: 14,
            color: "rgba(212, 164, 74, 0.85)",
            margin: "8px 0 0 0",
            fontStyle: "italic",
          }}
        >
          Built for the moment before the fall
        </p>
      </div>
    ),
    { ...size }
  );
}
