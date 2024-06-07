import React, { useState, useEffect } from "react";
import { Box, Flex, Grid } from "@chakra-ui/react";
import TableCompanies from "views/admin/companies/components/TableCompanies";
import Card from "components/card/Card.js";
import { tableColumnsCompanies } from "views/admin/companies/variables/tableColumnsCompanies.js";
import api from "api";

export default function Companies({ searchQuery }) {
  const [companies, setCompanies] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get("/api/companies/");
        setCompanies(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
    };

    fetchCompanies();
  }, [refresh]);

  return (
    <Box pt={{ base: "180px", md: "80px", xl: "80px" }}>
      <Grid>
        <Flex>
          <Card px="0px" mb="20px">
            <TableCompanies
              tableData={companies}
              columnsData={tableColumnsCompanies}
              refresh={setRefresh}
              searchQuery={searchQuery}
            />
          </Card>
        </Flex>
      </Grid>
    </Box>
  );
}
