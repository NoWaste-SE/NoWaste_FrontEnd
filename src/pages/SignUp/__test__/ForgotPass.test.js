import ForgotPass from '../ForgotPass';
import React from 'react';
import { render, screen, act, fireEvent, waitFor, findByLabelText, findByText, getByTestId } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

const MockedForgotPass = () => {
    return (
        <MemoryRouter>
            <ForgotPass />
        </MemoryRouter>
    );
};

it("Forgot Your Password", () => {
    render(<MockedForgotPass />);
    const forgotText = screen.findByText(/Forgot Your Password?/i);

    expect(forgotText).toBeInTheDocument;
});

it('displays error messages for invalid input', async () => {
    render(
        <MockedForgotPass />
    );
        
    await waitFor(() => {
        const emailError = screen.findByText(/Invalid email/i);
        
        expect(emailError).toBeInTheDocument;
    });
});

it('disable button when there is no input', () => {
    render(
        <MockedForgotPass />
    );
    const buttonElement = screen.getByRole('button', { name: /continue/i });
    expect(buttonElement).toBeDisabled;
});

it("back to login", () => {
    render(<MockedForgotPass />);
    const backText = screen.findByText(/back to login/i);

    expect(backText).toBeInTheDocument;
});

test('Click on back', async () => {
    const history = createMemoryHistory();

    render(
        <Router history={history}>
        <MockedForgotPass />
        </Router>
    );

    const backText = screen.getByText(/back to login/i);

    act(() => {
        fireEvent.click(backText);
    });

    expect(history.location.pathname).toBe('/');
});