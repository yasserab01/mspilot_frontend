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
  Spinner,
} from "@chakra-ui/react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from 'api';

function AddReportsModal({ isOpen, onClose, refresher }) {
  const [companies, setCompanies] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedRepository, setSelectedRepository] = useState('');
  const [sections, setSections] = useState([]);
  const [subsectionsStatus, setSubsectionsStatus] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const resetForm = () => {
    setSelectedCompany('');
    setSelectedRepository('');
    setSections([]);
    setSubsectionsStatus({});
  };

  useEffect(() => {
    const fetchCompaniesAndRepositories = async () => {
      try {
        setIsFetching(true);
        const [companyRes, repoRes] = await Promise.all([
          api.get('/api/companies/'),
          api.get('/api/repositories/')
        ]);
        setCompanies(Array.isArray(companyRes.data) ? companyRes.data : []);
        setRepositories(Array.isArray(repoRes.data.results) ? repoRes.data.results : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setCompanies([]);
        setRepositories([]);
      } finally {
        setIsFetching(false);
      }
    };

    if (isOpen) {
      fetchCompaniesAndRepositories();
    }
  }, [isOpen]);

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleRepositoryChange = async (e) => {
    const repoId = e.target.value;
    setSelectedRepository(repoId);

    try {
      setIsFetching(true);
      const { data } = await api.get(`/api/repositories/${repoId}/`);
      const sectionsData = await Promise.all(
        data.sections.map(sectionId => api.get(`/api/sections/${sectionId}/`))
      );
      setSections(sectionsData.map(sectionRes => sectionRes.data));
      console.log(sectionsData.map(sectionRes => sectionRes.data)); // Log sections data
      await initializeSubsectionStates(data.sections);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setIsFetching(false);
    }
  };

  const initializeSubsectionStates = async (sectionsId) => {
    const subsections = {};
    try {
      const subsectionsData = await Promise.all(
        sectionsId.map(sectionId => api.get(`/api/sections/${sectionId}/subsections/`))
      );
      subsectionsData.forEach(({ data }, index) => {
        data.forEach(subsection => {
          subsections[subsection.id] = {
            sectionId: sectionsId[index],
            subsectionId: subsection.id,
            subsectionName: subsection.name,
            status: 'applicable',
            justification: ''
          };
        });
      });
      setSubsectionsStatus(subsections);
    } catch (error) {
      console.error('Error fetching subsections:', error);
    }
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const reportData = {
      company: selectedCompany,
      repository: selectedRepository,
    };

    try {
      const response = await api.post('/api/reports/', reportData);
      if (response.status === 201) {
        const reportId = response.data.id;
        const subsectionsData = Object.values(subsectionsStatus).map(subsection => ({
          id: subsection.subsectionId,
          section: subsection.sectionId,
          status: subsection.status,
          justification: subsection.justification
        }));

        const subsectionsResponse = await api.post(`/api/reports/${reportId}/subsections/`, { subsections: subsectionsData });
        if (subsectionsResponse.status === 201 || subsectionsResponse.status === 200) {
          toast.success('Report and subsections added successfully!', {
            position: 'bottom-center',
          });
          onClose();
          refresher(prev => !prev);
          resetForm();
        } else {
          console.error('Failed to create subsection status:', subsectionsResponse.data.message);
          toast.error('Failed to create subsection status.', {
            position: 'bottom-center',
          });
        }
      } else {
        console.error('Failed to create report:', response.data.message);
        toast.error('Failed to create report.', {
          position: 'bottom-center',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form.', {
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent maxWidth="70vw" width="70vw">
        <ModalHeader>Add New Report</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isFetching ? (
            <Spinner size="xl" />
          ) : (
            <>
              <FormControl>
                <FormLabel>Company</FormLabel>
                <Select placeholder="Select company" value={selectedCompany} onChange={handleCompanyChange}>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Repository</FormLabel>
                <Select placeholder="Select repository" value={selectedRepository} onChange={handleRepositoryChange}>
                  {repositories.map((repo) => (
                    <option key={repo.id} value={repo.id}>{repo.name}</option>
                  ))}
                </Select>
              </FormControl>
              {sections.length > 0 && sections.map((section) => (
                <Box key={section.id}>
                  <Text fontSize="lg" fontWeight="bold" mt={4}>{section.name}</Text>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Subsection Id</Th>
                        <Th>Subsection</Th>
                        <Th>Status</Th>
                        <Th>Justification</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Object.entries(subsectionsStatus)
                        .filter(([_, subsection]) => subsection.sectionId === section.id)
                        .map(([subsectionId, { subsectionName, status, justification }]) => (
                          <Tr key={subsectionId}>
                            <Td>{section.id + "-" + subsectionId}</Td>
                            <Td>{subsectionName}</Td>
                            <Td>
                              <Select value={status} onChange={(e) => handleStatusChange(subsectionId, e.target.value)}>
                                <option value="applicable">Applicable</option>
                                <option value="not_applicable">Not Applicable</option>
                              </Select>
                            </Td>
                            <Td>
                              <Textarea value={justification} onChange={(e) => handleJustificationChange(subsectionId, e.target.value)} />
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
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={isLoading}>Save</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AddReportsModal;
