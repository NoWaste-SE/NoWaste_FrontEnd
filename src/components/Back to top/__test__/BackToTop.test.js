import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import BackToTop from "../BackToTop";

const scrollToMock = jest.fn();
Object.defineProperty(window, 'scrollTo', { value: scrollToMock });

describe("BackToTop Component", () => {
    test("renders back-to-top button initially hidden", () => {
        render(<BackToTop />);
        const backButton = screen.queryByRole("button");
        expect(backButton).toBeNull();
    });

    test("renders back-to-top button after scrolling", () => {
        render(<BackToTop />);
        expect(screen.queryByRole("button")).toBeNull();

        window.scrollY = 101;
        fireEvent.scroll(window);

        const backButton = screen.queryByRole("button");
        expect(backButton).toBeTruthy();

        window.scrollY = 0;
        fireEvent.scroll(window);
        expect(screen.queryByRole("button")).toBeNull();
    });

    test("scrolls to top when back-to-top button is clicked", () => {
        render(<BackToTop />);
        window.scrollY = 150;
        fireEvent.scroll(window);

        const backButton = screen.getByRole("button");
        fireEvent.click(backButton);

        expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
});
