import { useState, useMemo } from "react";

export function useCategoryFilter<T>(
  items: T[] | undefined,
  getCategory: (item: T) => string,
) {
  const [active, setActive] = useState("all");

  const categories = useMemo(
    () => (items ? [...new Set(items.map(getCategory))] : []),
    [items, getCategory],
  );

  const filtered = useMemo(
    () => (active === "all" ? items : items?.filter((i) => getCategory(i) === active)),
    [items, active, getCategory],
  );

  return { active, setActive, categories, filtered };
}
