// import React from 'react';
// import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
// import { createMemoryHistory } from 'history';
// import { Router } from 'react-router-dom';
// import Landing from '../Landing';
// import { MemoryRouter } from 'react-router-dom';
// import { createRoot } from 'react-dom/client';
// import '@testing-library/jest-dom/extend-expect';

// const MokedLanding = () => {
//   return (
//       <MemoryRouter>
//           <Landing />
//       </MemoryRouter>
//   );
// };

// it('Renders loading spinner initially', () => {
//   const history = createMemoryHistory();
//   const root = createRoot(document.createElement('div'));
//   root.render(
//     <Router history={history}>
//       <Landing />
//     </Router>
//   );
// });

// // test('Renders buttons after loading', async () => {
// //   const history = createMemoryHistory();

// //   await act(() => {
// //     render(
// //       <Router history={history}>
// //         <Landing />
// //       </Router>
// //     );
// //   });

// //   await waitFor(() => {
// //     expect(screen.queryByRole('button', { name: 'Log in' })).toBeInTheDocument();
// //     expect(screen.queryByRole('button', { name: 'Sign up' })).toBeInTheDocument();
// //   });
// // });

// test('Clicking login button navigates to the login page', async () => {
//   const history = createMemoryHistory();

//     render(
//       <Router history={history}>
//         <MokedLanding />
//       </Router>
//     );

//   // await waitFor(() => {
//   //   expect(screen.queryByRole('button', { name: 'Log in' })).toBeInTheDocument();
//   //   expect(screen.queryByRole('button', { name: 'Sign up' })).toBeInTheDocument();
//   // });

//   const loginButton = screen.getByRole('button', { name: /Log in/i });

//   act(() => {
//     fireEvent.click(loginButton);
//   });

//   expect(history.location.pathname).toBe('/login');
// });

// test('Clicking sign up button navigates to the signup page', async () => {
//   const history = createMemoryHistory();

//   await act(() => {
//     render(
//       <Router history={history}>
//         <Landing />
//       </Router>
//     );
//   });

//   // await waitFor(() => {
//   //   expect(screen.queryByRole('button', { name: 'Log in' })).toBeInTheDocument();
//   //   expect(screen.queryByRole('button', { name: 'Sign up' })).toBeInTheDocument();
//   // });

//   const signupButton = screen.getByRole('button', { name: /Sign up/i });

//   act(() => {
//     fireEvent.click(signupButton);
//   });

//   expect(history.location.pathname).toBe('/sign-up');
// });