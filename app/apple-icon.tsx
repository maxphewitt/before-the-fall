import { ImageResponse } from "next/og";

/**
 * Apple touch icon — 180x180. iOS uses this when the user pins
 * Before the Fall to their home screen via Safari (the iOS PWA path).
 *
 * Design: gold cross centered on btf-sky-deep background with a soft
 * gold glow. Matches the existing app/icon.svg favicon at a larger
 * size and with the glow effect.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(160deg, #0e2a47 0%, #1a4068 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Gold glow */}
        <div
          style={{
            position: "absolute",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,164,74,0.4) 0%, rgba(212,164,74,0) 70%)",
          }}
        />
        {/* Cross — vertical bar */}
        <div
          style={{
            position: "absolute",
            width: "20px",
            height: "112px",
            background: "linear-gradient(180deg, #e0b56c 0%, #d4a44a 100%)",
            borderRadius: "3px",
          }}
        />
        {/* Cross — horizontal bar */}
        <div
          style={{
            position: "absolute",
            width: "70px",
            height: "20px",
            background: "linear-gradient(90deg, #d4a44a 0%, #e0b56c 50%, #d4a44a 100%)",
            borderRadius: "3px",
            transform: "translateY(-22px)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
