"use client";

// Removed unused import

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

// Main DNA Helix Logo
export function Logo({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9 md:h-11 md:w-11",
    lg: "h-14 w-14 md:h-18 md:w-18",
  };

  const textSizes = {
    sm: "text-base font-semibold",
    md: "text-lg md:text-xl font-semibold",
    lg: "text-2xl md:text-3xl font-semibold",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative group">
        <div
          className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 shadow-lg shadow-slate-900/20 transition-transform duration-300 group-hover:scale-105 ${sizeClasses[size]}`}
        >
          {/* DNA Double Helix */}
          <svg
            viewBox="0 0 32 32"
            className="w-full h-full p-1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left strand */}
            <path
              d="M10 6 Q8 12, 10 18 Q12 24, 10 30"
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Right strand */}
            <path
              d="M22 6 Q24 12, 22 18 Q20 24, 22 30"
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Connecting base pairs */}
            <line
              x1="10"
              y1="9"
              x2="22"
              y2="9"
              stroke="#34d399"
              strokeWidth="1.5"
              opacity="0.8"
            />
            <line
              x1="11"
              y1="13"
              x2="21"
              y2="13"
              stroke="#34d399"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <line
              x1="10"
              y1="18"
              x2="22"
              y2="18"
              stroke="#34d399"
              strokeWidth="1.5"
              opacity="0.9"
            />
            <line
              x1="11"
              y1="23"
              x2="21"
              y2="23"
              stroke="#34d399"
              strokeWidth="1.5"
              opacity="0.6"
            />
            <line
              x1="10"
              y1="27"
              x2="22"
              y2="27"
              stroke="#34d399"
              strokeWidth="1.5"
              opacity="0.8"
            />

            {/* Glowing dots on strands */}
            <circle cx="10" cy="6" r="1.5" fill="#e2e8f0" />
            <circle cx="22" cy="6" r="1.5" fill="#e2e8f0" />
            <circle cx="10" cy="30" r="1.5" fill="#e2e8f0" />
            <circle cx="22" cy="30" r="1.5" fill="#e2e8f0" />
          </svg>
        </div>
      </div>

      {showText && (
        <span className={`text-foreground ${textSizes[size]}`}>Healix</span>
      )}
    </div>
  );
}

// Animated DNA Helix
export function LogoAnimated({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9 md:h-11 md:w-11",
    lg: "h-14 w-14 md:h-18 md:w-18",
  };

  const textSizes = {
    sm: "text-base font-semibold",
    md: "text-lg md:text-xl font-semibold",
    lg: "text-2xl md:text-3xl font-semibold",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative group">
        <div
          className={`relative flex items-center justify-center rounded-2xl bg-primary shadow-lg transition-transform duration-300 group-hover:scale-105 ${sizeClasses[size]}`}
        >
          <svg
            viewBox="0 0 32 32"
            className="w-full h-full p-1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* DNA strands with rotation animation */}
            <g>
              <path
                d="M10 6 Q8 12, 10 18 Q12 24, 10 30"
                stroke="#e2e8f0"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M22 6 Q24 12, 22 18 Q20 24, 22 30"
                stroke="#e2e8f0"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Animated connecting pairs */}
              <line
                x1="10"
                y1="10"
                x2="22"
                y2="10"
                stroke="#34d399"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="10"
                y1="16"
                x2="22"
                y2="16"
                stroke="#34d399"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <animate
                  attributeName="opacity"
                  values="1;0.4;1"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </line>
              <line
                x1="10"
                y1="22"
                x2="22"
                y2="22"
                stroke="#34d399"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur="2s"
                  repeatCount="indefinite"
                  begin="0.5s"
                />
              </line>
            </g>
          </svg>
        </div>
      </div>

      {showText && (
        <span className={`text-foreground ${textSizes[size]}`}>Healix</span>
      )}
    </div>
  );
}

// Stylized H with DNA
export function LogoH({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9 md:h-11 md:w-11",
    lg: "h-14 w-14 md:h-18 md:w-18",
  };

  const textSizes = {
    sm: "text-base font-semibold",
    md: "text-lg md:text-xl font-semibold",
    lg: "text-2xl md:text-3xl font-semibold",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative group">
        <div
          className={`relative flex items-center justify-center rounded-2xl bg-primary shadow-lg transition-transform duration-300 group-hover:scale-105 ${sizeClasses[size]}`}
        >
          <svg
            viewBox="0 0 32 32"
            className="w-full h-full p-2"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* H shape with DNA helix integrated */}
            <path
              d="M9 6 L9 26"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M23 6 L23 26"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* DNA helix in the middle bar */}
            <path
              d="M9 16 Q12 14, 16 16 Q20 18, 23 16"
              stroke="hsl(var(--accent))"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M9 16 Q12 18, 16 16 Q20 14, 23 16"
              stroke="hsl(var(--accent))"
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />

            {/* Accent dots */}
            <circle
              cx="9"
              cy="6"
              r="1.5"
              fill="hsl(var(--primary-foreground))"
            />
            <circle
              cx="23"
              cy="6"
              r="1.5"
              fill="hsl(var(--primary-foreground))"
            />
            <circle cx="16" cy="16" r="2" fill="hsl(var(--accent))">
              <animate
                attributeName="opacity"
                values="1;0.5;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>

      {showText && (
        <span className={`text-foreground ${textSizes[size]}`}>Healix</span>
      )}
    </div>
  );
}

// Circular DNA
export function LogoCircular({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9 md:h-11 md:w-11",
    lg: "h-14 w-14 md:h-18 md:w-18",
  };

  const textSizes = {
    sm: "text-base font-semibold",
    md: "text-lg md:text-xl font-semibold",
    lg: "text-2xl md:text-3xl font-semibold",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative group">
        <div
          className={`relative flex items-center justify-center rounded-2xl bg-primary shadow-lg transition-transform duration-300 group-hover:scale-105 ${sizeClasses[size]}`}
        >
          <svg
            viewBox="0 0 32 32"
            className="w-full h-full p-1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Circular DNA representation */}
            <circle
              cx="16"
              cy="16"
              r="11"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="2"
              opacity="0.3"
            />

            {/* DNA spiral inside circle */}
            <path
              d="M16 5 Q10 10, 16 16 Q22 22, 16 27"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M16 5 Q22 10, 16 16 Q10 22, 16 27"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="2"
              fill="none"
            />

            {/* Connection points */}
            <line
              x1="13"
              y1="10"
              x2="19"
              y2="10"
              stroke="hsl(var(--accent))"
              strokeWidth="1.5"
            />
            <line
              x1="13"
              y1="16"
              x2="19"
              y2="16"
              stroke="hsl(var(--accent))"
              strokeWidth="1.5"
            />
            <line
              x1="13"
              y1="22"
              x2="19"
              y2="22"
              stroke="hsl(var(--accent))"
              strokeWidth="1.5"
            />

            {/* Center glow */}
            <circle
              cx="16"
              cy="16"
              r="2"
              fill="hsl(var(--accent))"
              opacity="0.8"
            >
              <animate
                attributeName="r"
                values="2;3;2"
                dur="2s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.8;0.4;0.8"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>

      {showText && (
        <span className={`text-foreground ${textSizes[size]}`}>Healix</span>
      )}
    </div>
  );
}

// Minimal DNA strand
export function LogoMinimal({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9 md:h-11 md:w-11",
    lg: "h-14 w-14 md:h-18 md:w-18",
  };

  const textSizes = {
    sm: "text-base font-semibold",
    md: "text-lg md:text-xl font-semibold",
    lg: "text-2xl md:text-3xl font-semibold",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative group">
        <div
          className={`relative flex items-center justify-center rounded-xl bg-primary shadow-md transition-all duration-300 group-hover:shadow-lg ${sizeClasses[size]}`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-full h-full p-1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Simplified helix */}
            <path
              d="M8 4 Q6 8, 8 12 Q10 16, 8 20"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M16 4 Q18 8, 16 12 Q14 16, 16 20"
              stroke="hsl(var(--primary-foreground))"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Simple connections */}
            <line
              x1="8"
              y1="8"
              x2="16"
              y2="8"
              stroke="hsl(var(--accent))"
              strokeWidth="1.5"
            />
            <line
              x1="8"
              y1="12"
              x2="16"
              y2="12"
              stroke="hsl(var(--accent))"
              strokeWidth="1.5"
            />
            <line
              x1="8"
              y1="16"
              x2="16"
              y2="16"
              stroke="hsl(var(--accent))"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      {showText && (
        <span className={`text-foreground ${textSizes[size]}`}>Healix</span>
      )}
    </div>
  );
}
