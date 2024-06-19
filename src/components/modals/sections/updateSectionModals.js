import React, { useState, useEffect } from 'react';
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
import { DeleteIcon, AddIcon } from "@chakra-ui/icons";
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import api from 'api';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Section name is required'),
  subsections: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Subsection name is required')
    })
  )
});

function UpdateSectionModal({ isOpen, onClose, section, refresher }) {
  const [subsections, setSubsections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getSubsections = async (section) => {
    if (section) {
      const response = await api.get(`/api/sections/${section.id}/subsections/`);
      setSubsections(response.data);
    }
  }

  useEffect(() => {
    if (section) {
      getSubsections(section);
    }
  }, [section]);

  const initialValues = {
    name: section?.name || '',
    subsections: subsections.map(sub => ({ name: sub.name || '', section: section.id || '', description: sub.description || '' }))
  };

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const section_id = section.id;
      const response = await api.put(`/api/sections/${section_id}/update-subsections/`, {
        id: section_id,
        name: values.name,
        subsections: values.subsections
      });
      console.log(response); // Log the response from the server
      toast.success('Section updated successfully!', {
        position: 'top-center',
      });
      onClose(); // Close the modal on successful save
      refresher((prev) => !prev); // Trigger a re-fetch of the data
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('Error updating section.', {
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const textColor = useColorModeValue("navy.700", "white");
  const inputTextColor = useColorModeValue("black", "white");
  
  if (!section) return null;


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={textColor}>Update Section</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, handleBlur, errors, touched }) => (
              <Form>
                <FormControl>
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
                      {values.subsections.map((sub, index) => (
                        <Box key={index} width="100%">
                          <FormControl display="flex" alignItems="center">
                            <Field
                              as={Input}
                              name={`subsections.${index}.name`}
                              placeholder={`Subsection ${index + 1} Name`}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={sub.name}
                              color={inputTextColor}
                            />
                            <IconButton
                              icon={<DeleteIcon />}
                              onClick={() => remove(index)}
                              aria-label="Remove subsection"
                              colorScheme="red"
                              ml={2}
                            />
                          </FormControl>
                          {errors.subsections && errors.subsections[index] && errors.subsections[index].name && touched.subsections && touched.subsections[index] && touched.subsections[index].name && (
                            <Text color="red.500">{errors.subsections[index].name}</Text>
                          )}
                        </Box>
                      ))}
                      <Button leftIcon={<AddIcon />} onClick={() => push({ name: '', section: section.id, description: '' })} colorScheme="blue">
                        Add Subsection
                      </Button>
                    </VStack>
                  )}
                </FieldArray>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} type="submit" isLoading={isLoading}>Save</Button>
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

export default UpdateSectionModal;
