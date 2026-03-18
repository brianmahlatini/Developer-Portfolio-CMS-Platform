import { format } from "date-fns";

export function formatDate(date: Date | string) {
  return format(new Date(date), "MMM d, yyyy");
}

export function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
