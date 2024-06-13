import React, { useState, useEffect } from "react";
import { Box, Flex, Grid } from "@chakra-ui/react";
import TableSections from "views/admin/sections/components/TableSections";
import Card from "components/card/Card";
import { tableColumnsSections } from "views/admin/sections/variables/tableColumnsSections";
import api from "api";

export default function Sections({ searchQuery }) {
  const [sections, setSections] = useState([]); // Initialize state to hold Sections data
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get("/api/sections/"); // Ensure the endpoint is correct
        setSections(response.data); // Update state with fetched data
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching sections:", error); // Improved error message
      }
    };

    fetchSections();
  }, [refresh]); // Refresh data when the refresh state changes

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Grid>
        <Flex>
          <Card px='0px' mb='20px'>
            <TableSections
              tableData={sections} // Pass state data to TableSections component
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
