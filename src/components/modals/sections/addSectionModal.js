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
  IconButton,
  VStack,
  Text,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import api from 'api';

const validationSchema = Yup.object().shape({
  id: Yup.string().required('Section ID is required'),
  name: Yup.string().required('Section name is required'),
  subsections: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Subsection name is required')
    })
  )
});

function AddSectionModal({ isOpen, onClose, refresher }) {
  const initialValues = {
    id: '',
    name: '',
    subsections: [{ name: '' }]
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.post('/api/sections/', {
        id: values.id,
        name: values.name,
        subsections: values.subsections
      });
      console.log(response); // Log the response from the server
      toast.success('Section added successfully!', {
        position: 'top-center',
      });
      onClose(); // Close the modal on successful save
      refresher((prev) => !prev); // Refresh the data in the parent component
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('Error saving section.', {
        position: 'top-center',
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
        <ModalHeader color={textColor}>Add New Section</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
              <Form>
                <FormControl>
                  <FormLabel color={textColor}>Id</FormLabel>
                  <Field
                    as={Input}
                    name="id"
                    placeholder="Section Id"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.id}
                    color={inputTextColor}
                  />
                  {errors.id && touched.id && (
                    <Text color="red.500">{errors.id}</Text>
                  )}
                  <FormLabel color={textColor}>Name</FormLabel>
                  <Field
                    as={Input}
                    name="name"
                    placeholder="Section Name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    color={inputTextColor}
                  />
                  {errors.name && touched.name && (
                    <Text color="red.500">{errors.name}</Text>
                  )}
                </FormControl>
                <FormLabel mt={4} color={textColor}>Subsections</FormLabel>
                <FieldArray name="subsections">
                  {({ push, remove }) => (
                    <VStack mt={4} spacing={4}>
                      {values.subsections.map((subsection, index) => (
                        <Box key={index} width="100%">
                          <FormControl display="flex" alignItems="center">
                            <Field
                              as={Input}
                              name={`subsections.${index}.name`}
                              placeholder={`Subsection ${index + 1} Name`}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={subsection.name}
                              color={inputTextColor}
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              onClick={() => remove(index)}
                              ml={2}
                              aria-label="Remove subsection"
                              colorScheme="red"
                            />
                          </FormControl>
                          {errors.subsections && errors.subsections[index] && errors.subsections[index].name && touched.subsections && touched.subsections[index] && touched.subsections[index].name && (
                            <Text color="red.500">{errors.subsections[index].name}</Text>
                          )}
                        </Box>
                      ))}
                      <Button leftIcon={<AddIcon />} onClick={() => push({ name: '' })} colorScheme="blue">Add Subsection</Button>
                    </VStack>
                  )}
                </FieldArray>
                <ModalFooter>
                  <Button colorScheme="blue" type="submit" mr={3} isLoading={isSubmitting}>Save</Button>
                  <Button color={textColor} onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default AddSectionModal;
