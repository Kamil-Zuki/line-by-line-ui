import { Box, Heading } from "@chakra-ui/react";

export default function MainPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      bg="white"
      color="black"
      fontSize="5xl"
      h="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Heading>Welcome to LineByLine</Heading>
    </Box>
  );
}
