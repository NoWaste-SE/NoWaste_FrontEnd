import AboutUs from '../AboutUs';
import React from 'react';
import { render, screen, act, fireEvent, waitFor, findByLabelText, findByText, getByTestId } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import AuthContext, { AuthProvider } from '../../../Context/AuthContext';

describe("About Us", () => {
    it("renders the component", () => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <AboutUs />
                </AuthProvider>
            </MemoryRouter>
        );
        const aboutUsTitle = screen.getByText(/About NoWaste/i);
        expect(aboutUsTitle).toBeInTheDocument();
    });

    it("steps button", () => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <AboutUs />
                </AuthProvider>
            </MemoryRouter>
        );
        const continueButton = screen.getByRole('button', { name: /Continue/i });
        const backButton = screen.getByRole('button', { name: /Back/i });

        expect(continueButton).toBeInTheDocument();
        expect(backButton).toBeInTheDocument();
    });

    it("github links of Helia Vafaei", () => {
        const history = createMemoryHistory();

        render(
            <Router history={history}>
                <AuthProvider>
                    <AboutUs />
                </AuthProvider>
            </Router>
        );

        const githubLink = screen.getByText(/Helia Vafaei/i);

        act(() => {
            fireEvent.click(githubLink);
        });

        expect(history.location.pathname).toEqual('/');
    });    
});