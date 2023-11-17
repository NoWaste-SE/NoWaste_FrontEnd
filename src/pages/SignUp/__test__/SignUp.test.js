import SignUp from '../SignUp';
import React from 'react';
import { render, screen, act, fireEvent, waitFor, findByLabelText, findByText, getByTestId } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const MockedSignUp = () => {
    return (
        <MemoryRouter>
            <SignUp />
        </MemoryRouter>
    );
};

it("sign up", () => {
    render(<MockedSignUp />);
    const signUpText = screen.findByText(/Sign Up/i);

    expect(signUpText).toBeInTheDocument;
});

it("Checkk Box", () => {
    render(
        <MockedSignUp />
    );
    const restaurantCheckBox = screen.getByLabelText(/Sign up as restaurant manager/i);

    fireEvent.click(restaurantCheckBox);
    expect(restaurantCheckBox).not.toBe;
});

it('should render written text in input ', async() => {
    render(
        <MockedSignUp />
    );
    
    const fullNameInput = await screen.getByPlaceholderText("Full name");
    
    fireEvent.change(fullNameInput , { target: { value: 'some text' }});
    
    await waitFor(() => {
        expect(fullNameInput.value).toBe('some text');
    });
});

it('displays error messages for invalid inputs', async () => {
    render(
        <MockedSignUp />
    );
    
    const fullNameInput = await screen.getByPlaceholderText("Full name");
    const emailInput = await screen.getByPlaceholderText(/Email address/i);

    fireEvent.change(fullNameInput, { target: { value: 'Hanie' }}); // must show error message
    
    fireEvent.change(emailInput, { target: { value: 'hniasadi@' }}) // must show error message
    
    await waitFor(() => {
        const fullNameError = screen.getByText("Your full name should have at least two words.");
        const emailError = screen.findByText(/Invalid email/i);
        expect(fullNameError).toBeInTheDocument;
        
        expect(emailError).toBeInTheDocument;
    });
});

it('disabked button when there is no input', () => {
    render(
        <MockedSignUp />
    );
    
    const buttonElement = screen.getByRole('button', {
                                name: /Sign up/i
                            });
    expect(buttonElement).toBeDisabled;
});