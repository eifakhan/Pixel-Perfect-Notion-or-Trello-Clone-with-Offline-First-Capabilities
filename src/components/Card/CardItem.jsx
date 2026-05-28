import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, CheckSquare, MessageSquare } from "lucide-react";
import { Tag, PriorityBadge } from "../UI/Badge";
import { format, isPast, parseISO } from "date-fns";

export function CardItem({ card, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const doneChecks = card.checklist?.filter((i) => i.done).length || 0;
  const totalChecks = card.checklist?.length || 0;
  const isOverdue = card.dueDate && isPast(parseISO(card.dueDate));

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="group bg-white rounded-xl border border-surface-200 p-3.5 shadow-card hover:shadow-card-hover hover:border-surface-300 cursor-pointer transition-all duration-150 card-enter select-none"
    >
      {/* Tags row */}
      {card.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.tags.slice(0, 3).map((t) => <Tag key={t} label={t} />)}
          {card.tags.length > 3 && (
            <span className="text-[10px] text-surface-400">+{card.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Title */}
      <p className="text-sm font-medium text-surface-800 leading-snug line-clamp-2 mb-2.5">
        {card.title}
      </p>

      {/* Description snippet */}
      {card.description && (
        <p className="text-xs text-surface-400 line-clamp-2 mb-2.5">{card.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 flex-wrap">
        <PriorityBadge priority={card.priority} />

        {card.dueDate && (
          <span className={`flex items-center gap-1 text-[11px] font-medium ${isOverdue ? "text-red-mid" : "text-surface-400"}`}>
            <Calendar size={11} />
            {format(parseISO(card.dueDate), "MMM d")}
          </span>
        )}

        {totalChecks > 0 && (
          <span className={`flex items-center gap-1 text-[11px] font-medium ${doneChecks === totalChecks ? "text-green-mid" : "text-surface-400"}`}>
            <CheckSquare size={11} />
            {doneChecks}/{totalChecks}
          </span>
        )}

        {card.description && (
          <span className="ml-auto text-surface-300 group-hover:text-surface-400 transition-colors">
            <MessageSquare size={12} />
          </span>
        )}
      </div>
    </div>
  );
}
