import AuthContext, { AuthProvider } from "../../../Context/AuthContext";
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ShowComments from "../ShowComments";
describe("ShowComments", () => {
it("renders the component", async () => {
    render(
        <MemoryRouter>
            <AuthProvider>
                <ShowComments />
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
