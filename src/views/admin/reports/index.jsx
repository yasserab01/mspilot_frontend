import React, { useState, useEffect } from "react";

// Chakra imports
import { Box, Flex, Grid } from "@chakra-ui/react";

// Custom components
import TableReports from "views/admin/reports/components/TableReports";
import Card from "components/card/Card.js";

// Assets
import { tableColumnsReports } from "views/admin/reports/variables/tableColumnsReports.js";

import api from "api";

export default function Reports(props) {
  const { searchQuery } = props;
  const [reports, setReports] = useState([]); // Initialize state to hold Reports data
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get("/api/reports/");
        setReports(response.data); // Update state with fetched data
        console.log(response.data); // Log the fetched data
      } catch (error) {
        console.error("Failed to fetch Reports:", error);
      }
    };

    fetchReports();
  }, [refresh]); // Refresh dependency array to trigger re-fetch on state change

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Grid>
        <Flex>
          <Card px='0px' mb='20px'>
            <TableReports
              tableData={reports} // Pass state data to TableReports component
              columnsData={tableColumnsReports} // Pass columns data to TableReports component
              refresh={setRefresh} // Pass state setter function to TableReports component
              searchQuery={searchQuery} // Pass search query to TableReports component
            />
          </Card>
        </Flex>
      </Grid>
    </Box>
  );
}
