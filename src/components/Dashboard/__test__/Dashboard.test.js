import AuthContext, { AuthProvider } from "../../../Context/AuthContext";
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../Dashboard";
describe("Dashboard", () => {
it("renders the component", async () => {
    render(
        <MemoryRouter>
            <AuthProvider>
                <Dashboard />
            </AuthProvider>
        </MemoryRouter>
    );

    await waitFor(() => {
        const spinnerElement = screen.getByTestId("spinner-element");
    });
    const spinnerElement = screen.getByTestId("spinner-element");
    expect(spinnerElement).toBeInTheDocument();
});

it("see the text", async () => {
    render(
        <MemoryRouter>
            <AuthProvider>
                <Dashboard />
            </AuthProvider>
        </MemoryRouter>
    );

    const dashboardText = screen.getByText(/Dashboard/i);
    expect(dashboardText).toBeInTheDocument();
});
});
