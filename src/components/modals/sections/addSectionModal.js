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
  Input,
  IconButton,
  VStack
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import api from 'api';

function AddSectionModal({ isOpen, onClose, refresher }) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [subsections, setSubsections] = useState([{ name: '' }]);
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  const handleSubsectionChange = (index, event) => {
    const newSubsections = subsections.map((subsection, i) => {
      if (index === i) {
        return { ...subsection, name: event.target.value };
      }
      return subsection;
    });
    setSubsections(newSubsections);
  };

  const handleAddSubsection = () => {
    setSubsections([...subsections, { name: '' }]);
  };

  const handleRemoveSubsection = (index) => {
    setSubsections(subsections.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await api.post('/api/sections/', {
        id,
        name,
        subsections,
      });
      console.log(response); // Log the response from the server
      onClose(); // Close the modal on successful save
      refresher((prev) => !prev); // Refresh the data in the parent component
    } catch (error) {
      console.error('Error saving section:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Section</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Id</FormLabel>
            <Input placeholder="Section Id" name='id' value={id} onChange={handleIdChange} />
            <FormLabel>Name</FormLabel>
            <Input placeholder="Section Name" name='name' value={name} onChange={handleNameChange} />
          </FormControl>
          <FormLabel mt={4}>Subsections</FormLabel>
          <VStack spacing={4}>
            {subsections.map((subsection, index) => (
              <FormControl key={index} display="flex" alignItems="center">
                <Input
                  placeholder={`Subsection ${index + 1} Name`}
                  value={subsection.name}
                  onChange={(e) => handleSubsectionChange(index, e)}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  onClick={() => handleRemoveSubsection(index)}
                  ml={2}
                  aria-label="Remove subsection"
                  colorScheme="red"
                />
              </FormControl>
            ))}
            <Button leftIcon={<AddIcon />} onClick={handleAddSubsection} colorScheme="blue">Add Subsection</Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSave} mr={3} isLoading={isLoading}>Save</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default AddSectionModal;
