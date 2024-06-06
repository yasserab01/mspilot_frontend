import React, { useState, useEffect } from "react";

// Chakra imports
import {
  Box,
  Flex,
  Grid,
} from "@chakra-ui/react";

// Custom components
import TableReports from "views/admin/reports/components/TableReports"; // Updated component name
import Card from "components/card/Card.js";

// Assets
import { tableColumnsReports } from "views/admin/reports/variables/tableColumnsReports.js"; // Updated path and variable name

import api from "api";

export default function Reports(props) { // Updated function name
  const { searchQuery } = props;
  const [reports, setReports] = useState([]); // Initialize state to hold Reports data
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchReports = async () => { // Updated function name
      try {
        const response = await api.get("/api/reports/"); // Updated endpoint
        setReports(response.data); // Update state with fetched data
        console.log(response.data); // Log the fetched data
      } catch (error) {
        console.error("Failed to fetch Reports:", error); // Updated error message
      }
    };

    fetchReports();
  }, [refresh]); // Empty dependency array means this effect runs once on mount

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Grid>
        <Flex>
          <Card px='0px' mb='20px'>
            <TableReports // Updated component name
              tableData={reports} // Pass state data to TableReports component
              columnsData={tableColumnsReports} // Updated variable name
              refresh={setRefresh} // Pass state setter function to TableReports component
              searchQuery={searchQuery}
            />
          </Card>
        </Flex>
      </Grid>
    </Box>
  );
}
