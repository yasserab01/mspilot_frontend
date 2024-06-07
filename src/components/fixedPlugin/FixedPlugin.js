// Chakra Imports
import { Button, Icon, useColorMode } from "@chakra-ui/react";
// Custom Icons
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import React from "react";

export default function FixedPlugin(props) {
  const { ...rest } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const bgButton = "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)";
  const isRTL = document?.documentElement?.dir === "rtl";

  return (
    <Button
      {...rest}
      h='60px'
      w='60px'
      zIndex='99'
      bg={bgButton}
      position='fixed'
      variant='no-effects'
      left={isRTL ? "35px" : ""}
      right={isRTL ? "" : "35px"}
      bottom='30px'
      border='1px solid'
      borderColor='#6A53FF'
      borderRadius='50px'
      onClick={toggleColorMode}
      display='flex'
      p='0px'
      align='center'
      justify='center'>
      <Icon
        h='24px'
        w='24px'
        color='white'
        as={colorMode === "light" ? IoMdMoon : IoMdSunny}
      />
    </Button>
  );
}
