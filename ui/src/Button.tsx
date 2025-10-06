export type ButtonProps = {
  children: any;
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({ children, onClick, disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 14px",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        background: disabled ? "#e5e7eb" : "#111827",
        color: disabled ? "#6b7280" : "white",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}
