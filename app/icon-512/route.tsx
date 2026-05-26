import { ImageResponse } from "next/og";

/**
 * 512x512 PWA icon. Referenced from app/manifest.ts as /icon-512.
 *
 * Same gold-cross-on-deep-sky design, larger. Used by Android Chrome
 * for the splash-screen icon on PWA launch, and as the high-res
 * launcher icon. Also serves as the maskable icon — the safe zone is
 * the inner 80% so the cross is well within it.
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
            width: "340px",
            height: "340px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,164,74,0.45) 0%, rgba(212,164,74,0) 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "56px",
            height: "320px",
            background: "linear-gradient(180deg, #e0b56c 0%, #d4a44a 100%)",
            borderRadius: "8px",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "200px",
            height: "56px",
            background:
              "linear-gradient(90deg, #d4a44a 0%, #e0b56c 50%, #d4a44a 100%)",
            borderRadius: "8px",
            transform: "translateY(-62px)",
          }}
        />
      </div>
    ),
    { width: 512, height: 512 }
  );
}
