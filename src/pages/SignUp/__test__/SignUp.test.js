import SignUp from '../SignUp';

import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
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
    // expect(restaurantCheckBox).not.toBeChecked

    fireEvent.click(restaurantCheckBox);
    expect(restaurantCheckBox).not.toBe;
});

// it("Check if text is written in the textfield", () => {
//     render(
//         <MockedSignUp />
//     );
//     const fullName = screen.findByLabelText(/Full name/i);

//     fireEvent.change(fullName, { target: { value: "Hni Asadi"}});
//     expect(fullName.value).toBe("Hni Asadi");
// });