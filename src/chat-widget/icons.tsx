export function BroomIcon({
  className,
  size = 22,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M14.2 3.4 L9.6 15.2"
        stroke="#3d2a24"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M5.2 16.2 C6.8 14.4 10.2 14.1 12.4 15.6 C10.8 17.8 8.2 19.6 5.8 20.2 C5.2 18.8 4.9 17.4 5.2 16.2 Z"
        fill="#e8a07a"
      />
      <path
        d="M7.4 15.1 C9.1 14.2 11.6 14.6 13.2 16.2 C12.1 18.1 10.2 19.5 8.1 20.1 C7.4 18.5 7.1 16.8 7.4 15.1 Z"
        fill="#f0b892"
        opacity="0.9"
      />
      <path
        d="M9.5 15.4 C11 15.1 12.8 15.8 13.9 17.2 C13.2 18.8 11.6 19.8 10 20.1 C9.4 18.6 9.2 16.9 9.5 15.4 Z"
        fill="#d97757"
      />
    </svg>
  );
}

export function SendIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 2L11 13" />
      <path d="M22 2L15 22L11 13L2 9L22 2Z" />
    </svg>
  );
}

export function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6L6 18" />
      <path d="M6 6L18 18" />
    </svg>
  );
}
