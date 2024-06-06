import React, { useState, useEffect } from "react";

// Chakra imports
import {
  Box,
  Flex,
  Grid,
} from "@chakra-ui/react";

// Custom components
import TableSections from "views/admin/sections/components/TableSections.js";
import Card from "components/card/Card.js";

// Assets
import { tableColumnsSections } from "views/admin/sections/variables/tableColumnsSections.js";

import api from "api";

export default function Sections(props) {
  const { searchQuery } = props;
  const [Sections, setSections] = useState([]); // Initialize state to hold Sections data
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get("/api/sections/"); // Make sure the endpoint is correct
        setSections(response.data); // Update state with fetched data
        console.log(response.data); // Log the fetched data
      } catch (error) {
        console.error("Failed to fetch Sections:", error); // Error handling
      }
    };

    fetchSections();
  }, [refresh]); // Empty dependency array means this effect runs once on mount

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Grid>
        <Flex>
          <Card px='0px' mb='20px'>
            <TableSections
              tableData={Sections} // Pass state data to TableSections component
              columnsData={tableColumnsSections}
              refresh={setRefresh} // Pass state setter function to TableSections component
              searchQuery={searchQuery}
            />
          </Card>
        </Flex>
      </Grid>
    </Box>
  );
}
