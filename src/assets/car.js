import React from "react";

const Car = (props) => {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      viewBox="0 0 900.000000 500.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
        fill={props.color}
        stroke="none"
      >
        <path
          d="M3810 3742 c-51 -6 -117 -26 -180 -56 -52 -25 -99 -65 -247 -208
-101 -98 -188 -178 -193 -178 -6 0 -10 11 -10 25 0 36 -24 79 -57 101 -23 15
-45 19 -118 18 -190 -3 -289 -83 -245 -198 15 -41 88 -106 149 -134 31 -14 57
-26 59 -27 1 -1 -41 -44 -94 -96 -112 -110 -180 -207 -222 -316 -49 -126 -54
-179 -50 -514 4 -287 5 -307 26 -360 13 -31 37 -76 55 -100 31 -43 32 -48 38
-170 6 -144 24 -189 91 -235 33 -23 55 -28 146 -36 290 -26 406 27 422 192 l5
55 1115 0 1115 0 5 -55 c16 -164 132 -218 420 -193 88 8 112 14 146 36 69 46
87 91 93 236 6 122 7 127 38 170 18 24 42 69 55 100 21 53 22 73 26 360 4 335
-1 388 -50 514 -42 109 -110 206 -222 316 -53 52 -95 95 -94 96 2 1 24 12 50
23 141 61 207 184 143 261 -50 59 -222 97 -315 69 -51 -16 -90 -63 -90 -109 0
-16 -5 -29 -10 -29 -6 0 -91 79 -190 175 -136 133 -193 181 -241 205 -128 65
-88 62 -849 64 -382 1 -706 0 -720 -2z m1465 -231 c65 -32 76 -42 337 -297
l178 -174 -1290 -2 c-710 -2 -1290 0 -1290 4 0 4 11 15 25 26 14 11 116 109
228 218 161 158 214 203 262 226 l60 28 715 0 715 0 60 -29z m-2209 -810 c149
-58 340 -196 380 -273 36 -69 -16 -109 -167 -129 -121 -17 -354 -7 -399 15
-81 42 -121 106 -121 195 -1 94 54 177 137 206 57 20 91 18 170 -14z m3042 13
c182 -75 178 -341 -5 -406 -53 -18 -366 -18 -451 1 -64 14 -112 47 -112 76 0
76 198 236 385 312 89 37 128 40 183 17z m-741 -323 c-13 -120 -75 -235 -152
-278 l-40 -23 -675 0 -675 0 -40 23 c-77 43 -139 158 -152 278 l-6 59 873 0
873 0 -6 -59z m-1939 -513 l132 -153 -247 -3 c-213 -2 -254 0 -293 14 -73 28
-130 72 -151 118 -24 52 -23 80 1 134 l19 42 204 0 203 0 132 -152z m2702 110
c24 -54 25 -82 1 -134 -21 -46 -78 -90 -151 -118 -39 -14 -80 -16 -293 -14
l-247 3 132 153 132 152 203 0 204 0 19 -42z m-834 -90 c-10 -64 -53 -119
-116 -151 l-55 -28 -640 3 -640 3 -42 28 c-51 32 -90 91 -99 146 l-7 41 803 0
803 0 -7 -42z"
        />
      </g>
    </svg>
  );
};

export default Car;
