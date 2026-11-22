export default function IconButton({ label, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-slate-100 ${className}`}
    >
      {children}
    </button>
  );
}
