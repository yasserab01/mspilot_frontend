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
  Text,
  Spinner
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, userName }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      toast.success('Element deleted successfully!', {
        position: 'top-center',
      });
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Error deleting element.', {
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Element</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure you want to delete {userName}? This action cannot be undone.</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={handleConfirm} isLoading={isLoading}>
            {isLoading ? <Spinner size="sm" /> : 'Delete'}
          </Button>
          <Button variant='ghost' onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteConfirmationModal;
