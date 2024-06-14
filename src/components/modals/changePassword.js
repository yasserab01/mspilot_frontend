import React, { useContext } from 'react';
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
import { UserContext } from 'contexts/UserContext';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';

// Define initial form values
const initialValues = {
  old_password: '',
  new_password: ''
};

// Define form validation schema using Yup
const validationSchema = Yup.object({
  old_password: Yup.string()
    .required('Old password is required'),
  new_password: Yup.string()
    .required('New password is required')
    .min(6, 'Password must be at least 6 characters')
});

const logout = async () => {
    try {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = '/';
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

function ChangePasswordModal({ isOpen, onClose, refresher }) {
  const { user } = useContext(UserContext);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    try {
        const userId = user.id;
      const response = await api.post(`/api/users/${userId}/change-password/`, values, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status !== 200) {
        throw new Error('Error changing password');
      }
      
      toast.success('Password changed successfully!', {
        position: 'bottom-center',
      });
      onClose(); // Close the modal on successful save
      logout(); // Logout the user
      refresher((prev) => !prev); // Refresh the data in the parent component
      resetForm(); // Reset the form fields
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Error changing password.', {
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
        <ModalHeader>Change Password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <FormControl isInvalid={errors.old_password && touched.old_password} mt={4}>
                  <FormLabel>Old Password</FormLabel>
                  <Field as={Input} type="password" name="old_password" placeholder="Old Password" />
                  {errors.old_password && touched.old_password && (
                    <Text color="red.500">{errors.old_password}</Text>
                  )}
                </FormControl>
                <FormControl isInvalid={errors.new_password && touched.new_password} mt={4}>
                  <FormLabel>New Password</FormLabel>
                  <Field as={Input} type="password" name="new_password" placeholder="New Password" />
                  {errors.new_password && touched.new_password && (
                    <Text color="red.500">{errors.new_password}</Text>
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

export default ChangePasswordModal;
