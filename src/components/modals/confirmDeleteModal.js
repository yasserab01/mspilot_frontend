import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text
} from '@chakra-ui/react';


function DeleteConfirmationModal({ isOpen, onClose, onConfirm, userName }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure you want to delete {userName}? This action cannot be undone.</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={onConfirm}>
            Delete
          </Button>
          <Button variant='ghost' onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default DeleteConfirmationModal;
