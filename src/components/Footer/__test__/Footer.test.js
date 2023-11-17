import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Footer from '../Footer';

describe('Footer Component', () => {

    test('renders footer component', () => {
        render(<Footer />);
        
        // Check if certain elements are present in the footer
        expect(screen.getByText(/NoWaste is a food distribution app/i)).toBeTruthy();
        expect(screen.getByText(/About us/i)).toBeTruthy();
        expect(screen.getByText(/Useful links/i)).toBeTruthy();
        expect(screen.getByText(/Contact/i)).toBeTruthy();
        expect(screen.getByText(/Follow us/i)).toBeTruthy();
        expect(screen.getByText(/NoWaste.ir/i)).toBeTruthy();
    });

    test('renders social media links in footer', () => {
        render(<Footer />);
        
        // Check if social media icons are present with proper accessibility labels
        expect(screen.getByTestId('twitter-link')).toBeTruthy();
        expect(screen.getByTestId('instagram-link')).toBeTruthy();
    });

    test('opens twitter link in a new tab', () => {
        render(<Footer />);

        const twitterLink = screen.getByTestId('twitter-link');    
        fireEvent.click(twitterLink);
    
        expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/NoWaste39');
    });

    test('verifies styles of footer elements', () => {
        render(<Footer />);
        
        const footer = screen.getByTestId('footer-component');
        const copyrightDiv = screen.getByTestId('copyright-div');
    
        const footerStyles = window.getComputedStyle(footer);
        const copyrightStyles = window.getComputedStyle(copyrightDiv);
    
        expect(footerStyles.backgroundColor).toBe('rgba(0, 0, 0, 0.1)');
        expect(copyrightStyles.backgroundColor).toBe('rgba(0, 0, 0, 0.05)');
    });
});
