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

import api from 'api';

const UpdateCompanyModal = ({ isOpen, onClose, company, refresher }) => {
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const company_id = company.id;
      const response = await api.put(`/api/companies/${company_id}/`, values);
      console.log(response); // Log the response from the server
      toast.success('Company updated successfully!', {
        position: 'top-center',
      });
      onClose(); // Close the modal on successful save
      refresher((prev) => !prev); // Trigger a re-fetch of the data
    } catch (error) {
      console.error('Error saving company:', error);
      toast.error('Error saving company.', {
        position: 'top-center',
      });
    } finally {
      setSubmitting(false);
    }
  };

  
  const textColor = useColorModeValue("navy.700", "white");
  const inputTextColor = useColorModeValue("black", "white");

  if (!company) return null;


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={textColor}>Update Company</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{ name: company.name || '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
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

export default UpdateCompanyModal;
