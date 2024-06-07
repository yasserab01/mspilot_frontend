import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AddCompanyModal from './addCompanyModal';
import { ChakraProvider } from '@chakra-ui/react';

// Mock API
jest.mock('api', () => ({
  post: jest.fn(() => Promise.resolve({ data: { id: 1, name: 'Test Company' } })),
}));

// Mock the refresher function
const mockRefresher = jest.fn();

describe('AddCompanyModal', () => {
  it('renders correctly when open', () => {
    render(
      <ChakraProvider>
        <AddCompanyModal isOpen={true} onClose={jest.fn()} refresher={mockRefresher} />
      </ChakraProvider>
    );

    expect(screen.getByText('Add New Company')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls the API and refresher on save', async () => {
    render(
      <ChakraProvider>
        <AddCompanyModal isOpen={true} onClose={jest.fn()} refresher={mockRefresher} />
      </ChakraProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test Company' } });
    fireEvent.click(screen.getByText('Save'));

    expect(await screen.findByText('Company added.')).toBeInTheDocument();
    expect(mockRefresher).toHaveBeenCalled();
  });

  it('handles API errors', async () => {
    const api = require('api');
    api.post.mockImplementationOnce(() => Promise.reject(new Error('API error')));

    render(
      <ChakraProvider>
        <AddCompanyModal isOpen={true} onClose={jest.fn()} refresher={mockRefresher} />
      </ChakraProvider>
    );

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Test Company' } });
    fireEvent.click(screen.getByText('Save'));

    expect(await screen.findByText('Error')).toBeInTheDocument();
  });
});
