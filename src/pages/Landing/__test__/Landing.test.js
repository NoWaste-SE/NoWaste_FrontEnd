import AuthContext, { AuthProvider } from "../../../Context/AuthContext";
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Landing from "../Landing";
describe("Landing", () => {
  it("renders the component", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Landing />
        </AuthProvider>
      </MemoryRouter>
    );
    // await new Promise(process.nextTick);

    await waitFor(
      () => {
        const spinnerElement = screen.getByTestId("spinner-element");
      },
      { timeout: 3000 }
    );
    const spinnerElement = screen.getByTestId("spinner-element");
    expect(spinnerElement).toBeInTheDocument();
    // expect(screen.getByText("Log in")).toBeInTheDocument();
  });
});
