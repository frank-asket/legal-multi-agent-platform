"use client";

type Props = {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "password";
};

export function UnderlineField({
  label,
  hint,
  value,
  onChange,
  placeholder,
  type = "text",
}: Props) {
  return (
    <label className="group block w-full">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500 transition group-focus-within:text-[#0c0f14]">
        {label}
      </span>
      {hint ? (
        <span className="mt-0.5 block text-xs text-slate-400">{hint}</span>
      ) : null}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="mt-2 w-full border-0 border-b border-slate-200 bg-transparent py-2 text-[#0c0f14] outline-none transition duration-300 placeholder:text-slate-300 focus:border-[#0c0f14] focus:shadow-[0_1px_0_0_rgb(12_15_20)]"
      />
    </label>
  );
}
