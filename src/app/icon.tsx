import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 14,
          display: "flex",
          flexWrap: "wrap",
          overflow: "hidden",
        }}
      >
        <div style={{ width: "50%", height: "50%", background: "#3C2A72" }} />
        <div style={{ width: "50%", height: "50%", background: "#C3287D" }} />
        <div style={{ width: "50%", height: "50%", background: "#B9AEE8" }} />
        <div style={{ width: "50%", height: "50%", background: "#B9AEE8" }} />
      </div>
    ),
    { ...size }
  );
}
