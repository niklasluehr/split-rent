import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Split Rent";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const interRegular = await readFile(
    join(process.cwd(), "public/fonts/Inter-Regular.ttf"),
  );
  const interBold = await readFile(
    join(process.cwd(), "public/fonts/Inter-Bold.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          fontFamily: "Inter",
        }}
      >
        <h1
          style={{
            fontSize: "5rem",
            fontWeight: 400,
            marginBottom: "0",
            textTransform: "uppercase",
          }}
        >
          <span style={{ fontWeight: 700 }}>SPLIT</span>Rent
        </h1>
        <p
          style={{
            fontSize: "2.5rem",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
          }}
        >
          split rental expenses easily
        </p>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: interRegular,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: interBold,
          weight: 700,
          style: "normal",
        },
      ],
    },
  );
}
