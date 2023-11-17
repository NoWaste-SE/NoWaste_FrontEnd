import Login from '../Login';
import React from 'react';
import { render, screen, act, fireEvent, waitFor, findByLabelText, findByText, getByTestId } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

const MockedLogin = () => {
    return (
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );
};

it("login", () => {
    render(<MockedLogin />);
    const loginText = screen.findByText(/Login/i);

    expect(loginText).toBeInTheDocument;
});


it('disable button when there is no input', () => {
    render(
        <MockedLogin />
    );
    
    const buttonElement = screen.getByRole('button', { name: /Login/i });
    expect(buttonElement).toBeDisabled;
});

it("forgot password", () => {
    render(<MockedLogin />);
    const forgotpassText = screen.findByText(/Forgot password?/i);

    expect(forgotpassText).toBeInTheDocument;
});

it("don't have account", () => {
    render(<MockedLogin />);
    const haveaccountText = screen.findByText(/Don't have an account?/i);

    expect(haveaccountText).toBeInTheDocument;
});

test('Click on forgot pass', async () => {
    const history = createMemoryHistory();
    render(
    <Router history={history}>
        <MockedLogin />
    </Router>
    );

    const forgotpassText = screen.getByText(/Forgot password?/i);

    act(() => {
    fireEvent.click(forgotpassText);
    });

    expect(history.location.pathname).toBe('/');
});

test('Click on sign up', async () => {
    const history = createMemoryHistory();

    render(
        <Router history={history}>
        <MockedLogin />
        </Router>
    );

    const signupText = screen.getByText(/Sign up/i);

    act(() => {
        fireEvent.click(signupText);
    });

    expect(history.location.pathname).toBe('/');
});