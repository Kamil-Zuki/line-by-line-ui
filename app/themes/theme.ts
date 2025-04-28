import { extendTheme } from "@chakra-ui/react";

// Define the Dark Age Comic Art theme
const theme = extendTheme({
  // Global styles
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "gray.100", // Slightly lighter for better contrast against gray.900
        fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif", // Comic-style font stack
        lineHeight: "base",
        backgroundImage: "url('https://www.transparenttextures.com/patterns/paper-fibers.png')", // Subtle grain texture
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      },
      "*": {
        borderColor: "gray.300", // Softer border color for better contrast
      },
      "*:focus": {
        outline: "2px solid",
        outlineColor: "blue.400", // More prominent focus state for accessibility
        outlineOffset: "2px",
      },
    },
  },
  colors: {
    brand: {
      primary: "red.600", // Bold red for primary actions
      secondary: "blue.400", // Slightly lighter blue for better visibility
      tertiary: "green.400", // Adjusted for contrast
      accent: "yellow.300", // Added for highlights or warnings
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "extrabold",
        textTransform: "uppercase",
        borderRadius: "0",
        border: "2px solid",
        borderColor: "gray.300",
        transition: "all 0.2s ease-in-out", // Smooth transitions for hover effects
        _hover: {
          boxShadow: "0 0 12px rgba(255, 255, 255, 0.4)", // Slightly brighter glow
        },
      },
      variants: {
        solid: {
          bg: "brand.primary",
          color: "white",
          _hover: {
            bg: "red.700",
            boxShadow: "0 0 12px rgba(229, 62, 62, 0.8)", // Stronger glow on hover
          },
          _active: {
            bg: "red.800",
          },
        },
        outline: {
          borderColor: "brand.secondary",
          color: "brand.secondary",
          _hover: {
            bg: "brand.secondary",
            color: "white",
            boxShadow: "0 0 12px rgba(49, 130, 206, 0.8)",
          },
          _active: {
            bg: "blue.500",
          },
        },
      },
    },
    Text: {
      baseStyle: {
        fontWeight: "bold",
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.8)", // Retained for comic effect
        color: "gray.100", // Ensure high contrast
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: "extrabold",
        textTransform: "uppercase",
        letterSpacing: "wide",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.9)",
        color: "gray.50", // Slightly brighter for headings
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: "gray.800", // Darker input background for contrast
          color: "gray.100",
          borderColor: "gray.300",
          borderRadius: "0",
          borderWidth: "2px",
          _placeholder: {
            color: "gray.500", // Slightly lighter placeholder for readability
          },
          _focus: {
            borderColor: "blue.400",
            boxShadow: "0 0 0 2px rgba(49, 130, 206, 0.5)", // Softer focus glow
          },
        },
      },
    },
    FormLabel: {
      baseStyle: {
        fontSize: "sm",
        fontWeight: "extrabold",
        color: "gray.400",
        textTransform: "uppercase",
      },
    },
    Card: {
      baseStyle: {
        bg: "gray.800",
        border: "2px solid",
        borderColor: "gray.300",
        borderRadius: "0",
        boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.6)", // Comic book panel effect
        transition: "transform 0.1s ease-in-out",
        _hover: {
          transform: "translateY(-2px)", // Slight lift on hover
          boxShadow: "4px 4px 12px rgba(0, 0, 0, 0.8)",
        },
      },
    },
    Box: {
      variants: {
        panel: {
          bg: "gray.800",
          border: "2px solid",
          borderColor: "gray.300",
          borderRadius: "0",
          p: 4,
          boxShadow: "3px 3px 6px rgba(0, 0, 0, 0.5)",
        },
      },
    },
    Link: {
      baseStyle: {
        color: "brand.secondary",
        fontWeight: "bold",
        textDecoration: "underline",
        _hover: {
          color: "blue.300",
          textDecoration: "none",
          boxShadow: "0 0 8px rgba(49, 130, 206, 0.5)", // Glow effect on hover
        },
        _focus: {
          boxShadow: "0 0 0 2px rgba(49, 130, 206, 0.5)",
        },
      },
    },
  },
});

export default theme;