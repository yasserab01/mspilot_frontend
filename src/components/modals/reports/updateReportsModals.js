import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  FormControl,
  FormLabel,
  Text,
  Textarea,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Spinner
} from "@chakra-ui/react";
import api from 'api';

function UpdateReportsModal({ isOpen, onClose, reportSelected, refresher }) {
  const [report, setReport] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedRepository, setSelectedRepository] = useState('');
  const [sections, setSections] = useState([]);
  const [subsectionsStatus, setSubsectionsStatus] = useState({});

  useEffect(() => {
    if (isOpen && reportSelected) {
      console.log('Modal is open, and reportSelected is provided:', reportSelected);
      fetchInitialData();
    }
  }, [isOpen, reportSelected]); // Listen to isOpen as well to trigger fetching when the modal opens

  async function fetchInitialData() {
    try {
      const [companyRes,allCompanies, repositoryRes, allRepositories, reportRes] = await Promise.all([
        api.get(`/api/companies/${reportSelected.company}/`),
        api.get(`/api/companies/`), // Assuming you fetch all companies
        api.get(`/api/repositories/${reportSelected.repository}/`),
        api.get(`/api/repositories/`), // Assuming you fetch all repositories
        api.get(`/api/reports/${reportSelected.id}/`), // Assuming there is a direct call to fetch the report // Assuming you fetch all sections of a repository
      ]);
      setSelectedCompany(companyRes.data.id);
      setCompanies(allCompanies.data); // Assuming you fetch single company data
      setSelectedRepository([repositoryRes.data]); // Assuming single repository data
      setRepositories(allRepositories.data); // Assuming you fetch all repositories
      setReport(reportRes.data);
      await fetchSections(repositoryRes.data.sections);
      initializeSubsectionStates(repositoryRes.data.sections);
      setSelectedCompany(reportSelected.company);
      setSelectedRepository(reportSelected.repository);

    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  }

  async function fetchSections(sectionsId) {
    try {
      const sections = [];
      for(const sectionId of sectionsId) {
        const { data } = await api.get(`/api/sections/${sectionId}/`);
        sections.push(data);
      }
      setSections(sections);
      console.log('Sections:', sections);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  }

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleRepositoryChange = async (e) => {
    const repoId = e.target.value;
    setSelectedRepository(repoId);

    try {
      const { data } = await api.get(`/api/repositories/${repoId}/`);
      let sections = [];
      for (const sectionId of data.sections) {
        const sectionData = await api.get(`/api/sections/${sectionId}/`);
        sections.push(sectionData.data);
      }
      setSections(sections);
      console.log('Sections:', sections);
      initializeSubsectionStates(data.sections);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const handleSubmit = async () => {
    const updatedReportData = {
      company: selectedCompany,
      repository: selectedRepository,
    };
  
    try {
      // First, update the main report data
      const response = await api.put(`/api/reports/${reportSelected.id}/`, updatedReportData);
      if (response.status === 200) {  // Assuming 200 OK for a successful PUT request
        console.log('Report updated:', response);
  
        // Then, update subsection statuses
        const updatedSubsectionsStatus = Object.values(subsectionsStatus).map(({ subsectionStatusId, subsectionId, status, justification }) => ({
          id: subsectionStatusId, // This is crucial for identifying the specific subsection status to update
          status: status,
          justification: justification
        }));
  
        console.log('Updating subsections status:', updatedSubsectionsStatus);
  
        const subsectionsResponse = await api.post(`/api/reports/${reportSelected.id}/update-subsections-status/`, updatedSubsectionsStatus);
        console.log('Subsections update response:', subsectionsResponse);
        if (subsectionsResponse.status === 200) {
          onClose(); // Close the modal
          refresher(); // Refresh data in parent component
        } else {
          console.error('Failed to update subsection status:', subsectionsResponse.data.message);
        }
      } else {
        console.error('Failed to update report:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating report and subsections:', error);
    }
  };
  

  const handleStatusChange = (subsectionId, value) => {
    setSubsectionsStatus(prev => ({
      ...prev,
      [subsectionId]: {
        ...prev[subsectionId],
        status: value
      }
    }));
  };

  const handleJustificationChange = (subsectionId, value) => {
    setSubsectionsStatus(prev => ({
      ...prev,
      [subsectionId]: {
        ...prev[subsectionId],
        justification: value
      }
    }));
  };

  const initializeSubsectionStates = async (sectionsId) => {
    const subsections = {};
    try {
      for (const sectionId of sectionsId) {
        console.log('Section ID:', sectionId);
        const { data: subsectionsData } = await api.get(`/api/sections/${sectionId}/subsections/`);
        const { data: subsectionsStatusData } = await api.get(`/api/reports/${reportSelected.id}/subsections-status/`);
  
        subsectionsData.forEach(subsection => {
          const subsectionStatus = subsectionsStatusData.find(subsectionStatus => subsectionStatus.subsection === subsection.id) || {};
  
          subsections[subsection.id] = {
            sectionId: sectionId,
            subsectionStatusId: subsectionStatus.id,
            subsectionId: subsection.id,
            subsectionName: subsection.name,
            status: subsectionStatus.status || 'applicable',
            justification: subsectionStatus.justification || ''
          };
        });
      }
      setSubsectionsStatus(subsections);
      console.log('Subsections:', subsections);
    } catch (error) {
      console.error('Error initializing subsection states:', error);
    }
  };
  

  if (!isOpen) return null; // Ensure that the component does nothing when not open

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Report</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {report ? (
            <React.Fragment>
              <FormControl>
                <FormLabel>Company</FormLabel>
                <Select value={selectedCompany} onChange={handleCompanyChange}>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Repository</FormLabel>
                <Select value={selectedRepository} onChange={handleRepositoryChange}>
                  {repositories.map((repo) => (
                    <option key={repo.id} value={repo.id}>{repo.name}</option>
                  ))}
                </Select>
              </FormControl>

              {sections.map((section) => (
                  <Box key={section.id}>
                    <Text fontSize="lg" fontWeight="bold" mt={4}>{section.name}</Text>
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Th>Subsection</Th>
                          <Th>Status</Th>
                          <Th>Justification</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {Object.entries(subsectionsStatus)
                          .filter(([_, subsection]) => subsection.sectionId === section.id)
                          .map(([id, { subsectionName, status, justification }]) => (
                            <Tr key={id}>
                              <Td>{subsectionName}</Td>
                              <Td>
                                <Select value={status} onChange={(e) => handleStatusChange(id, e.target.value)}>
                                  <option value="applicable">Applicable</option>
                                  <option value="not_applicable">Not Applicable</option>
                                </Select>
                              </Td>
                              <Td>
                                <Textarea value={justification} onChange={(e) => handleJustificationChange(id, e.target.value)} />
                              </Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </Box>
                ))}

              
            </React.Fragment>
          ) : (
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
              margin={{ base: '0 auto', md: '0' }}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>Save Changes</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UpdateReportsModal;