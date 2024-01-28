import React from 'react';
import { render, screen, fireEvent, getByAltText } from '@testing-library/react';
import HeaderRestaurant from '../HeaderRestaurant';

describe('Header Component', () => {

    it('redirects to homepage on logo click', () => {
        const { getByAltText } = render(<HeaderRestaurant />);
        const logo = getByAltText('NoWaste');
        fireEvent.click(logo);
        expect(window.location.href).toBe('http://localhost/');
    });
});
