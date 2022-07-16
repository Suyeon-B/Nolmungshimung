import React from "react";

const MousePointer = ({ color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={color}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g filter="url(#shadow)">
        <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path>
      </g>
      <defs>
        <filter
          id="shadow"
          x="0.8"
          y="0.02"
          width="21.0"
          height="23.50"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="x"></feFlood>
          <feColorMatrix
            in="SourceAlpha"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 126 0"
          ></feColorMatrix>
          <feOffset dy="1"></feOffset>
          <feGaussianBlur stdDeviation="1.5"></feGaussianBlur>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.38 0"></feColorMatrix>
          <feBlend in2="x" result="y"></feBlend>
          <feBlend in="SourceGraphic" in2="y" result="shape"></feBlend>
        </filter>
      </defs>
    </svg>
  );
};

export default MousePointer;
