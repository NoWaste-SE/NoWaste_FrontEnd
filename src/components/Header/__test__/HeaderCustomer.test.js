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
});
