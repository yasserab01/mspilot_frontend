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
  Flex,
  Spinner
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import api from 'api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


function UpdateUserModal({ isOpen, onClose, user, refresher }) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState('https://bit.ly/dan-abramov');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setImagePreview(user.profile?.picture || 'https://bit.ly/dan-abramov');
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
    setIsLoading(true);
    try {
      const user_id = user.id;
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      
      if (fileInputRef.current?.files[0]) {
        formData.append('photo', fileInputRef.current.files[0]);
        const uploadResponse = await api.post(
          `/api/users/${user_id}/upload-picture/`,
          { picture: fileInputRef.current.files[0] },
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        console.log(uploadResponse.data);
      }
      
      const response = await api.put(`/api/users/${user_id}/`, formData);
      console.log(response);
      
      toast.success('User updated successfully!', {
        position: 'bottom-center',
      });
      
      onClose();
      refresher((prev) => !prev);
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Error saving user.', {
        position: 'bottom-center',
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  if (!user) return null;

  return (
    <>
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
            <Input placeholder="Username" value={username} onChange={handleUsernameChange} />
            <FormLabel mt={4}>Email</FormLabel>
            <Input placeholder="Email" value={email} onChange={handleEmailChange} />
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
          <Button colorScheme="blue" mr={3} onClick={handleSubmit} isLoading={isLoading}>
            {isLoading ? <Spinner size="sm" /> : 'Save'}
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    <ToastContainer />
    </>
  );
}

export default UpdateUserModal;
