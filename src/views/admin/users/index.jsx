import React, { useState, useEffect } from "react";

// Chakra imports
import {
  Box,
  Flex,
  Grid,
} from "@chakra-ui/react";

// Custom components
import TableUsers from "views/admin/users/components/TableUsers";
import Card from "components/card/Card.js";

// Assets
import { tableColumnsUsers } from "views/admin/users/variables/tableColumnsUsers";

import api from "api";

export default function Users(props) {
  const {searchQuery} = props;
  const [users, setUsers] = useState([]); // Initialize state to hold users data
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/api/users/"); // Make sure the endpoint is correct
        setUsers(response.data); // Update state with fetched data
        console.log(response.data); // Log the fetched data
      } catch (error) {
        console.error("Failed to fetch users:", error); // Error handling
      }
    };

    fetchUsers();
  }, [refresh]); // Empty dependency array means this effect runs once on mount

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Grid>
        <Flex>
          <Card px='0px' mb='20px'>
            <TableUsers
              tableData={users} // Pass state data to TableUsers component
              columnsData={tableColumnsUsers}
              refresh={setRefresh} // Pass state setter function to TableUsers component
              searchQuery={searchQuery}
            />
          </Card>
        </Flex>
      </Grid>
    </Box>
  );
}
