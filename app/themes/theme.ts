import { extendTheme } from "@chakra-ui/react";

// Clean, minimalistic theme
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        lineHeight: "tall",
      },
    },
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
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
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
    },
    Card: {
      baseStyle: {
        container: {
          bg: "white",
          boxShadow: "sm",
          borderRadius: "lg",
          borderWidth: "1px",
          borderColor: "gray.200",
        },
      },
    },
  },
});

export default theme;