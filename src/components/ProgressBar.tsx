import clsx from 'clsx';

interface ProgressBarProps {
  value: number;
  className?: string;
}

export default function ProgressBar({ value, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={clsx('h-1.5 w-full overflow-hidden rounded-full bg-river-800', className)}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-sun-500 to-sun-300 transition-all duration-1000"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
