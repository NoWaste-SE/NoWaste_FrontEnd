import { render, fireEvent, screen } from '@testing-library/react';
import Edit from '../EditProfile'; 

test('Toggle password fields on "Change password" button click', () => {
    render(<Edit />);

    expect(screen.queryByText('New password')).toBeNull();
    expect(screen.queryByText('Confirm new password')).toBeNull();

    fireEvent.click(screen.getByText('Change password'));

    expect(screen.getByText('New password')).toBeInTheDocument();
    expect(screen.getByText('Confirm new password')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Change password'));
    expect(screen.queryByText('New password')).toBeNull();
    expect(screen.queryByText('Confirm new password')).toBeNull();
});
