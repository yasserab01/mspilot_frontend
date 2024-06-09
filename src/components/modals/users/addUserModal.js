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
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Text
} from "@chakra-ui/react";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import api from 'api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required')
});

function AddUserModal({ isOpen, onClose, refresher }) {
  const initialValues = {
    username: '',
    email: '',
    password: ''
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
      const response = await api.post('/api/users/', values, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status !== 201) {
        throw new Error('Error saving user');
      }
      toast.success('User added successfully!', {
        position: 'bottom-center',
      });
      onClose(); // Close the modal on successful save
      refresher((prev) => !prev); // Refresh the data in the parent component
      resetForm(); // Reset the form fields
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Error saving user.', {
        position: 'bottom-center',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <FormControl isInvalid={errors.username && touched.username}>
                  <FormLabel>Username</FormLabel>
                  <Field as={Input} name="username" placeholder="Username" />
                  {errors.username && touched.username && (
                    <Text color="red.500">{errors.username}</Text>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.email && touched.email} mt={4}>
                  <FormLabel>Email</FormLabel>
                  <Field as={Input} name="email" placeholder="Email" />
                  {errors.email && touched.email && (
                    <Text color="red.500">{errors.email}</Text>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.password && touched.password} mt={4}>
                  <FormLabel>Password</FormLabel>
                  <Field as={Input} type="password" name="password" placeholder="Password" />
                  {errors.password && touched.password && (
                    <Text color="red.500">{errors.password}</Text>
                  )}
                </FormControl>
                <ModalFooter>
                  <Button colorScheme="blue" type="submit" mr={3} isLoading={isSubmitting}>
                    {isSubmitting ? <Spinner size="sm" /> : 'Save'}
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default AddUserModal;
