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
  Input
} from "@chakra-ui/react";

import SelectSections from '../sections/SelectSections';

import api from 'api'; // Import API configuration for HTTP requests

function AddRepositoryModal({ isOpen, onClose, refresher }) {
  const [name, setName] = useState(''); // State to store the repository name
  const [sections, setSections] = useState([]); // State to store list of sections fetched from the API
  const [selectedSections, setSelectedSections] = useState([]); // State to store user-selected sections

  // Fetch sections from the API when the component mounts
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get('/api/sections/');
        setSections(response.data); // Set the sections state with the fetched data
      } catch (error) {
        console.error('Error fetching sections:', error); // Log any errors during the fetch
      }
    };

    fetchSections();
  }, []);

  const handleInputChange = (e) => {
    setName(e.target.value); // Update the repository name as the user types
  };

  const handleSave = async () => {
    try {
      const sections_id = selectedSections.map(sec => sec.value); // Extract the section IDs from the selected sections
      const response = await api.post('/api/repositories/', {
        name,
        sections: sections_id,
      });
      console.log(response); // Log the successful server response
      onClose(); // Close the modal on successful save
      refresher((prev) => !prev); // Trigger a refresh of the parent component's data
    } catch (error) {
      console.error('Error saving repository:', error); // Log any errors encountered during save
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Repository</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
            <FormControl>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Name" name='name' value={name} onChange={handleInputChange} />
            </FormControl>
            <SelectSections sections={sections} selectedSections={selectedSections} setSelectedSections={setSelectedSections} />
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSave} mr={3}>Save</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AddRepositoryModal;
