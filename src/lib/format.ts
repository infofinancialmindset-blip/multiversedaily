import { format } from "date-fns";
import { it } from "date-fns/locale";

export function formatDate(iso: string): string {
  return format(new Date(iso), "d MMMM yyyy", { locale: it });
}

export function formatDateShort(iso: string): string {
  return format(new Date(iso), "d MMM yyyy", { locale: it });
}

export function toIsoDate(iso: string): string {
  return new Date(iso).toISOString();
}
