import { Icon } from "@/components/ui/Icon";
import { faStar, faStarOutline } from "@/components/icons";

export function Stars({ value, max = 3, size = "text-xl" }: { value: number; max?: number; size?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${size}`} aria-label={`${value}/${max} sao`}>
      {Array.from({ length: max }, (_, i) => (
        <Icon key={i} icon={i < value ? faStar : faStarOutline} className={i < value ? "text-sun-400" : "text-forest-200"} />
      ))}
    </span>
  );
}
