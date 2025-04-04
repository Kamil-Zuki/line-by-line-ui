import { Select, HStack, Button } from "@chakra-ui/react";

interface FilterControlsProps {
  languageFilter: string;
  setLanguageFilter: (value: string) => void;
  sortOption: "trending" | "newest" | "top";
  setSortOption: (value: "trending" | "newest" | "top") => void;
}

export function FilterControls({
  languageFilter,
  setLanguageFilter,
  sortOption,
  setSortOption,
}: FilterControlsProps) {
  return (
    <HStack mb={6} spacing={4}>
      <Select
        w="200px"
        bgGradient="linear(to-r, #F5546A, #558AFE)"
        color="white"
        value={languageFilter}
        onChange={(e) => setLanguageFilter(e.target.value)}
      >
        <option value="all">All Languages</option>
        <option value="English">English</option>
        <option value="Spanish">Spanish</option>
        <option value="French">French</option>
      </Select>
      <HStack spacing={2}>
        <Button
          variant={sortOption === "trending" ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => setSortOption("trending")}
        >
          Trending
        </Button>
        <Button
          variant={sortOption === "newest" ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => setSortOption("newest")}
        >
          Newest
        </Button>
        <Button
          variant={sortOption === "top" ? "solid" : "outline"}
          colorScheme="blue"
          onClick={() => setSortOption("top")}
        >
          Top
        </Button>
      </HStack>
    </HStack>
  );
}
