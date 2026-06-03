const PaperIcon = () => {
  return (
    <svg
      className="h-full"
      viewBox="0 0 122 151"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M76.2017 4H8C3.58172 4 0 7.58172 0 12V142.877C0 147.295 3.58172 150.877 8 150.877H108.43C112.848 150.877 116.43 147.295 116.43 142.877V51.4365L76.2017 4Z"
        fill="white"
      />
      <g filter="url(#filter0_d_1257_640)">
        <path
          d="M80.3047 51.2627H116.43L76.3047 4V47.2627C76.3047 49.4718 78.0955 51.2627 80.3047 51.2627Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_1257_640"
          x="67.3047"
          y="0"
          width="54.125"
          height="61.2627"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-2" dy="3" />
          <feGaussianBlur stdDeviation="3.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.07 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1257_640"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1257_640"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default PaperIcon;
