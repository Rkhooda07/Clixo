import { ImageResponse } from "next/og";

// Rendered once at build time by Satori, so LinkedIn/Slack/X get a real card
// instead of a grey box. Satori supports a narrow CSS subset — flexbox and
// inline styles only, no Tailwind classes, no CSS variables.
export const alt = "Clixo — a decentralised opinion market on Ethereum";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0c0c0e";
const LINE = "#242428";
const HI = "#f0f0f0";
const LO = "#a4a4aa";
const AMBER = "#e8a020";

const LOGO_PATH =
  "M12.3206 0L19.6794 0L16 12.8223ZM12.3206 32L19.6794 32L16 19.1777ZM1.784 6.3554L7.8606 6.3554L16 14.4948L14.4948 16L16 17.5052L7.8606 25.6446L1.784 25.6446L11.5401 16ZM30.216 6.3554L24.1394 6.3554L16 14.4948L17.5052 16L16 17.5052L24.1394 25.6446L30.216 25.6446L20.4599 16Z";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="40" height="40" viewBox="0 0 32 32" fill={HI}>
            <path d={LOGO_PATH} />
          </svg>
          <span
            style={{
              color: HI,
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "0.12em",
            }}
          >
            CLIXO
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: HI, fontSize: 68, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            What does the crowd
          </div>
          <div style={{ color: LO, fontSize: 68, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            actually think?
          </div>
          <div style={{ color: LO, fontSize: 24, marginTop: 28, maxWidth: 780, lineHeight: 1.5 }}>
            Post anything that needs real human judgment. Stake ETH. Get answers from
            people who get paid to give a damn.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            borderTop: `1px solid ${LINE}`,
            paddingTop: 28,
            color: LO,
            fontSize: 20,
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ color: AMBER }}>Ξ</span>
          <span>Blind voting</span>
          <span style={{ color: LINE }}>/</span>
          <span>Settled on Ethereum Sepolia</span>
        </div>
      </div>
    ),
    size
  );
}
