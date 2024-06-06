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

function AddUserModal({ isOpen, onClose, refresher}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSave = async () => {
    try {
      const response = await api.post('/api/users/', {
        username,
        email,
        password
      },
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
        <ModalHeader>Add New User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input placeholder="Username" name='username' value={username} onChange={handleInputChange} />
            <FormLabel mt={4}>Email</FormLabel>
            <Input placeholder="Email" name='email' value={email} onChange={handleInputChange} />
            <FormLabel mt={4}>Password</FormLabel>
            <Input placeholder="Password" type='password' name='password' value={password} onChange={handleInputChange} />
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

export default AddUserModal;
