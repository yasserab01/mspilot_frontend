import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { FormControl, FormLabel } from "@chakra-ui/react";

const SelectSections = ({ sections, selectedSections, setSelectedSections }) => {
    const animatedComponents = makeAnimated();

    // Options for the Select component
    const options = sections.map(section => ({
        value: section.id,
        label: section.name
    }));

    // Handle change events from the Select component
    // This now handles the full option objects
    const handleChange = selectedOptions => {
        setSelectedSections(selectedOptions || []); // Sets the entire object array or an empty array
    };

    return (
        <FormControl mt={4}>
            <FormLabel htmlFor='sections'>Sections</FormLabel>
            <Select
                components={animatedComponents}
                isMulti
                options={options}
                onChange={handleChange}
                placeholder="Select sections"
                closeMenuOnSelect={false}
                isSearchable
                name="sections"
                className="basic-multi-select"
                classNamePrefix="select"
                value={(selectedSections || []).map(section => options.find(option => option.value === section.value))}
            />
        </FormControl>
    );
}

export default SelectSections;
