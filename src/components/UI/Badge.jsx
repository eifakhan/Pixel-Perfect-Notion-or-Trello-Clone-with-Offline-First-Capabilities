const tagColors = {
  devops: "bg-blue-soft text-blue-deep",
  infra: "bg-purple-soft text-purple-mid",
  design: "bg-yellow-soft text-yellow-mid",
  ux: "bg-yellow-soft text-yellow-mid",
  product: "bg-green-soft text-green-mid",
  backend: "bg-red-soft text-red-mid",
  frontend: "bg-blue-soft text-blue-deep",
  auth: "bg-purple-soft text-purple-mid",
  default: "bg-surface-100 text-surface-600",
};

export function Tag({ label }) {
  const cls = tagColors[label] || tagColors.default;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide ${cls}`}>
      {label}
    </span>
  );
}

const priorityMap = {
  high: { label: "High", cls: "bg-red-soft text-red-mid" },
  medium: { label: "Med", cls: "bg-yellow-soft text-yellow-mid" },
  low: { label: "Low", cls: "bg-green-soft text-green-mid" },
};

export function PriorityBadge({ priority }) {
  const p = priorityMap[priority] || priorityMap.medium;
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${p.cls}`}>
      {p.label}
    </span>
  );
}
