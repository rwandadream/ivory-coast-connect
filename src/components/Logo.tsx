import React from "react";

interface LogoProps {
  size?: number;
  className?: string;
  useBrandColor?: boolean;
}

export function Logo({ size = 100, className = "", useBrandColor = true }: LogoProps) {
  // Brand color: Blue royal (#004aad)
  const color = useBrandColor ? "#004aad" : "currentColor";

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Octagon */}
      <polygon
        points="62.7,10 137.3,10 190,62.7 190,137.3 137.3,190 62.7,190 10,137.3 10,62.7"
        fill="white"
        stroke={color}
        strokeWidth="7"
        strokeLinejoin="miter"
      />
      {/* Inner Octagon */}
      <polygon
        points="66.9,20 133.1,20 180,66.9 180,133.1 133.1,180 66.9,180 20,133.1 20,66.9"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="miter"
      />

      {/* Curve for GROUPE text */}
      <path id="groupe-path" d="M 38,70 A 68,68 0 0,1 162,70" fill="none" stroke="none" />

      {/* GROUPE Text */}
      <text
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="21"
        fill="white"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
      >
        <textPath href="#groupe-path" startOffset="50%" textAnchor="middle">
          GROUPE
        </textPath>
      </text>

      {/* Central Star */}
      <polygon
        points="100,42 112.9,81.2 152.3,82 120.9,105.8 132.3,143.5 100,121 67.7,143.5 79.1,105.8 47.7,82 87.1,81.2"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* GS Monogram inside the star */}
      <g
        transform="translate(100, 93) scale(0.9)"
        fill="none"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* G path */}
        <path d="M 6,-8 C 6,-8 2,-13 -4,-13 C -11,-13 -17,-8 -17,0 C -17,8 -11,13 -4,13 C 2,13 7,9 7,2 L 7,0 L -2,0" />
        {/* S path */}
        <path d="M 14,-9 C 14,-13 9,-13 6,-9 C 3,-5 11,-4 8,2 C 5,8 -1,8 -4,6" />
      </g>

      {/* SARAH Text */}
      <text
        x="100"
        y="167"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="26"
        letterSpacing="3"
        fill="white"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
        textAnchor="middle"
      >
        SARAH
      </text>
    </svg>
  );
}
