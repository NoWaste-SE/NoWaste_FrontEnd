import React from 'react';
import { render, screen, fireEvent, getByAltText } from '@testing-library/react';
import HeaderCustomer from '../HeaderCustomer';

describe('Header Component', () => {

    it('redirects to homepage on logo click', () => {
        const { getByAltText } = render(<HeaderCustomer />);
        const logo = getByAltText('NoWaste');
        fireEvent.click(logo);
        expect(window.location.href).toBe('http://localhost/');
    });

    it('increases wallet amount when adding to wallet', () => {
        render(<HeaderCustomer />);
        const walletIcon = screen.getByLabelText('account of current user');
        fireEvent.click(walletIcon);
        const walletMenuItem = screen.getByText('Wallet');
        fireEvent.click(walletMenuItem);
    
        // Add an amount to wallet
        const addButton = screen.getByText('+');
        fireEvent.click(addButton);
        const addToWalletButton = screen.getByText('Add to wallet');
        fireEvent.click(addToWalletButton);
    
        // Ensure the balance is updated
        const updatedBalance = screen.getByText(/Balance: \d+ \$/);
        expect(updatedBalance).toBeInTheDocument();
    });
    
    it('opens wallet modal on wallet icon click', () => {
        render(<HeaderCustomer />);
        const walletIcon = screen.getByLabelText('account of current user');
        fireEvent.click(walletIcon);
        const walletMenuItem = screen.getByText('Wallet');
        fireEvent.click(walletMenuItem);
        const walletModal = screen.getByText('Credit');
        expect(walletModal).toBeInTheDocument();
    });
});
