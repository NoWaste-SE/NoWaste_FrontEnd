import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Food from '../Food';

// Mocking axios for API calls
jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: { new_remainder: 5 } })),
}));

const mockParams = { id: '1' };

const food = {
    name: 'Test Food',
    ingredients: ['I1', 'I2'],
    remainder: 5,
    price: 10,
    id: 1,
    restaurant_id: 1,
};

describe('Food component', () => {
// test('renders food name and ingredients', () => {
//     const mockParams = { id: '123' };
//     const { getByText } = render(
//         <MemoryRouter initialEntries={['/food/123']}>
//             <Route path="/food/:id">
//             <Food food={food} />
//             </Route>
//         </MemoryRouter>,
//         {
//             wrapper: MemoryRouter,
//         }
//     );
//     expect(screen.getByText('Test Food')).toBeInTheDocument();
//     expect(screen.getByText('Test Ingredients')).toBeInTheDocument();
// });

// test('increments count on add button click if remainder is available', async () => {
//     const { getByText } = render(
//         <MemoryRouter initialEntries={['/food/123']}>
//             <Route path="/food/:id">
//             <Food food={food} />
//             </Route>
//         </MemoryRouter>,
//         {
//             wrapper: MemoryRouter,
//         }
//     );

//     const addButton = screen.getByTestId('+button');
//     fireEvent.click(addButton);
//     await screen.waitFor(() => expect(screen.getByText('1')).toBeInTheDocument());
// });

// test('decrements count on remove button click if count is greater than zero', async () => {
//     const food = {
//     name: 'Test Food',
//     remainder: 5,
//     price: 10,
//     id: 1,
//     restaurant_id: 1,
//     };
//     const { getByText } = render(<Food food={food} />);
//     const removeButton = screen.getByText('-');
//     fireEvent.click(removeButton);
//     await screen.waitFor(() => expect(screen.getByText('0')).toBeInTheDocument());
// });

// test('disables add button if remainder is "there is no food"', () => {
//     const food = {
//     name: 'Test Food',
//     remainder: 'there is no food',
//     price: 10,
//     id: 1,
//     restaurant_id: 1,
//     };
//     const { getByText } = render(<Food food={food} />);
//     const addButton = screen.getByText('+');
//     expect(addButton).toBeDisabled();
// });

  // Add more tests for other functionalities as needed
});
