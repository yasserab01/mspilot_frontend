import React, { useState, useEffect, useMemo } from "react";
import {
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import debounce from "lodash.debounce";

export function SearchBar({
  variant,
  background,
  placeholder = "Search...",
  borderRadius = "30px",
  onSearch,
  value,
  ...rest
}) {
  // Chakra Color Mode
  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");

  // State to store the search query
  const [query, setQuery] = useState(value || "");

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((searchQuery) => {
      if (onSearch) {
        onSearch(searchQuery);
      }
    }, 300),
    [onSearch]
  );

  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
  };

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Update the query if the value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);

  return (
    <form onSubmit={handleSearch}>
      <InputGroup w={{ base: "100%", md: "200px" }} {...rest}>
        <InputLeftElement>
          <IconButton
            bg="inherit"
            borderRadius="inherit"
            aria-label="Search"
            _hover={{ bg: "none" }}
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{ boxShadow: "none" }}
            icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
            type="submit"
          />
        </InputLeftElement>
        <Input
          variant={variant || "search"}
          fontSize="sm"
          bg={background || inputBg}
          color={inputText}
          fontWeight="500"
          _placeholder={{ color: "gray.400", fontSize: "14px" }}
          borderRadius={borderRadius}
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
        />
      </InputGroup>
    </form>
  );
}
