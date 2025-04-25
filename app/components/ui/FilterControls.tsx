import { Select, HStack, FormControl, FormLabel } from "@chakra-ui/react";

// Define generic types for flexibility
interface FilterControlsProps<TFilter extends string, TSort extends string> {
  languageFilter: TFilter;
  setLanguageFilter: (value: TFilter) => void;
  sortOption: TSort;
  setSortOption: (value: TSort) => void;
  languageOptions?: { value: TFilter; label: string }[];
  sortOptions?: { value: TSort; label: string }[];
}

export function FilterControls<TFilter extends string, TSort extends string>({
  languageFilter,
  setLanguageFilter,
  sortOption,
  setSortOption,
  languageOptions = [],
  sortOptions = [],
}: FilterControlsProps<TFilter, TSort>) {
  return (
    <HStack spacing={4}>
      <FormControl maxW="200px">
        <FormLabel>Filter</FormLabel>
        <Select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value as TFilter)}
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl maxW="200px">
        <FormLabel>Sort By</FormLabel>
        <Select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as TSort)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>
    </HStack>
  );
}
