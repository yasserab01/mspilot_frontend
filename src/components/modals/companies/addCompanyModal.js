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
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const handleSave = async () => {
    setIsLoading(true);
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
    finally {
      setIsLoading(false);
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
          <Button colorScheme="blue" onClick={handleSave} mr={3} isLoading={isLoading} >Save</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AddCompanyModal;
