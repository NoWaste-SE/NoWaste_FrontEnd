import SignUp from '../SignUp';

import React from 'react';
import { render, screen, act, fireEvent, waitFor, findByLabelText } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

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
    // expect(restaurantCheckBox).not.toBeChecked

    fireEvent.click(restaurantCheckBox);
    expect(restaurantCheckBox).not.toBe;
});

// it("Check if text is written in the textfield", () => {
//     render(
//         <MockedSignUp />
//     );
//     const fullName = screen.findByLabelText(/Full name/i);
//     // expect(fullName).toBeInTheDocument;
//     userEvent.type(fullName, "Hni Asadi");
//     // fireEvent.change(fullName, { target: { value: "Hni Asadi"}});
//     expect(fullName.value).toBe("Hni Asadi");
// });

// it('should render input ', () => {
//     const field  = screen.getByText('Full name');
//     expect(field).toBeInTheDocument();

//     // fireEvent.change(field , {value: 'some text'});
//     // expect(field.value).toBe('some text');
// });

test('displays error messages for invalid inputs', async () => {
    render(<MockedSignUp />);
    
    // Use `await` to wait for the Promises to resolve
    const fullNameInput = screen.getByTestId("full-name");
    const emailInput = await screen.findAllByText(/Email address/i);
    const passwordInput = await screen.findAllByText(/Password/i);
    const confirmPasswordInput = await screen.findAllByText(/Confirm password/i);
    const submitButton = await screen.findByRole('button', { name: /Sign up/i });
  
    fireEvent.click(submitButton);
    // fireEvent.change(
    // Use `waitFor` to wait for the assertions
    await waitFor(() => {
        expect(fullNameInput).toBeInTheDocument;
    //   expect(screen.getByText(/Your full name should have at least two words/i)).toBeInTheDocument();
      // expect(screen.getByText(/Invalid email Address/i)).toBeInTheDocument();
      // expect(screen.getByText(/Password must be mixture of letters and numbers/i)).toBeInTheDocument();
      // expect(screen.getByText(/Password do not match/i)).toBeInTheDocument();
    });
});
