import { ImageResponse } from "next/og";

/**
 * 192x192 PWA icon. Referenced from app/manifest.ts as /icon-192.
 *
 * Same gold-cross-on-deep-sky design as the apple-icon, scaled down.
 * Android uses this as the standard launcher icon on home-screen
 * install.
 */
export const dynamic = "force-static";

export async function GET() {
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
        <div
          style={{
            position: "absolute",
            width: "130px",
            height: "130px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,164,74,0.4) 0%, rgba(212,164,74,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "22px",
            height: "120px",
            background: "linear-gradient(180deg, #e0b56c 0%, #d4a44a 100%)",
            borderRadius: "3px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "76px",
            height: "22px",
            background: "linear-gradient(90deg, #d4a44a 0%, #e0b56c 50%, #d4a44a 100%)",
            borderRadius: "3px",
            transform: "translateY(-23px)",
          }}
        />
      </div>
    ),
    { width: 192, height: 192 }
  );
}
