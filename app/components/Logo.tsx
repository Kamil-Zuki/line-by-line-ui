"use client";

import { HTMLAttributes } from "react";
import { useColorModeValue } from "@chakra-ui/react";

interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  size?: number; // height in px
  monochrome?: boolean;
}

export default function Logo({
  size = 28,
  monochrome = false,
  style,
  ...rest
}: LogoProps) {
  const iconPrimary = monochrome
    ? useColorModeValue("#1A202C", "#F7FAFC")
    : "#2B6CB0";
  const iconSecondary = monochrome
    ? useColorModeValue("#2D3748", "#E2E8F0")
    : "#63B3ED";
  const textColor = useColorModeValue("#1A202C", "#F7FAFC");

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        height: size,
        ...style,
      }}
      {...rest}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="LineByLine logo icon"
      >
        <rect x="14" y="8" width="8" height="48" rx="4" fill={iconPrimary} />
        <rect x="30" y="8" width="8" height="48" rx="4" fill={iconSecondary} />
      </svg>
      <svg
        height={size * 0.7}
        viewBox="0 0 320 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="LineByLine wordmark"
      >
        <g
          fontFamily="Inter, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
          fontWeight={700}
          fontSize="48"
          fill={textColor}
          paintOrder="stroke fill"
          stroke={useColorModeValue("#FFFFFF", "#1A202C")}
          strokeWidth={useColorModeValue(0, 0.6)}
        >
          <text x="0" y="46">
            Line
          </text>
          <text x="96" y="46" fill={iconPrimary}>
            By
          </text>
          <text x="140" y="46">
            Line
          </text>
        </g>
      </svg>
    </div>
  );
}
