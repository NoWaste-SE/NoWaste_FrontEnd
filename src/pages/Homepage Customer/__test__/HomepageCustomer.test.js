import AuthContext, { AuthProvider } from "../../../Context/AuthContext";
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import HomepageCustomer from "../HomepageCustomer";
describe("HomepageCustomer", () => {
    it("renders the component", async () => {
    render(
        <MemoryRouter>
            <AuthProvider>
            <HomepageCustomer />
            </AuthProvider>
        </MemoryRouter>
    );

    await waitFor(() => {
        const spinnerElement = screen.getByTestId("spinner-element");
    });
    const spinnerElement = screen.getByTestId("spinner-element");
    expect(spinnerElement).toBeInTheDocument();
    });

    // it('renders HeaderCustomer component within HomepageCustomer', () => {
    //     render(
    //       <MemoryRouter>
    //         <AuthProvider>
    //           <HomepageCustomer />
    //         </AuthProvider>
    //       </MemoryRouter>
    //     );
    
    //     const headerElement = screen.getByText(/HeaderCustomer/i);
    //     expect(headerElement).toBeInTheDocument();
    //   });

    it('handles click event in ToggleButtonGroup', () => {
        render(
            <MemoryRouter>
              <AuthProvider>
                <HomepageCustomer />
              </AuthProvider>
            </MemoryRouter>
          );
        
        // Assuming "Iranian" button is initially selected
        const iranianButton = screen.getByText(/Iranian/i);
        const foreignButton = screen.getByText(/Foreign/i);
      
        // Simulate click on "Foreign" button
        fireEvent.click(foreignButton);
      
        expect(iranianButton).not.toHaveAttribute('aria-pressed', 'true');
        expect(foreignButton).toHaveAttribute('aria-pressed', 'true');
      });

      

});
