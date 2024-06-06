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
  Box
} from "@chakra-ui/react";
import api from 'api';

function AddReportsModal({ isOpen, onClose, refresher }) {
  const [companies, setCompanies] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedRepository, setSelectedRepository] = useState('');
  const [sections, setSections] = useState([]);
  const [subsectionsStatus, setSubsectionsStatus] = useState({});

  useEffect(() => {
    async function fetchCompaniesAndRepositories() {
      try {
        const [companyRes, repoRes] = await Promise.all([
          api.get('/api/companies/'),
          api.get('/api/repositories/')
        ]);
        setCompanies(companyRes.data);
        setRepositories(repoRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchCompaniesAndRepositories();
  }, []);

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

  const initializeSubsectionStates = async (sectionsId) => {
    const subsections = {};
    for (const sectionId of sectionsId) {
      const { data } = await api.get(`/api/sections/${sectionId}/subsections/`);
      for (const subsection of data) {
        subsections[subsection.id] = {
          sectionId: sectionId,
          subsectionId: subsection.id,
          subsectionName: subsection.name,
          status: 'applicable',
          justification: ''
        };
      }
    }
    setSubsectionsStatus(subsections);
    console.log('Subsections:', subsections);
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

  const handleSubmit = async (event) => {
    event.preventDefault();
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

        console.log('Subsections data:', subsectionsData);

        const subsectionsResponse = await api.post(`/api/reports/${reportId}/subsections/`, { subsections: subsectionsData });
        if (subsectionsResponse.status === 201 || subsectionsResponse.status === 200) {
          onClose();
          refresher(prev => !prev);
        } else {
          console.error('Failed to create subsection status:', subsectionsResponse.data.message);
        }
      } else {
        console.error('Failed to create report:', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Report</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Company</FormLabel>
            <Select placeholder="Select company" onChange={handleCompanyChange}>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Repository</FormLabel>
            <Select placeholder="Select repository" onChange={handleRepositoryChange}>
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
                        <Td>{section.id+"-"+subsectionId}</Td>
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
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>Save</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AddReportsModal;
