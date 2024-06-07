import React, { useState, useEffect, useMemo } from "react";

// Chakra imports
import { Box, Flex, Grid } from "@chakra-ui/react";

// Custom components
import TableRepositories from "views/admin/repositories/components/TableRepositories";
import Card from "components/card/Card.js";

// Assets
import { tableColumnsRepositories } from "views/admin/repositories/variables/tableColumnsRepositories.js";

import api from "api";

export default function Repositories({ searchQuery }) {
  const [repositories, setRepositories] = useState([]); // Initialize state to hold Repositories data
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await api.get("/api/repositories/"); // Make sure the endpoint is correct
        setRepositories(response.data); // Update state with fetched data
        console.log(response.data); // Log the fetched data
      } catch (error) {
        console.error("Failed to fetch repositories:", error); // Error handling
      }
    };

    fetchRepositories();
  }, [refresh]);

  const memoizedColumns = useMemo(() => tableColumnsRepositories, []);

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Grid>
        <Flex>
          <Card px='0px' mb='20px'>
            <TableRepositories
              tableData={repositories} // Pass state data to TableRepositories component
              columnsData={memoizedColumns}
              refresh={setRefresh} // Pass state setter function to TableRepositories component
              searchQuery={searchQuery}
            />
          </Card>
        </Flex>
      </Grid>
    </Box>
  );
}
