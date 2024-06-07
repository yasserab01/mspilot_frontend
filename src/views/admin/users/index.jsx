import React, { useState, useEffect, useCallback } from "react";
import { Box, Flex, Grid } from "@chakra-ui/react";
import TableUsers from "views/admin/users/components/TableUsers";
import Card from "components/card/Card.js";
import { tableColumnsUsers } from "views/admin/users/variables/tableColumnsUsers";
import api from "api";

export default function Users(props) {
  const { searchQuery } = props;
  const [users, setUsers] = useState([]); // Initialize state to hold users data
  const [refresh, setRefresh] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get("/api/users/"); // Make sure the endpoint is correct
      setUsers(response.data); // Update state with fetched data
      console.log(response.data); // Log the fetched data
    } catch (error) {
      console.error("Failed to fetch users:", error); // Error handling
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refresh]); // Ensure fetchUsers and refresh are included in dependency array

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
