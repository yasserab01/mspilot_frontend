import React, { useState, useEffect } from "react";

// Chakra imports
import {
  Box,
  Flex,
  Grid,
} from "@chakra-ui/react";

// Custom components
import TableCompanies from "views/admin/companies/components/TableCompanies";
import Card from "components/card/Card.js";

// Assets
import { tableColumnsCompanies } from "views/admin/companies/variables/tableColumnsCompanies.js";

import api from "api";

export default function Companies(props) {
  const { searchQuery } = props;
  const [Companies, setCompanies] = useState([]); // Initialize state to hold Companies data
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get("/api/companies/"); // Make sure the endpoint is correct
        setCompanies(response.data); // Update state with fetched data
        console.log(response.data); // Log the fetched data
      } catch (error) {
        console.error("Failed to fetch Companies:", error); // Error handling
      }
    };

    fetchCompanies();
  }, [refresh]); // Empty dependency array means this effect runs once on mount

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Grid>
        <Flex>
          <Card px='0px' mb='20px'>
            <TableCompanies
              tableData={Companies} // Pass state data to TableCompanies component
              columnsData={tableColumnsCompanies}
              refresh={setRefresh} // Pass state setter function to TableCompanies component
              searchQuery={searchQuery}
            />
          </Card>
        </Flex>
      </Grid>
    </Box>
  );
}
