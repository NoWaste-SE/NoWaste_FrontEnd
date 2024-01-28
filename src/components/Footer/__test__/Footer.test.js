import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
        expect(screen.getByText(/nowaste39.ir/i)).toBeTruthy();
    });

    test('renders social media links in footer', () => {
        render(<Footer />);
        
        // Check if social media icons are present with proper accessibility labels
        expect(screen.getByTestId('twitter-link')).toBeTruthy();
        expect(screen.getByTestId('instagram-link')).toBeTruthy();
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

    test('displays correct copyright information in the footer', () => {
        render(<Footer />);
    
        const copyrightDiv = screen.getByTestId('copyright-div');
        expect(copyrightDiv).toHaveTextContent('© 2023 Copyright: nowaste39.ir');
    });

    test('displays correct social media links in the footer', () => {
        render(<Footer />);
    
        const twitterLink = screen.getByTestId('twitter-link');
        const instagramLink = screen.getByTestId('instagram-link');
    
        expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/NoWaste39');
        expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/no_waste39?igshid=ZDdkNTZiNTM=');
    });
    
    
    test('displays correct contact information in the footer', () => {
        render(<Footer />);
        expect(screen.getByText(/IUST, Tehran, Iran/i)).toBeTruthy();
        expect(screen.getByText(/gen39.nowaste@gmail.com/i)).toBeTruthy();
    });
    
});
