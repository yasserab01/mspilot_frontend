import {
  Button,
  Flex,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Input,
  Box,
  Select,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import { useDisclosure } from '@chakra-ui/react';
import api from "api";

// Custom Modals
import DeleteConfirmationModal from "components/modals/confirmDeleteModal";
import AddCompanyModal from "components/modals/companies/addCompanyModal";
import UpdateCompanyModal from "components/modals/companies/updateCompanyModals";

function TableCompanies(props) {
  const { columnsData, tableData, refresh, searchQuery } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const [company, setCompany] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure(); // For AddCompanyModal
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure(); // For UpdateCompanyModal

  const handleEdit = useCallback((companyData) => {
    setCompany(companyData);
    onUpdateOpen();
  }, [onUpdateOpen]);

  const handleDeleteClick = useCallback((company) => {
    setCompanyToDelete(company);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await api.delete(`/api/companies/${companyToDelete.id}/`);
      refresh(prev => !prev);
      setIsDeleteModalOpen(false);
      setCompanyToDelete(null);
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  }, [companyToDelete, refresh]);

  const tableInstance = useTable(
    { columns, data },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setGlobalFilter: setTableGlobalFilter,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    gotoPage,
    nextPage,
    previousPage,
    pageCount,
    setPageSize,
  } = tableInstance;

  useEffect(() => {
    setTableGlobalFilter(searchQuery || "");
  }, [searchQuery, setTableGlobalFilter]);

  const textColor = useColorModeValue("navy.700", "white");

  return (
    <>
      <AddCompanyModal isOpen={isOpen} onClose={onClose} refresher={refresh} />
      <UpdateCompanyModal isOpen={isUpdateOpen} onClose={onUpdateClose} company={company} refresher={refresh} />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        companyName={companyToDelete ? companyToDelete.name : ''}
      />
      <Flex
        direction="column"
        w="100%"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        <Flex
          align={{ sm: "flex-start", lg: "center" }}
          justify="space-between"
          w="100%"
          px="22px"
          pb="20px"
          mb="10px"
          boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)"
        >
          <Text color={textColor} fontSize="xl" fontWeight="600">
            Top Creators
          </Text>
          <Button onClick={onOpen} variant="solid" colorScheme="blue">Add New Company</Button>
        </Flex>
        <Table {...getTableProps()} variant="simple" color="gray.500">
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe="10px"
                    key={index}
                    borderColor="transparent"
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      {column.render("Header")}
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data = "";
                    if (cell.column.Header === "Name") {
                      data = (
                        <Flex align="center">
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="600"
                          >
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "Actions") {
                      data = (
                        <Flex>
                          <IconButton
                            icon={<EditIcon />}
                            onClick={() => handleEdit(cell.row.original)}
                            aria-label="Update"
                            colorScheme="blue"
                          />
                          <IconButton
                            icon={<DeleteIcon />}
                            onClick={() => handleDeleteClick(cell.row.original)}
                            aria-label="Delete"
                            colorScheme="red"
                            ml="4"
                          />
                        </Flex>
                      );
                    }
                    return (
                      <Td
                        {...cell.getCellProps()}
                        key={index}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor="transparent"
                      >
                        {data}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <Flex justify="space-between" alignItems="center" m={4}>
          <Flex>
            <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage} mr={2}>
              {"<<"}
            </Button>
            <Button onClick={() => previousPage()} disabled={!canPreviousPage} mr={2}>
              {"<"}
            </Button>
            <Button onClick={() => nextPage()} disabled={!canNextPage} mr={2}>
              {">"}
            </Button>
            <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {">>"}
            </Button>
          </Flex>
          <Box>
            <Text>
              Page{" "}
              <strong>
                {state.pageIndex + 1} of {pageOptions.length}
              </strong>
            </Text>
          </Box>
          <Flex alignItems="center">
            <Text mr={2}>Go to page:</Text>
            <Input
              type="number"
              defaultValue={state.pageIndex + 1}
              onChange={(e) => {
                const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(pageNumber);
              }}
              width="50px"
              mr={2}
            />
            <Select
              value={state.pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              width="100px"
            >
              {[5, 10, 15, 20].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </Select>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}

export default TableCompanies;
