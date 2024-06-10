import React, { useState, useEffect, useCallback } from 'react';
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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from 'api';

function UpdateReportsModal({ isOpen, onClose, reportSelected, refresher }) {
  const [report, setReport] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedRepository, setSelectedRepository] = useState('');
  const [sections, setSections] = useState([]);
  const [subsectionsStatus, setSubsectionsStatus] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setSelectedCompany('');
    setSelectedRepository('');
    setSections([]);
    setSubsectionsStatus({});
  };

  const fetchSections = useCallback(async (sectionsId) => {
    try {
      const sectionsData = await Promise.all(
        sectionsId.map(sectionId => api.get(`/api/sections/${sectionId}/`))
      );
      setSections(sectionsData.map(sectionRes => sectionRes.data));
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  }, []);

  const initializeSubsectionStates = useCallback(async (sectionsId) => {
    try {
      const subsections = {};
      const subsectionsDataArray = await Promise.all(
        sectionsId.map(sectionId => api.get(`/api/sections/${sectionId}/subsections/`))
      );
      const subsectionsStatusData = await api.get(`/api/reports/${reportSelected.id}/subsections-status/`);

      subsectionsDataArray.forEach((subsectionsData, index) => {
        subsectionsData.data.forEach(subsection => {
          const subsectionStatus = subsectionsStatusData.data.find(status => status.subsection === subsection.id) || {};

          subsections[subsection.id] = {
            sectionId: sectionsId[index],
            subsectionStatusId: subsectionStatus.id || null,
            subsectionId: subsection.id,
            subsectionName: subsection.name,
            status: subsectionStatus.status || 'applicable',
            justification: subsectionStatus.justification || ''
          };
        });
      });
      setSubsectionsStatus(subsections);
    } catch (error) {
      console.error('Error initializing subsection states:', error);
    }
  }, [reportSelected?.id]);

  const fetchInitialData = useCallback(async () => {
    if (!reportSelected) return;

    try {
      setIsFetching(true);
      const [companyRes, allCompanies, repositoryRes, allRepositories, reportRes] = await Promise.all([
        api.get(`/api/companies/${reportSelected.company}/`),
        api.get(`/api/companies/`),
        api.get(`/api/repositories/${reportSelected.repository}/`),
        api.get(`/api/repositories/`),
        api.get(`/api/reports/${reportSelected.id}/`),
      ]);

      setSelectedCompany(companyRes.data?.id || '');
      setCompanies(allCompanies.data || []);
      setSelectedRepository(repositoryRes.data?.id || '');
      setRepositories(allRepositories.data || []);
      setReport(reportRes.data || {});

      await fetchSections(repositoryRes.data.sections);
      await initializeSubsectionStates(repositoryRes.data.sections);

    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setIsFetching(false);
    }
  }, [fetchSections, initializeSubsectionStates, reportSelected]);

  useEffect(() => {
    if (isOpen && reportSelected) {
      fetchInitialData();
    }
  }, [isOpen, reportSelected, fetchInitialData]);

  const handleCompanyChange = useCallback((e) => {
    setSelectedCompany(e.target.value);
  }, []);

  const handleRepositoryChange = useCallback(async (e) => {
    const repoId = e.target.value;
    setSelectedRepository(repoId);

    try {
      setIsFetching(true);
      const { data } = await api.get(`/api/repositories/${repoId}/`);
      await fetchSections(data.sections);
      await initializeSubsectionStates(data.sections);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setIsFetching(false);
    }
  }, [fetchSections, initializeSubsectionStates]);

  const handleStatusChange = useCallback((subsectionId, value) => {
    setSubsectionsStatus(prev => ({
      ...prev,
      [subsectionId]: {
        ...prev[subsectionId],
        status: value
      }
    }));
  }, []);

  const handleJustificationChange = useCallback((subsectionId, value) => {
    setSubsectionsStatus(prev => ({
      ...prev,
      [subsectionId]: {
        ...prev[subsectionId],
        justification: value
      }
    }));
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    const updatedReportData = {
      company: selectedCompany,
      repository: selectedRepository,
    };

    try {
      const response = await api.put(`/api/reports/${reportSelected?.id}/`, updatedReportData);
      if (response.status === 200) {
        const updatedSubsectionsStatus = Object.values(subsectionsStatus).map(({ subsectionStatusId, status, justification }) => ({
          id: subsectionStatusId,
          status,
          justification
        }));

        const subsectionsResponse = await api.post(`/api/reports/${reportSelected?.id}/update-subsections-status/`, updatedSubsectionsStatus);
        if (subsectionsResponse.status === 200) {
          toast.success('Report and subsections updated successfully!', {
            position: 'bottom-center',
          });
          onClose();
          refresher();
          resetForm();
        } else {
          console.error('Failed to update subsection status:', subsectionsResponse.data.message);
          toast.error('Failed to update subsection status.', {
            position: 'bottom-center',
          });
        }
      } else {
        console.error('Failed to update report:', response.data.message);
        toast.error('Failed to update report.', {
          position: 'bottom-center',
        });
      }
    } catch (error) {
      console.error('Error updating report and subsections:', error);
      toast.error('Error updating report and subsections.', {
        position: 'bottom-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent maxWidth="90vw" width="90vw">
        <ModalHeader>Update Report</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isFetching ? (
            <Spinner size="xl" />
          ) : (
            <>
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
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={isLoading}>Save Changes</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UpdateReportsModal;
