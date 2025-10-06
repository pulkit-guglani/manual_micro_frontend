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
      className={
        `px-3 py-2 rounded-lg !bg-amber-300 border border-gray-200 transition-colors ` +
        (disabled
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : "bg-gray-900 text-white hover:bg-gray-800")
      }
    >
      {children}
    </button>
  );
}
