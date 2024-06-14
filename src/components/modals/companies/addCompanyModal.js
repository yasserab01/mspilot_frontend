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
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from 'api';

const AddCompanyModal = ({ isOpen, onClose, refresher }) => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
  });

  const handleSave = async (values, { setSubmitting }) => {
    try {
      const response = await api.post('/api/companies/', values);
      console.log(response); // Log the response from the server
      toast.success('Company added successfully!', {
        position: 'bottom-center',
      });
      onClose(); // Close the modal on successful save
      refresher((prev) => !prev); // Refresh the data in the parent component
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error('Error saving company.', {
        position: 'bottom-center',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const textColor = useColorModeValue("navy.700", "white");
  const inputTextColor = useColorModeValue("black", "white");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={textColor}>Add New Company</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{ name: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSave}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormControl>
                  <FormLabel htmlFor="name" color={textColor}>Name</FormLabel>
                  <Field
                    as={Input}
                    id="name"
                    name="name"
                    placeholder="Name"
                    color={inputTextColor}
                  />
                  <ErrorMessage name="name" component={Text} color="red.500" />
                </FormControl>
                <ModalFooter>
                  <Button colorScheme="blue" type="submit" mr={3} isLoading={isSubmitting}>
                    Save
                  </Button>
                  <Button color={textColor} onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddCompanyModal;
