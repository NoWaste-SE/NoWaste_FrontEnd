import NewPassword from '../NewPassword';
import React from 'react';
import { render, screen, act, fireEvent, waitFor, findByLabelText, findByText, getByTestId } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

const MokedNewPassword = () => {
    return (
        <MemoryRouter>
            <NewPassword />
        </MemoryRouter>
    );
};

it("Reset Your Password", () => {
    render(<MokedNewPassword />);
    const resetpassText = screen.findByText(/reset your password/i);

    expect(resetpassText).toBeInTheDocument;
});

it('displays error messages for invalid input', async () => {
    render(
        <MokedNewPassword />
    );
        
    await waitFor(() => {
        const passwordError = screen.findByText(/Password must be mixture of letters and numbers./i);
        const donotmatchdError = screen.findByText(/Password do not match!/i);
        
        expect(passwordError).toBeInTheDocument;
        expect(donotmatchdError).toBeInTheDocument;
    });
});

it('disable button when there is no input', () => {
    render(
        <MokedNewPassword />
    );
    const buttonElement = screen.getByRole('button', { name: /save/i });
    expect(buttonElement).toBeDisabled;
});

test('Clicking save button navigates to login page', async () => {
    const history = createMemoryHistory();

    render(
        <Router history={history}>
            <MokedNewPassword />
        </Router>
    );


  const buttonElement = screen.getByRole('button', { name: /save/i });

  act(() => {
    fireEvent.click(buttonElement);
  });

  expect(history.location.pathname).toBe('/');
});