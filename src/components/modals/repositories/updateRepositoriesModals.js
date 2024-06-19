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
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from 'api';
import SelectSections from '../sections/SelectSections';

function UpdateRepositoryModal({ isOpen, onClose, repository, refresher }) {
  const [sections, setSections] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get('/api/sections/');
        setSections(response.data);
        if (repository) {
          // Transform the initial selected sections from the repository to match the select component format
          const initialSections = repository.sections;
          setSelectedSections(response.data.filter(sec => initialSections.includes(sec.id)).map(sec => ({ value: sec.id, label: sec.name })));
        }
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };

    fetchSections();
  }, [repository]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  });

  const handleSubmit = async (values) => {
    try {
      const repository_id = repository.id;
      const response = await api.put(`/api/repositories/${repository_id}/`, {
        name: values.name,
        sections: selectedSections.map(sec => sec.value), // Only send section IDs to the backend
      });
      console.log(response);
      toast.success('Repository updated successfully!', {
        position: 'top-center',
      });
      onClose();
      refresher((prev) => !prev);
    } catch (error) {
      console.error('Error updating repository:', error);
      toast.error('Error updating repository.', {
        position: 'top-center',
      });
    }
  }

  const textColor = useColorModeValue("navy.700", "white");
  const inputTextColor = useColorModeValue("black", "white");

  if (!repository) return null;


  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color={textColor}>Update Repository</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{ name: repository.name || '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ errors, touched }) => (
              <Form>
                <FormControl>
                  <FormLabel color={textColor}>Name</FormLabel>
                  <Field as={Input} name="name" placeholder="Enter repository name" color={inputTextColor} />
                  {errors.name && touched.name ? (
                    <Text color="red.500">{errors.name}</Text>
                  ) : null}
                </FormControl>
                <SelectSections
                  sections={sections}
                  selectedSections={selectedSections}
                  setSelectedSections={setSelectedSections}
                />
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} type="submit">Save</Button>
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

export default UpdateRepositoryModal;
