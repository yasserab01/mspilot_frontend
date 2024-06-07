import React, { useEffect, useMemo, useState } from "react";
import {
  Avatar,
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
  useDisclosure
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
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure(); // For UpdateUserModal
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
    setGlobalFilter: setTableGlobalFilter,
  } = tableInstance;

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

  useEffect(() => {
    setTableGlobalFilter(searchQuery || undefined);
  }, [searchQuery, setTableGlobalFilter]);

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
          boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)">
          <Text color={textColor} fontSize="xl" fontWeight="600">
            Repositories
          </Text>
          <Button onClick={onOpen} variant="action">Add New Repository</Button>
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
                    borderColor="transparent">
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400">
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
                    let data = cell.render('Cell');
                    if (cell.column.Header === "Repository Name") {
                      data = (
                        <Flex align="center">
                          <Avatar
                            src={cell.value[1]}
                            w="30px"
                            h="30px"
                            me="8px"
                          />
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
                        key={index}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor="transparent">
                        {data}
                      </Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Flex>
    </>
  );
}

export default TableRepositories;
