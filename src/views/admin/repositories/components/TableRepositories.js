import React, { useEffect, useMemo, useState } from "react";
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
  useDisclosure,
  Select,
  Box,
  Input,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useGlobalFilter, usePagination, useSortBy, useTable } from "react-table";
import api from "api";

// Custom Modals
import DeleteConfirmationModal from "components/modals/confirmDeleteModal";
import AddRepositoriesModal from "components/modals/repositories/addRepositoriesModal";
import UpdateRepositoriesModal from "components/modals/repositories/updateRepositoriesModals";

function TableRepositories({ columnsData, tableData, refresh, searchQuery }) {
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const [selectedRepository, setSelectedRepository] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure(); // For AddRepositoryModal
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure(); // For UpdateRepositoriesModal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [repositoryToDelete, setRepositoryToDelete] = useState(null);

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
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    gotoPage,
    nextPage,
    previousPage,
    pageCount,
    setPageSize,
    setGlobalFilter: setTableGlobalFilter,
  } = tableInstance;

  useEffect(() => {
    setTableGlobalFilter(searchQuery || "");
  }, [searchQuery, setTableGlobalFilter]);

  const textColor = useColorModeValue("navy.700", "white");

  const handleEdit = (repositoryData) => {
    setSelectedRepository(repositoryData.original);
    onUpdateOpen();
  };

  const handleDeleteClick = (repository) => {
    setRepositoryToDelete(repository);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/repositories/${repositoryToDelete.id}/`);
      refresh(prev => !prev); // Refresh the repository data
      setIsDeleteModalOpen(false);
      setRepositoryToDelete(null);
    } catch (error) {
      console.error('Error deleting repository:', error);
    }
  };

  return (
    <>
      <AddRepositoriesModal isOpen={isOpen} onClose={onClose} refresher={refresh} />
      <UpdateRepositoriesModal isOpen={isUpdateOpen} onClose={onUpdateClose} repository={selectedRepository} refresher={refresh} />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        repositoryName={repositoryToDelete ? repositoryToDelete.name : ''}
      />
      <Flex direction="column" w="100%" overflowX={{ sm: "scroll", lg: "hidden" }}>
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
            Repositories
          </Text>
          <Button onClick={onOpen} variant="solid" colorScheme="blue">Add New Repository</Button>
        </Flex>
        <Table {...getTableProps()} variant="simple" colorScheme="gray">
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe="10px"
                    key={column.id}
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
            {page.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell) => {
                    let data = cell.render('Cell');
                    if (cell.column.Header === "Repository Name") {
                      data = (
                        <Flex align="center">
                          <Text color={textColor} fontSize="sm" fontWeight="600">
                            {cell.value}
                          </Text>
                        </Flex>
                      );
                    } else if (cell.column.Header === "Actions") {
                      data = (
                        <Flex>
                          <IconButton
                            icon={<EditIcon />}
                            onClick={() => handleEdit(cell.row)}
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
                        key={cell.column.id}
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

export default TableRepositories;
