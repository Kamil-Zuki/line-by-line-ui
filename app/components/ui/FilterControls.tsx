import { Select, HStack, FormControl, FormLabel } from "@chakra-ui/react";
import { css } from "@emotion/react";

interface FilterOptionConfig<TFilter extends string> {
  value: TFilter;
  label: string;
}

interface SortOptionConfig<TSort extends string> {
  value: TSort;
  label: string;
}

interface FilterControlsProps<TFilter extends string, TSort extends string> {
  filter: TFilter;
  setFilter: (value: TFilter) => void;
  sortOption: TSort;
  setSortOption: (value: TSort) => void;
  filterOptions: FilterOptionConfig<TFilter>[];
  sortOptions: SortOptionConfig<TSort>[];
}

export function FilterControls<TFilter extends string, TSort extends string>({
  filter,
  setFilter,
  sortOption,
  setSortOption,
  filterOptions,
  sortOptions,
}: FilterControlsProps<TFilter, TSort>) {
  // Custom CSS to style the <option> elements
  const selectStyles = css`
    & option {
      background-color: #2D3748; /* gray.800 */
      color: white;
    }
    &:focus option {
      background-color: #2D3748; /* gray.800 */
      color: white;
    }
  `;

  return (
    <HStack
      spacing={{ base: 2, md: 4 }}
      flexWrap={{ base: "wrap", sm: "nowrap" }}
    >
      <FormControl id="deck-filter" maxW={{ base: "100%", sm: "200px" }}>
        <FormLabel fontSize="sm" mb={1} color="gray.400">
          Filter Decks
        </FormLabel>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value as TFilter)}
          borderColor="gray.600"
          bg="gray.800"
          color="white"
          _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
          aria-label="Filter decks"
          css={selectStyles}
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl id="deck-sort" maxW={{ base: "100%", sm: "200px" }}>
        <FormLabel fontSize="sm" mb={1} color="gray.400">
          Sort By
        </FormLabel>
        <Select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as TSort)}
          borderColor="gray.600"
          bg="gray.800"
          color="white"
          _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
          aria-label="Sort decks"
          css={selectStyles}
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