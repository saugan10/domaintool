interface ProgressRingProps {
  size: number;
  progress: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function ProgressRing({ 
  size, 
  progress, 
  strokeWidth = 4, 
  className = "",
  children 
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getStrokeColor = () => {
    if (progress >= 70) return "#059669"; // QuickBooks green
    if (progress >= 30) return "#D97706"; // QuickBooks amber
    return "#DC2626"; // QuickBooks red
  };

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        className="progress-ring absolute inset-0"
        width={size}
        height={size}
      >
        <circle
          className="text-gray-300"
          strokeWidth={strokeWidth}
          stroke="#E5E7EB"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="progress-ring-circle"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke={getStrokeColor()}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
