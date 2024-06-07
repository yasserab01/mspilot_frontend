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
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import api from "api";

// Custom Modals
import AddUserModal from "components/modals/users/addUserModal";
import UpdateUserModal from "components/modals/users/updateUserModal";
import DeleteConfirmationModal from "components/modals/confirmDeleteModal";

function TableUsers(props) {
  const { columnsData, tableData, refresh, searchQuery } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const [currentUser, setCurrentUser] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure(); // For AddUserModal
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure(); // For UpdateUserModal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleEdit = useCallback((userData) => {
    setCurrentUser(userData);
    onUpdateOpen();
  }, [onUpdateOpen]);

  const handleDeleteClick = useCallback((user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await api.delete(`/api/users/${userToDelete.id}/`);
      refresh(prev => !prev); // Assuming you have a function to refetch user data
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      // Optionally handle error, e.g., show an error message
    }
  }, [userToDelete, refresh]);

  const tableInstance = useTable(
    { columns, data, initialState: { globalFilter: searchQuery } },
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

  useEffect(() => {
    console.log("Search query:", searchQuery);
    setTableGlobalFilter(searchQuery || "");
  }, [searchQuery, setTableGlobalFilter]);

  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");

  return (
    <>
      <AddUserModal isOpen={isOpen} onClose={onClose} refresher={refresh} />
      <UpdateUserModal isOpen={isUpdateOpen} onClose={onUpdateClose} user={currentUser} refresher={refresh} />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={userToDelete ? userToDelete.name : ''}
      />
      <Flex
        direction="column"
        w="100%"
        overflowX={{ sm: "scroll", lg: "hidden" }}>
        <Flex
          align={{ sm: "flex-start", lg: "center" }}
          justify="space-between"
          w="100%"
          px="22px"
          pb="20px"
          mb="10px"
          boxShadow="0px 40px 58px -20px rgba(112, 144, 176, 0.26)">
          <Text color={textColor} fontSize="xl" fontWeight="600">
            Users
          </Text>
          <Button onClick={onOpen} variant="action">Add New User</Button>
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
                    let data = "";
                    if (cell.column.Header === "Profile Image") {
                      data = cell.row.original.profile ? (
                        <Avatar
                          src={cell.row.original.profile.picture}
                          w="30px"
                          h="30px"
                          me="8px"
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null; // Prevents looping
                            currentTarget.src = "path/to/default/avatar.jpg"; // Fallback avatar
                          }}
                        />
                      ) : (
                        <Avatar
                          src="../../../../assets/img/default.jpg" // Default image if no image URL is present
                          w="30px"
                          h="30px"
                          me="8px"
                        />
                      );
                    } else if (cell.column.Header === "Username") {
                      data = (
                        <Text color={textColor} fontSize="sm" fontWeight="600">
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "Email") {
                      data = (
                        <Text color={textColorSecondary} fontSize="sm" fontWeight="500">
                          {cell.value}
                        </Text>
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

export default TableUsers;
