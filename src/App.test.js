import { render, screen } from '@testing-library/react';
import App from './App';

test('renders fitness tracker dashboard', () => {
  render(<App />);
  const textElement = screen.getByText(/fitness tracker dashboard/i);
  expect(textElement).toBeInTheDocument();
});