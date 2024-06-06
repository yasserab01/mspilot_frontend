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
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import api from 'api';
import SelectSections from './SelectSections';

function UpdateRepositoryModal({ isOpen, onClose, repository, refresher }) {
  const [name, setName] = useState('');
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get('/api/sections/');
        setSections(response.data);
        if (repository) {
          setName(repository.name || '');
          // Transform the initial selected sections from the repository to match the select component format
          const initialSections = repository.sections;
          setSelectedSections(response.data.filter(sec => initialSections.includes(sec.id)).map(sec => ({ value: sec.id, label: sec.name })));
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };

    fetchSections();
  }, [repository]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const repository_id = repository.id;
      const response = await api.put(`/api/repositories/${repository_id}/`, {
        name,
        sections: selectedSections.map(sec => sec.value), // Only send section IDs to the backend
      });
      console.log(response);
      onClose();
      refresher((prev) => !prev);
    } catch (error) {
      console.error('Error updating repository:', error);
    }
  }

  if (!repository) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Repository</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Enter repository name" value={name} onChange={handleNameChange} />
          </FormControl>
          <SelectSections
            sections={sections}
            selectedSections={selectedSections}
            setSelectedSections={setSelectedSections}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>Save</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UpdateRepositoryModal;
