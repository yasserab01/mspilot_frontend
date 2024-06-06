import React, { useState, useEffect } from "react";

// Chakra imports
import {
  Box,
  Flex,
  Grid,
} from "@chakra-ui/react";

// Custom components
import TableRepositories from "views/admin/repositories/components/TableRepositories";
import Card from "components/card/Card.js";

// Assets
import { tableColumnsRepositories } from "views/admin/repositories/variables/tableColumnsRepositories.js";

import api from "api";

export default function Repositories(props) {
  const { searchQuery } = props;
  const [repositories, setRepositories] = useState([]); // Initialize state to hold Repositories data
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await api.get("/api/repositories/"); // Make sure the endpoint is correct
        setRepositories(response.data); // Update state with fetched data
        console.log(response.data); // Log the fetched data
      } catch (error) {
        console.error("Failed to fetch Repositories:", error); // Error handling
      }
    };

    fetchRepositories();
  }, [refresh]); // Empty dependency array means this effect runs once on mount

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Grid>
        <Flex>
          <Card px='0px' mb='20px'>
            <TableRepositories
              tableData={repositories} // Pass state data to TableRepositories component
              columnsData={tableColumnsRepositories}
              refresh={setRefresh} // Pass state setter function to TableRepositories component
              searchQuery={searchQuery}
            />
          </Card>
        </Flex>
      </Grid>
    </Box>
  );
}
