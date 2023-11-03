import React from 'react';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import Landing from './Landing';
import { createRoot } from 'react-dom/client';

test('Renders loading spinner initially', () => {
  const history = createMemoryHistory();
  const root = createRoot(document.createElement('div'));
  root.render(
    <Router history={history}>
      <Landing />
    </Router>
  );
});

test('Renders buttons after loading', async () => {
  const history = createMemoryHistory();

  await act(() => {
    render(
      <Router history={history}>
        <Landing />
      </Router>
    );
  });

  // Wait for the loading spinner to disappear
  await waitFor(() => {
    expect(screen.queryByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign up' })).toBeInTheDocument();
  });

  const loginButton = screen.getByRole('button', { name: /Log in/i });
  const signupButton = screen.getByRole('button', { name: /Sign up/i });

  expect(loginButton).toBeInTheDocument();
  expect(signupButton).toBeInTheDocument();
});
test('Clicking login button navigates to the login page', async () => {
  const history = createMemoryHistory();

  await act(() => {
    render(
      <Router history={history}>
        <Landing />
      </Router>
    );
  });

  // Wait for the loading spinner to disappear
  await waitFor(() => {
    expect(screen.queryByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign up' })).toBeInTheDocument();
  });

  const loginButton = screen.getByRole('button', { name: /Log in/i });

  // Wrap the click event in act()
  act(() => {
    fireEvent.click(loginButton);
  });

  // Ensure that navigation occurred
  expect(history.location.pathname).toBe('/login');
});