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
  IconButton,
  VStack
} from "@chakra-ui/react";
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import api from 'api';

function UpdateSectionModal({ isOpen, onClose, section, refresher }) {
  const [name, setName] = useState('');
  const [subsections, setSubsections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSubsections = async (section) => {
    if (section) {
      const response = await api.get(`/api/sections/${section.id}/subsections/`);
      setSubsections(response.data);
    }
  }

  useEffect(() => {
    if (section) {
      setName(section.name || '');
      getSubsections(section);
    }
  }, [section]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleSubsectionChange = (index, event) => {
    const updatedSubsections = subsections.map((sub, subIndex) => {
      if (index === subIndex) {
        return { ...sub, name: event.target.value };
      }
      return sub;
    });
    setSubsections(updatedSubsections);
  };

  const handleAddSubsection = () => {
    setSubsections([...subsections, { name: '', section: section.id, description: '' }]);
  };

  const handleRemoveSubsection = (index) => {
    setSubsections(subsections.filter((_, subIndex) => subIndex !== index));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const section_id = section.id;
      const response = await api.put(`/api/sections/${section_id}/update-subsections/`, {
        id: section_id,
        name,
        subsections
      });
      console.log(response); // Log the response from the server
      onClose(); // Close the modal on successful save
      refresher((prev) => !prev); // Trigger a re-fetch of the data
    } catch (error) {
      console.error('Error updating section:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!section) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Section</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Section Name" value={name} onChange={handleNameChange} />
          </FormControl>
          <FormLabel mt={4}>Subsections</FormLabel>
          <VStack mt={4} spacing={4}>
            {subsections.map((sub, index) => (
              <FormControl key={index} display="flex" alignItems="center">
                <Input
                  placeholder={`Subsection ${index + 1} Name`}
                  value={sub.name}
                  onChange={(e) => handleSubsectionChange(index, e)}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  onClick={() => handleRemoveSubsection(index)}
                  aria-label="Remove subsection"
                  colorScheme="red"
                  ml={2}
                />
              </FormControl>
            ))}
            <Button leftIcon={<AddIcon />} onClick={handleAddSubsection} colorScheme="blue">
              Add Subsection
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={isLoading}>Save</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UpdateSectionModal;
