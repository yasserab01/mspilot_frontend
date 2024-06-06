import React, { useState } from 'react';
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

import api from 'api';

function AddCompanyModal({ isOpen, onClose, refresher}) {
  const [name, setName] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
  };

  const handleSave = async () => {
    try {
      const response = await api.post('/api/companies/', {
        name,
      });
      console.log(response); // Log the response from the server
      onClose(); // Close the modal on successful save
      refresher((prev)=>!prev); // Refresh the data in the parent component
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Company</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Name" name='name' value={name} onChange={handleInputChange} />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSave} mr={3}>Save</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AddCompanyModal;
