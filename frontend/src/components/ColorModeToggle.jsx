import { Button } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ColorModeToggle = ({ colorMode, toggleColorMode }) => {
  return (
    <Button onClick={toggleColorMode}>
      {colorMode === "dark" ? (
        <SunIcon color="orange.200" />
      ) : (
        <MoonIcon color="blue.700" />
      )}
    </Button>
  );
};

export default ColorModeToggle;
