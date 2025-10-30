import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

// Theme configuration
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

// Clean, minimalistic theme with dark mode support
const theme = extendTheme({
  config,
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.900" : "gray.50",
        color: props.colorMode === "dark" ? "gray.100" : "gray.800",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        lineHeight: "tall",
      },
    }),
  },
  colors: {
    brand: {
      50: "#E6F7FF",
      100: "#BAE7FF",
      200: "#91D5FF",
      300: "#69C0FF",
      400: "#40A9FF",
      500: "#1890FF",
      600: "#096DD9",
      700: "#0050B3",
      800: "#003A8C",
      900: "#002766",
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
      baseStyle: {
        fontWeight: "semibold",
        borderRadius: "md",
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: "brand.500",
      },
      variants: {
        outline: (props: any) => ({
          field: {
            bg: props.colorMode === "dark" ? "gray.800" : "white",
            borderColor: props.colorMode === "dark" ? "gray.600" : "gray.300",
            _hover: {
              borderColor: props.colorMode === "dark" ? "gray.500" : "gray.400",
            },
          },
        }),
      },
    },
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: props.colorMode === "dark" ? "gray.800" : "white",
          boxShadow: props.colorMode === "dark" ? "dark-lg" : "sm",
          borderRadius: "lg",
          borderWidth: "1px",
          borderColor: props.colorMode === "dark" ? "gray.700" : "gray.200",
        },
      }),
    },
    Box: {
      variants: {
        card: (props: any) => ({
          bg: props.colorMode === "dark" ? "gray.800" : "white",
          borderRadius: "lg",
          borderWidth: "1px",
          borderColor: props.colorMode === "dark" ? "gray.700" : "gray.200",
          boxShadow: props.colorMode === "dark" ? "dark-lg" : "sm",
        }),
      },
    },
  },
});

export default theme;