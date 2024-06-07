import { Flex } from "@chakra-ui/react";
import React from "react";
import PropTypes from "prop-types";

const HSeparator = ({ variant, ...rest }) => {
  return <Flex h="1px" w="100%" bg="rgba(135, 140, 189, 0.3)" {...rest}></Flex>;
};

HSeparator.propTypes = {
  variant: PropTypes.string,
};

const VSeparator = ({ variant, ...rest }) => {
  return <Flex w="1px" bg="rgba(135, 140, 189, 0.3)" {...rest}></Flex>;
};

VSeparator.propTypes = {
  variant: PropTypes.string,
};

export { HSeparator, VSeparator };
