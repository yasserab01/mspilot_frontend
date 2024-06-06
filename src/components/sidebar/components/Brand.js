import React from "react";
import { Flex, Image, useColorMode } from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";

// Logos
import lightLogo from 'assets/img/logo-black.png';
import darkLogo from 'assets/img/logo-white.png';

export function SidebarBrand() {
  const { colorMode } = useColorMode();
  const logo = colorMode === "light" ? lightLogo : darkLogo;

  return (
    <Flex align="center" direction="column">
      <Image src={logo} alt="MsPilot Logo" />
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
