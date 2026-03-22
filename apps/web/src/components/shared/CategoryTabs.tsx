import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  categories: string[];
  active: string;
  onValueChange: (value: string) => void;
  allLabel?: string;
  className?: string;
}

export function CategoryTabs({
  categories,
  active,
  onValueChange,
  allLabel = "Todos",
  className = "mb-6",
}: CategoryTabsProps) {
  if (categories.length === 0) return null;

  return (
    <Tabs value={active} onValueChange={onValueChange} className={className}>
      <TabsList>
        <TabsTrigger value="all" className="text-xs">
          {allLabel}
        </TabsTrigger>
        {categories.map((cat) => (
          <TabsTrigger key={cat} value={cat} className="text-xs">
            {cat}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
