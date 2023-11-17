import Verification from '../Verification';
import React from 'react';
import { render, screen, act, fireEvent, waitFor, findByLabelText, findByText, getByTestId } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const MockedVerification = () => {
    return (
        <MemoryRouter>
            <Verification />
        </MemoryRouter>
    );
};

it("check in verification page", () => {
    render(
        <MockedVerification />
    );
    const verificationElement = screen.findByText(/Verification/i);

    expect(verificationElement).toBeInTheDocument;
});

it('should render written text in input ', async() => {
    render(
        <MockedVerification />
    );
    
    const codeElement = await screen.getByPlaceholderText("Code");
    
    fireEvent.change(codeElement , { target: { value: 'some text' }});
    
    await waitFor(() => {
        expect(codeElement.value).toBe('some text');
    });
});

it('should show error text', async() => {
    render(
        <MockedVerification />
    );
    
    const codeElement = await screen.getByPlaceholderText("Code");
    
    fireEvent.change(codeElement , { target: { value: '12345' }});
    
    await waitFor(() => {
        const errorElement = screen.findByText('Code must have 6 numbers.');
        expect(errorElement).toBeInTheDocument;
    });
});

it('disabled button when there is invalid input', () => {
    render(
        <MockedVerification />
    );
    
    const buttonElement = screen.getByRole('button', {
                                name: /Verify code/i
                            });
    expect(buttonElement).toBeDisabled;
});

it('enable button when there is invalid input', async() => {
    render(
        <MockedVerification />
    );
    
    const codeElement = await screen.getByPlaceholderText("Code");

    fireEvent.change(codeElement , { target: { value: '123456' }});
                        
    await waitFor(() => {
            const buttonElement = screen.getByRole('button', {
                                name: /Verify code/i
                            });
        expect(buttonElement).toBeEnabled;
    });
});