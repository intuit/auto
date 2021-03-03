/** A GitHub style label */
export const Label = ({ children, color, className }) => (
  <span
    className={`bg-${color}-600 text-white px-2 py-1 rounded font-semibold text-xs ${className}`}
    style={{ verticalAlign: "middle" }}
  >
    {children}
  </span>
);
