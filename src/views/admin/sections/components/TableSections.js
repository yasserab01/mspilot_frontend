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
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { useDisclosure } from "@chakra-ui/react";
import api from "api";

// Custom Modals
import DeleteConfirmationModal from "components/modals/confirmDeleteModal";
import AddSectionModal from "components/modals/sections/addSectionModal";
import UpdateSectionModal from "components/modals/sections/updateSectionModals";

function TableSections(props) {
  const { columnsData, tableData, refresh, searchQuery } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const [section, setSection] = useState(null);

  const handleEdit = (sectionData) => {
    setSection(sectionData);
    onUpdateOpen();
  };

  const { isOpen, onOpen, onClose } = useDisclosure(); // For AddSectionModal
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure(); // For UpdateSectionModal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);

  const handleDeleteClick = (section) => {
    setSectionToDelete(section);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await api.delete(`/api/sections/${sectionToDelete.id}/`);
      console.log('Delete response:', response);
      refresh((prev) => !prev); // Assuming you have a function to refetch section data
      setIsDeleteModalOpen(false);
      setSectionToDelete(null);
    } catch (error) {
      console.error("Error deleting section:", error);
      // Optionally handle error, e.g., show an error message
    }
  };

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

  useEffect(() => {
    setTableGlobalFilter(searchQuery || undefined);
  }, [searchQuery, setTableGlobalFilter]);

  const textColor = useColorModeValue("navy.700", "white");

  return (
    <>
      <AddSectionModal isOpen={isOpen} onClose={onClose} refresher={refresh} />
      <UpdateSectionModal isOpen={isUpdateOpen} onClose={onUpdateClose} section={section} refresher={refresh} />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        sectionName={sectionToDelete ? sectionToDelete.name : ""}
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
            Sections Management
          </Text>
          <Button onClick={onOpen} variant="solid" colorScheme="blue">
            Add New Section
          </Button>
        </Flex>
        <Table {...getTableProps()} variant="simple" colorScheme="gray">
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
                    <Flex justify="space-between" align="center" fontSize={{ sm: "10px", lg: "12px" }} color="gray.400">
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
                    if (cell.column.Header === "Section") {
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
      </Flex>
    </>
  );
}

export default TableSections;
