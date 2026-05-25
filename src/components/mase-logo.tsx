type LogoProps = {
  size?: number;
  variant?: "default" | "light" | "mark";
  className?: string;
};

export function MaseLogo({ size = 28, variant = "default", className }: LogoProps) {
  const ink = variant === "light" ? "#f4f3ee" : "#463f3a";
  const accent = "#c98e7d";

  if (variant === "mark") {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Mase"
      >
        <rect x="2" y="2" width="36" height="36" rx="8" fill={ink} />
        <path
          d="M11 28V12L20 22L29 12V28"
          stroke={accent}
          strokeWidth="2.5"
          strokeLinecap="square"
          strokeLinejoin="miter"
          fill="none"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size * 2.6}
      height={size}
      viewBox="0 0 104 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Mase"
    >
      <rect x="0" y="2" width="36" height="36" rx="8" fill={ink} />
      <path
        d="M9 30V12L18 22L27 12V30"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
      />
      <text
        x="46"
        y="28"
        fontFamily="ui-serif, Georgia, 'Iowan Old Style', serif"
        fontSize="22"
        fontWeight="500"
        letterSpacing="0.04em"
        fill={ink}
      >
        Mase
      </text>
      <circle cx="98" cy="29" r="2.5" fill={accent} />
    </svg>
  );
}
