import React, { useEffect, useState } from 'react';
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
} from "@chakra-ui/react";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SelectSections from '../sections/SelectSections';
import api from 'api'; // Import API configuration for HTTP requests

const AddRepositoryModal = ({ isOpen, onClose, refresher }) => {
  const [sections, setSections] = useState([]); // State to store list of sections fetched from the API
  const [selectedSections, setSelectedSections] = useState([]); // State to store user-selected sections

  // Fetch sections from the API when the component mounts
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await api.get('/api/sections/');
        setSections(response.data); // Set the sections state with the fetched data
      } catch (error) {
        console.error('Error fetching sections:', error); // Log any errors during the fetch
      }
    };

    fetchSections();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    sections: Yup.array().min(1, 'At least one section is required'),
  });

  const handleSave = async (values) => {
    try {
      const sections_id = selectedSections.map(sec => sec.value); // Extract the section IDs from the selected sections
      const response = await api.post('/api/repositories/', {
        name: values.name,
        sections: sections_id,
      });
      console.log(response); // Log the successful server response
      toast.success('Repository added successfully!', {
        position: 'bottom-center',
      });
      onClose(); // Close the modal on successful save
      refresher((prev) => !prev); // Trigger a refresh of the parent component's data
    } catch (error) {
      console.error('Error saving repository:', error); // Log any errors encountered during save
      toast.error('Error saving repository.', {
        position: 'bottom-center',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Repository</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Formik
            initialValues={{ name: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSave}
          >
            {({ errors, touched }) => (
              <Form>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Field as={Input} name="name" placeholder="Name" />
                  {errors.name && touched.name ? (
                    <div style={{ color: 'red' }}>{errors.name}</div>
                  ) : null}
                </FormControl>
                <SelectSections
                  sections={sections}
                  selectedSections={selectedSections}
                  setSelectedSections={setSelectedSections}
                />
                <ModalFooter>
                  <Button colorScheme="blue" type="submit" mr={3}>Save</Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddRepositoryModal;
