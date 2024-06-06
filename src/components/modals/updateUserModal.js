import React, { useRef, useState, useEffect } from 'react';
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
  Image,
  Flex
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import api from 'api';

function UpdateUserModal({ isOpen, onClose, user, refresher }) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(user?.photo || 'https://bit.ly/dan-abramov');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Update state when user prop changes
  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      if(user.profile){
        setImagePreview(user.profile.picture || 'https://bit.ly/dan-abramov');
      }
      else{
        setImagePreview('https://bit.ly/dan-abramov');
      }

    }
  }, [user]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  

  const handleSubmit = async () => {
    try {
      const user_id = user.id;
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      if (fileInputRef.current?.files[0]) {
        formData.append('photo', fileInputRef.current.files[0]);
        const Upload = await api.post(`/api/users/${user_id}/upload-picture/`, {picture: fileInputRef.current.files[0]},
          {headers: {
            'Content-Type': 'multipart/form-data'
          }}
        );
        console.log(Upload.data); // Log the response from the server
      }
      console.log(fileInputRef.current.files[0]);  
      const response = await api.put(`/api/users/${user_id}/`, formData);
      console.log(response); // Log the response from the server
      onClose(); // Close the modal on successful save
      refresher((prev) => !prev); // Trigger a re-fetch of the data
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };
  

  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Flex justifyContent="center" mt="20px">
          <Image
            borderRadius="full"
            boxSize="150px"
            src={imagePreview}
            alt={user?.username || 'User'}
          />
        </Flex>
        <ModalHeader>Update User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Username</FormLabel>
            <Input placeholder="Username" value={username} onChange={handleUsernameChange}  />
            <FormLabel mt={4}>Email</FormLabel>
            <Input placeholder="Email" value={email} onChange={handleEmailChange}  />
            <FormLabel mt={4}>Photo</FormLabel>
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
            />
            <Button leftIcon={<AddIcon />} onClick={openFileSelector} w="full" mt="2">
              Upload Photo
            </Button>
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

export default UpdateUserModal;
