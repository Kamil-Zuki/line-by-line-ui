import { Box, Flex, Heading, useColorMode, Button } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      as="header"
      bg="teal.500"
      p={4}
      color="white"
      justify="space-between"
      align="center"
      boxShadow="md"
    >
      <Heading size="md">LineByLine</Heading>
      <Button onClick={toggleColorMode} variant="ghost" colorScheme="teal">
        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      </Button>
    </Flex>
  );
}
