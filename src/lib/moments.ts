import { Sunrise, Apple, Utensils, Sandwich, Moon, type LucideIcon } from "lucide-react";

export type Moment =
  | "desayuno"
  | "media_manana"
  | "almuerzo"
  | "media_tarde"
  | "cena";

export const MOMENTS: { id: Moment; label: string; icon: LucideIcon }[] = [
  { id: "desayuno", label: "Desayuno", icon: Sunrise },
  { id: "media_manana", label: "Medias nueves", icon: Apple },
  { id: "almuerzo", label: "Almuerzo", icon: Utensils },
  { id: "media_tarde", label: "Media tarde", icon: Sandwich },
  { id: "cena", label: "Cena", icon: Moon },
];

export function momentLabel(moment: Moment): string {
  return MOMENTS.find((m) => m.id === moment)?.label ?? moment;
}

export function toLocalISODate(date: Date): string {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

export function todayISO(): string {
  return toLocalISODate(new Date());
}
