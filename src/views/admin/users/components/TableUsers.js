import {
  Avatar,
  Box,
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
  Input,
  Select,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import React, { useEffect, useMemo, useState, useCallback } from "react";
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

const TableUsers = ({ columnsData, tableData, refresh, searchQuery }) => {
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => (Array.isArray(tableData) ? tableData : []), [tableData]);
  console.log(data);

  const [currentUser, setCurrentUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure();

  const handleEdit = useCallback(
    (userData) => {
      setCurrentUser(userData);
      onUpdateOpen();
    },
    [onUpdateOpen]
  );

  const handleDeleteClick = useCallback(
    (user) => {
      setUserToDelete(user);
      setIsDeleteModalOpen(true);
    },
    []
  );

  const handleConfirmDelete = useCallback(async () => {
    try {
      await api.delete(`/api/users/${userToDelete.id}/`);
      refresh((prev) => !prev);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }, [userToDelete, refresh]);

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
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    prepareRow,
    setGlobalFilter: setTableGlobalFilter,
  } = tableInstance;

  useEffect(() => {
    setTableGlobalFilter(searchQuery || "");
  }, [searchQuery, setTableGlobalFilter]);

  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = useColorModeValue("secondaryGray.600", "white");

  return (
    <>
      <AddUserModal isOpen={isOpen} onClose={onClose} refresher={refresh} />
      <UpdateUserModal
        isOpen={isUpdateOpen}
        onClose={onUpdateClose}
        user={currentUser}
        refresher={refresh}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        userName={userToDelete ? userToDelete.name : ""}
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
            Users
          </Text>
          <Button onClick={onOpen} variant="action">
            Add New User
          </Button>
        </Flex>
        <Table {...getTableProps()} variant="simple" color="gray.500">
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id || headerGroup.getHeaderGroupProps().key}>
                {headerGroup.headers.map((column) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    pe="10px"
                    key={column.id || column.getHeaderProps().key}
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
                <Tr {...row.getRowProps()} key={row.id || row.getRowProps().key}>
                  {row.cells.map((cell) => {
                    let cellContent;
                    if (cell.column.Header === "Profile Image") {
                      cellContent = cell.row.original.profile ? (
                        <Avatar
                          src={cell.row.original.profile.picture}
                          w="30px"
                          h="30px"
                          me="8px"
                          onError={({ currentTarget }) => {
                            currentTarget.onerror = null;
                            currentTarget.src = "path/to/default/avatar.jpg";
                          }}
                        />
                      ) : (
                        <Avatar
                          src="../../../../assets/img/default.jpg"
                          w="30px"
                          h="30px"
                          me="8px"
                        />
                      );
                    } else if (cell.column.Header === "Username") {
                      cellContent = (
                        <Text color={textColor} fontSize="sm" fontWeight="600">
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "Email") {
                      cellContent = (
                        <Text
                          color={textColorSecondary}
                          fontSize="sm"
                          fontWeight="500"
                        >
                          {cell.value}
                        </Text>
                      );
                    } else if (cell.column.Header === "Actions") {
                      cellContent = (
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
                        key={cell.column.id || cell.getCellProps().key}
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor="transparent"
                      >
                        {cellContent}
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
};

export default TableUsers;