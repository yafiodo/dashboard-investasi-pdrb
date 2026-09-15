import React from "react";

interface RIRULogoProps {
  className?: string;
  size?: number;
}

export default function RIRULogo({ className = "w-10 h-10", size = 44 }: RIRULogoProps) {
  return (
    <div className={`relative flex items-center justify-center flex-shrink-0 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Background Gradient */}
          <linearGradient id="riruBgGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0f2444" />
            <stop offset="50%" stopColor="#0b192e" />
            <stop offset="100%" stopColor="#081324" />
          </linearGradient>

          {/* Golden Investment Growth Gradient */}
          <linearGradient id="riruGoldGrad" x1="6" y1="36" x2="38" y2="8" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="60%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>

          {/* Navy / Cyan Accent Gradient */}
          <linearGradient id="riruCyanGrad" x1="12" y1="32" x2="32" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Border Glow Gradient */}
          <linearGradient id="riruBorderGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Outer Squircle Container */}
        <rect
          x="1"
          y="1"
          width="42"
          height="42"
          rx="11"
          fill="url(#riruBgGrad)"
          stroke="url(#riruBorderGrad)"
          strokeWidth="1.5"
        />

        {/* Subtle Regional Connectivity Grid (Arcs) */}
        <path
          d="M10 28 C 16 32, 28 32, 34 26"
          stroke="#38bdf8"
          strokeWidth="1"
          strokeDasharray="2 2"
          strokeOpacity="0.45"
        />
        <path
          d="M12 20 C 18 14, 26 14, 32 18"
          stroke="#f59e0b"
          strokeWidth="1"
          strokeDasharray="2 2"
          strokeOpacity="0.35"
        />

        {/* Connected Regional Nodes (Central, Regional, Investor) */}
        <circle cx="11" cy="28" r="2.2" fill="#38bdf8" />
        <circle cx="21" cy="31" r="1.8" fill="#60a5fa" />
        <circle cx="33" cy="25" r="2.2" fill="#f59e0b" />

        {/* Dynamic Upward Investment Growth Curve & Monogram 'R' Silhouette */}
        <path
          d="M13 33 V 13 C 13 11.5, 15 10.5, 17 10.5 H 22 C 26 10.5, 28.5 12.8, 28.5 16.5 C 28.5 19.8, 26 21.8, 22.5 22 L 29.5 33"
          stroke="url(#riruGoldGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Forward Surge Arrow / Investor Trajectory Vector */}
        <path
          d="M19 28 L 26 21 L 34 11"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M28 11 H 34 V 17"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Luminous Apex Star / Core Investment Spark */}
        <circle cx="34" cy="11" r="2" fill="#fbbf24" />
        <circle cx="34" cy="11" r="4" fill="#fbbf24" fillOpacity="0.35" />
      </svg>
    </div>
  );
}
