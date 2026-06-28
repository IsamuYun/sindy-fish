function ChevronIcon({ children, ...props }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ChevronDown(props) {
  return (
    <ChevronIcon {...props}>
      <polyline points="6 3 12 9 18 3" />
      <polyline points="6 14 12 20 18 14" />
    </ChevronIcon>
  );
}

export function ChevronUp(props) {
  return (
    <ChevronIcon {...props}>
      <polyline points="6 10 12 4 18 10" />
      <polyline points="6 21 12 15 18 21" />
    </ChevronIcon>
  );
}

export function ChevronLeft(props) {
  return (
    <ChevronIcon {...props}>
      <polyline points="10 6 4 12 10 18" />
      <polyline points="21 6 15 12 21 18" />
    </ChevronIcon>
  );
}

export function ChevronRight(props) {
  return (
    <ChevronIcon {...props}>
      <polyline points="3 6 9 12 3 18" />
      <polyline points="14 6 20 12 14 18" />
    </ChevronIcon>
  );
}
