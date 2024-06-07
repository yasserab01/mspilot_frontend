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

function UpdateCompanyModal({ isOpen, onClose, company, refresher }) {
  const [name, setName] = useState('');

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Update state when user prop changes
  useEffect(() => {
    if (company) {
      setName(company.name || '');
    }
  }, [company]);

  const handleSubmit = async () => {
    try {
      const company_id = company.id;
      const response = await api.put(`/api/companies/${company_id}/`, {
        name,
      });
      console.log(response); // Log the response from the server
      onClose(); // Close the modal on successful save
      refresher((prev) => !prev); // Trigger a re-fetch of the data
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }


  if (!company) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Company</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input placeholder="name" value={name} onChange={handleNameChange}  />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>Save</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UpdateCompanyModal;
