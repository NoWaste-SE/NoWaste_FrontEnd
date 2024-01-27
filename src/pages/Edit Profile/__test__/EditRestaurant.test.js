import EditRestaurant from '../EditRestaurant';
import React from 'react';
import { render, screen, act, fireEvent, waitFor, findByLabelText, findByText, getByTestId } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import AuthContext, { AuthProvider } from '../../../Context/AuthContext';

describe("edit profile restaurant", () => {
    it("renders the component", async () => {
        render(
            <MemoryRouter>
                <AuthProvider>
                    <EditRestaurant />
                </AuthProvider>
            </MemoryRouter>
        );
    
        await waitFor(() => {
            const spinnerElement = screen.getByTestId("spinner-element");
        });
        const spinnerElement = screen.getByTestId("spinner-element");
        expect(spinnerElement).toBeInTheDocument();
    });
});