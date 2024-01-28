import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomRestaurantCard } from '../CustomRestaurantCard';

const mockRestaurant = {
    id: 1,
    name: 'Test Restaurant',
    establishment_date: '2022-01-28',
    restaurant_image: 'test-image.jpg',
    description: 'This is a test restaurant.',
    rate: 4.5,
    number: '123-456-7890',
    address: '123 Test Street, Test City',
};

describe('CustomRestaurantCard Component', () => {
    it('renders restaurant details correctly', () => {
        render(<CustomRestaurantCard restaurant={mockRestaurant} />);

        expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
        expect(screen.getByText('This is a test restaurant.')).toBeInTheDocument();
        expect(screen.getByText('See Comments')).toBeInTheDocument();
        expect(screen.getByAltText('RestaurantImage')).toBeInTheDocument();
    });
});
