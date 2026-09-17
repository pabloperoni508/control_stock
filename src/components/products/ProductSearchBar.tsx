import { Input } from "@/components/ui/Input";

interface ProductSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductSearchBar({ value, onChange }: ProductSearchBarProps) {
  return (
    <Input
      type="search"
      placeholder="Buscar producto..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ maxWidth: "320px" }}
    />
  );
}