import React, { useEffect, useState, useMemo } from 'react';
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
  useDisclosure
} from "@chakra-ui/react";
import { DeleteIcon, DownloadIcon, EditIcon } from "@chakra-ui/icons";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import api from "api";

// Custom Modals
import DeleteConfirmationModal from "components/modals/confirmDeleteModal";
import AddReportsModal from "components/modals/reports/addReportsModal";
import UpdateReportsModal from "components/modals/reports/updateReportsModals";

function TableReports({ columnsData, tableData, refresh, searchQuery}) {
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);
  const [companies, setCompanies] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [companiesResponse, repositoriesResponse] = await Promise.all([
          api.get('/api/companies/'),
          api.get('/api/repositories/')
        ]);
        setCompanies(companiesResponse.data);
        setRepositories(repositoriesResponse.data);
      } catch (error) {
        console.error('Error fetching companies or repositories:', error);
      }
    };

    fetchResources();
  }, []);

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

  const handleEdit = (report) => {
    setSelectedReport(report.original);
    onUpdateOpen();
  };

  const handleDeleteClick = (report) => {
    setReportToDelete(report);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    setTableGlobalFilter(searchQuery || "");
  }, [searchQuery, setTableGlobalFilter]);

  const handleReportDownload = async (report) => {
    try {
        const response = await api.post('http://127.0.0.1:8000/api/pdf-report/', {
            report_id: report.id,
            filename: `${report.name}.pdf`
        }, { responseType: 'blob' });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${report.name}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error downloading report:', error);
    }
};


  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/api/reports/${reportToDelete.id}/`);
      refresh(prev => !prev);  // Refreshing the data
      setIsDeleteModalOpen(false);
      setReportToDelete(null);
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const getCompanyName = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Unknown';
  };

  const getRepositoryName = (repositoryId) => {
    const repository = repositories.find(r => r.id === repositoryId);
    return repository ? repository.name : 'Unknown';
  };

  return (
    <>
      <AddReportsModal isOpen={isOpen} onClose={onClose} refresher={refresh} />
      <UpdateReportsModal isOpen={isUpdateOpen} onClose={onUpdateClose} reportSelected={selectedReport} refresher={refresh} />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        reportName={reportToDelete ? reportToDelete.name : ''}
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
            Reports Management
          </Text>
          <Button onClick={onOpen} variant="solid" colorScheme="blue">Add New Report</Button>
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
                    if (cell.column.id === 'company') {
                      data = <Text color={textColor}>{getCompanyName(cell.value)}</Text>;
                    } else if (cell.column.id === 'repository') {
                      data = <Text color={textColor}>{getRepositoryName(cell.value)}</Text>;
                    } else if (cell.column.id === 'actions') {
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
                          <IconButton
                            icon={<DownloadIcon />}
                            aria-label="Download"
                            onClick={() => handleReportDownload(cell.row.original)}
                            colorScheme="green"
                            ml="4"
                          />
                        </Flex>
                      );
                    }
                    return (
                      <Td {...cell.getCellProps()} key={index} fontSize="md" borderColor="transparent">
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

export default TableReports;